// admin/js/editor.js — the schema-driven editor (cms-spec.md §8.1 #3).
// Fields come from the collection's config schema; the body is Markdown with
// a toolbar and a live preview rendered by the same lib/markdown.js the build
// uses — what you see is what deploys.

import { getFile, getFileAt, putFile, deleteFile, commitsFor } from './github.js';
import { h, show, toast, timeAgo, watchBuild, ask, askText } from './ui.js';
import { parseFrontmatter, serializeFrontmatter, validateFields, urlFor } from '../lib/content.js';
import { renderMarkdown } from '../lib/markdown.js';
import { slugify } from '../lib/util.js';
import { uploadMedia } from './media.js';
import { singular } from './app.js';

export async function editorScreen({ siteInfo, collection, slug, onSaved }) {
  const def = siteInfo.collections[collection];
  if (!def) throw new Error(`Unknown collection "${collection}".`);
  const isNew = slug == null;
  const kind = singular(collection);
  let sha = null;
  let data = {};
  let body = '';
  let wasPublished = false;

  if (!isNew) {
    const file = await getFile(`${def.path}/${slug}.md`);
    sha = file.sha;
    ({ data, body } = parseFrontmatter(file.text, `${slug}.md`));
    wasPublished = data.draft !== true;
  }

  // --- fields (schema-driven) -----------------------------------------------

  const inputs = new Map(); // field name → the input element holding the value
  /** @returns {[Element, Element]} what to display, and the input holding the value */
  function control(field) {
    const value = data[field.name];
    switch (field.type) {
      case 'textarea': { const el = h('textarea', { rows: 3 }, value || ''); return [el, el]; }
      case 'date': { const el = h('input', { type: 'date', value: value || (isNew ? new Date().toISOString().slice(0, 10) : '') }); return [el, el]; }
      case 'boolean': { const el = h('input', { type: 'checkbox', checked: value ? '' : null }); return [el, el]; }
      case 'list': { const el = h('input', { type: 'text', value: (value || []).join(', '), placeholder: 'comma, separated' }); return [el, el]; }
      case 'select': { const el = h('select', {}, (field.options || []).map((o) => h('option', { value: o, selected: o === value ? '' : null }, o))); return [el, el]; }
      case 'image': {
        const input = h('input', { type: 'text', value: value || '', placeholder: '/media/…' });
        const picker = h('input', { type: 'file', accept: 'image/*', hidden: '' });
        picker.addEventListener('change', async () => {
          if (picker.files[0]) try { input.value = await uploadMedia(picker.files[0]); } catch (e) { toast(e.message, 'error'); }
        });
        return [h('span', { class: 'image-field' }, input, picker, h('button', { type: 'button', onclick: () => picker.click() }, 'Upload')), input];
      }
      default: { const el = h('input', { type: 'text', value: value || '' }); return [el, el]; }
    }
  }
  const fieldRows = def.fields.filter((f) => f.name !== 'draft').map((field) => {
    const [element, input] = control(field);
    inputs.set(field.name, input);
    return h('label', { class: 'field' }, `${field.name[0].toUpperCase()}${field.name.slice(1)}${field.required ? '' : ' (optional)'}`, element);
  });

  const slugInput = h('input', { type: 'text', value: slug || '', placeholder: 'from-the-title' });
  let slugTouched = !isNew;
  slugInput.addEventListener('input', () => { slugTouched = true; });
  inputs.get('title')?.addEventListener('input', () => {
    if (!slugTouched) slugInput.value = slugify(inputs.get('title').value);
  });

  function collect() {
    const next = { ...data }; // keep unknown keys (example:, custom fields)
    for (const field of def.fields) {
      if (field.name === 'draft') continue;
      const input = inputs.get(field.name);
      if (field.type === 'boolean') next[field.name] = input.checked;
      else if (field.type === 'list') {
        const items = input.value.split(',').map((s) => s.trim()).filter(Boolean);
        if (items.length) next[field.name] = items; else delete next[field.name];
      } else if (input.value.trim() === '') delete next[field.name];
      else next[field.name] = input.value.trim();
    }
    return next;
  }

  // --- body, toolbar, preview -------------------------------------------------

  const bodyInput = h('textarea', { class: 'body-input', placeholder: 'Write here. Formatting is optional — plain paragraphs are perfectly good posts.' });
  bodyInput.value = body.replace(/^\n/, '');
  const preview = h('div', { class: 'preview prose' });
  let previewTimer = null;
  const renderPreview = () => { preview.innerHTML = renderMarkdown(bodyInput.value); };
  bodyInput.addEventListener('input', () => { clearTimeout(previewTimer); previewTimer = setTimeout(renderPreview, 250); });
  renderPreview();

  function edit(transform) {
    const { selectionStart: from, selectionEnd: to, value } = bodyInput;
    const [next, cursor] = transform(value, from, to);
    bodyInput.value = next;
    bodyInput.setSelectionRange(cursor, cursor);
    bodyInput.focus();
    renderPreview();
  }
  const wrap = (mark) => edit((v, a, b) => [v.slice(0, a) + mark + v.slice(a, b) + mark + v.slice(b), b + mark.length * (a === b ? 1 : 2)]);
  const prefixLines = (prefix) => edit((v, a, b) => {
    const start = v.lastIndexOf('\n', a - 1) + 1;
    const block = v.slice(start, b).split('\n').map((l) => prefix + l).join('\n');
    return [v.slice(0, start) + block + v.slice(b), b + prefix.length];
  });
  async function insertImage(file) {
    const alt = await askText({ title: 'Describe this image', message: 'Alt text is what screen readers speak and search engines read. One short sentence.', placeholder: 'e.g. A rowboat on a misty lake' });
    if (alt === null) return;
    try {
      const path = await uploadMedia(file);
      edit((v, a) => [`${v.slice(0, a)}![${alt}](${path})${v.slice(a)}`, a]);
      toast('Image added.', 'success');
    } catch (error) { toast(error.message, 'error'); }
  }
  const imagePicker = h('input', { type: 'file', accept: 'image/*', hidden: '' });
  imagePicker.addEventListener('change', () => imagePicker.files[0] && insertImage(imagePicker.files[0]));
  const toolbar = h('div', { class: 'toolbar', role: 'toolbar' },
    h('button', { type: 'button', title: 'Bold', onclick: () => wrap('**') }, h('b', {}, 'B')),
    h('button', { type: 'button', title: 'Italic', onclick: () => wrap('*') }, h('i', {}, 'I')),
    h('button', { type: 'button', title: 'Heading', onclick: () => prefixLines('## ') }, 'H'),
    h('button', { type: 'button', title: 'Link', onclick: async () => {
      const url = await askText({ title: 'Link address', placeholder: 'https://… or /page/' });
      if (url) edit((v, a, b) => [`${v.slice(0, a)}[${v.slice(a, b) || 'link text'}](${url})${v.slice(b)}`, b + url.length + 4]);
    } }, '🔗'),
    h('button', { type: 'button', title: 'Bullet list', onclick: () => prefixLines('- ') }, '••'),
    h('button', { type: 'button', title: 'Insert image', onclick: () => imagePicker.click() }, '🖼'),
    imagePicker);

  bodyInput.addEventListener('paste', (e) => {
    const file = [...(e.clipboardData?.files || [])].find((f) => f.type.startsWith('image/'));
    if (file) { e.preventDefault(); insertImage(file); }
  });
  bodyInput.addEventListener('dragover', (e) => e.preventDefault());
  bodyInput.addEventListener('drop', (e) => {
    const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith('image/'));
    if (file) { e.preventDefault(); insertImage(file); }
  });

  // --- autosave (localStorage, every 5s while dirty) ---------------------------

  const autosaveKey = `plain.autosave:${collection}/${slug || '~new'}`;
  const snapshot = () => JSON.stringify({ data: collect(), body: bodyInput.value });
  let lastSaved = snapshot();
  const autosaveTimer = setInterval(() => {
    if (snapshot() !== lastSaved) localStorage.setItem(autosaveKey, snapshot());
  }, 5000);
  const stored = localStorage.getItem(autosaveKey);
  if (stored && stored !== lastSaved) {
    ask({ title: 'Pick up where you left off?', message: 'There are unsaved changes from an earlier session on this device.', actions: [{ label: 'Discard them', value: false }, { label: 'Restore my changes', value: true, kind: 'primary' }] })
      .then((restore) => {
        if (!restore) return localStorage.removeItem(autosaveKey);
        const saved = JSON.parse(stored);
        bodyInput.value = saved.body;
        for (const field of def.fields) {
          const input = inputs.get(field.name);
          if (!input) continue;
          const value = saved.data[field.name];
          if (field.type === 'boolean') input.checked = Boolean(value);
          else if (field.type === 'list') input.value = (value || []).join(', ');
          else input.value = value || '';
        }
        renderPreview();
      });
  }

  // --- save / publish ------------------------------------------------------------

  async function save(publish, { force = false } = {}) {
    const next = collect();
    next.draft = !publish;
    const newSlug = slugify(slugInput.value || next.title || '');
    if (!newSlug) return toast('Give it a title first — the address is made from it.', 'error');
    const file = `${def.path}/${newSlug}.md`;
    try { validateFields(next, def.fields, `${newSlug}.md`); } catch (error) { return toast(error.message, 'error'); }
    let text;
    try { text = serializeFrontmatter(next, `\n${bodyInput.value.trimEnd()}\n`, def.fields.map((f) => f.name)); } catch (error) { return toast(error.message, 'error'); }
    const verb = publish ? (wasPublished ? 'edit' : 'publish') : 'save draft';
    const message = `${kind}: ${verb} "${next.title || newSlug}"`;
    try {
      if (!isNew && newSlug !== slug) return await renameAndSave(file, newSlug, text, message);
      const result = await putFile(file, text, message, sha ?? undefined);
      afterSave(result, newSlug, next, publish);
    } catch (error) {
      if (error.status === 409 && !force) return conflict(publish);
      if (error.status === 422 && isNew) return toast(`Something already lives at “${newSlug}” — pick a different title or address.`, 'error');
      toast(error.message, 'error');
    }
  }

  async function renameAndSave(file, newSlug, text, message) {
    const oldUrl = urlFor(def.urlPattern, slug);
    const newUrl = urlFor(def.urlPattern, newSlug);
    const addRedirect = await ask({
      title: 'The address is changing',
      message: `“${oldUrl}” will become “${newUrl}”. Links to the old address would break — forward visitors to the new one?`,
      actions: [{ label: 'Cancel', value: 'cancel' }, { label: 'Just rename', value: false }, { label: 'Rename & forward', value: true, kind: 'primary' }],
    });
    if (addRedirect === 'cancel' || addRedirect === null) return;
    const result = await putFile(file, text, message);
    await deleteFile(`${def.path}/${slug}.md`, `${kind}: remove old copy of "${slug}"`, sha);
    if (addRedirect) {
      let redirects = {}, redirectsSha;
      try { const f = await getFile('data/redirects.json'); redirects = JSON.parse(f.text); redirectsSha = f.sha; } catch { /* start fresh */ }
      redirects[oldUrl] = newUrl;
      await putFile('data/redirects.json', JSON.stringify(redirects, null, 2) + '\n', `redirects: forward ${oldUrl} to ${newUrl}`, redirectsSha);
    }
    afterSave(result, newSlug, collect(), true);
  }

  function afterSave(result, newSlug, next, publish) {
    sha = result.sha;
    data = next;
    wasPublished = publish;
    lastSaved = snapshot();
    localStorage.removeItem(autosaveKey);
    onSaved?.();
    toast(publish ? 'Published — your site is updating.' : 'Draft saved. Only you can see it.', 'success');
    if (publish) watchBuild(result.commitSha, siteInfo.site.url + urlFor(def.urlPattern, newSlug));
    if (isNew || newSlug !== slug) { location.hash = `#/edit/${collection}/${newSlug}`; }
  }

  async function conflict(publish) {
    const choice = await ask({
      title: 'This was edited elsewhere',
      message: 'It changed since you opened it — maybe in another tab, or by someone else. Your text is still here in the editor.',
      actions: [{ label: 'Cancel', value: null }, { label: 'Load their version (discards mine)', value: 'reload' }, { label: 'Keep mine (overwrites theirs)', value: 'mine', kind: 'danger' }],
    });
    if (choice === 'reload') { clearInterval(autosaveTimer); show(await editorScreen({ siteInfo, collection, slug, onSaved })); }
    if (choice === 'mine') {
      ({ sha } = await getFile(`${def.path}/${slug}.md`));
      save(publish, { force: true });
    }
  }

  // --- history ---------------------------------------------------------------------

  async function historyPanel() {
    const versions = await commitsFor(`${def.path}/${slug}.md`);
    const rows = versions.map((version, i) => h('div', { class: 'history-row' },
      h('span', {}, h('strong', {}, version.message.replace(/^\w+: /, '')), h('span', { class: 'muted' }, ` — ${timeAgo(version.date)}`)),
      i === 0 ? h('span', { class: 'badge' }, 'Current') : h('button', { onclick: async () => {
        if (await ask({ title: 'Restore this version?', message: 'The current version stays in History — nothing is ever lost.', actions: [{ label: 'Cancel', value: null }, { label: 'Restore', value: true, kind: 'primary' }] })) {
          const old = await getFileAt(`${def.path}/${slug}.md`, version.sha);
          const result = await putFile(`${def.path}/${slug}.md`, old, `${kind}: restore "${slug}" (version from ${version.date.slice(0, 10)})`, sha);
          toast('Restored — your site is updating.', 'success');
          watchBuild(result.commitSha, siteInfo.site.url);
          clearInterval(autosaveTimer);
          show(await editorScreen({ siteInfo, collection, slug, onSaved }));
        }
      } }, 'Restore')));
    const dialog = h('dialog', { class: 'ask history' }, h('h2', {}, 'History'),
      h('p', { class: 'muted' }, 'Every save is kept forever. Restoring makes a new version — nothing is destroyed.'),
      rows.length ? rows : h('p', {}, 'No saves yet.'),
      h('div', { class: 'ask-actions' }, h('button', { onclick: () => dialog.close() }, 'Close')));
    dialog.addEventListener('close', () => dialog.remove());
    document.body.append(dialog);
    dialog.showModal();
  }

  // --- coach marks (first editor open only) --------------------------------------

  if (!localStorage.getItem('plain.coach')) {
    const tips = [
      'Write in the left pane. Formatting is optional — the toolbar inserts it for you.',
      'The right pane is your real site: the preview uses the exact same renderer.',
      'Publish makes it live in about 30 seconds — and History means you can always undo.',
    ];
    let step = 0;
    const text = h('p', {}, tips[0]);
    const nextButton = h('button', { class: 'primary', onclick: () => {
      step += 1;
      if (step >= tips.length) { localStorage.setItem('plain.coach', 'done'); coach.remove(); return; }
      text.textContent = tips[step];
      if (step === tips.length - 1) nextButton.textContent = 'Got it';
    } }, 'Next');
    const coach = h('div', { class: 'coach' }, text, nextButton);
    setTimeout(() => document.querySelector('.editor')?.prepend(coach), 100);
  }

  // --- layout ---------------------------------------------------------------------

  return h('div', { class: 'editor' },
    h('header', { class: 'screen-head' },
      h('a', { href: isNew ? `#/collection/${collection}` : `#/collection/${collection}`, class: 'back' }, '←'),
      h('h1', {}, isNew ? `New ${kind}` : (data.title || slug)),
      h('div', { class: 'editor-actions' },
        isNew ? null : h('button', { onclick: historyPanel }, 'History'),
        h('button', { onclick: () => save(false) }, 'Save draft'),
        h('button', { class: 'primary', onclick: () => save(true) }, 'Publish')),
    ),
    h('div', { class: 'editor-fields' }, ...fieldRows,
      h('label', { class: 'field' }, 'Address (from the title)', slugInput)),
    h('div', { class: 'editor-split' },
      h('div', { class: 'editor-write' }, toolbar, bodyInput),
      preview),
  );
}
