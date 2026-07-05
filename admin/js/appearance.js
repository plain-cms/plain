// admin/js/appearance.js — themes, starters, try-on, customizer (cms-spec.md §10).
// The try-on renders the user's OWN pages with a candidate theme, entirely in
// the browser, using the same lib/template.js the build uses — what you
// preview is what deploys. Nothing is committed until Apply.

import { auth, getFile, putFile, listDir, listTree } from './github.js';
import { h, toast, ask, watchBuild } from './ui.js';
import { render } from '../lib/template.js';
import { collectionIndex } from './app.js';

/** Every theme in the repo: {name, title, description, starter?}. */
export async function loadThemes() {
  const dirs = (await listDir('themes')).filter((e) => e.type === 'dir');
  return Promise.all(dirs.map(async (dir) => {
    const meta = await getFile(`themes/${dir.name}/theme.json`).then((f) => JSON.parse(f.text)).catch(() => ({}));
    const starter = await getFile(`themes/${dir.name}/starter.json`).then((f) => JSON.parse(f.text)).catch(() => null);
    return { name: dir.name, title: meta.title || dir.name, description: meta.description || '', starter };
  }));
}

/** The design tokens declared at the top of a theme.css :root block. */
export function parseTokens(css) {
  const root = css.match(/:root\s*{([^}]*)}/);
  if (!root) return [];
  return [...root[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => ({ name: m[1], value: m[2].trim() }));
}

/**
 * Render one of the user's own pages with a candidate theme — client side,
 * byte-compatible with the build. Returns a self-contained HTML document.
 */
export async function themePreview(themeName, siteInfo, { page, tokens = {}, scheme = 'light' } = {}) {
  const base = `themes/${themeName}`;
  const load = async (dir) => {
    const files = {};
    for (const entry of (await listDir(dir)).filter((e) => e.name.endsWith('.html'))) {
      files[entry.name.slice(0, -5)] = (await getFile(`${dir}/${entry.name}`)).text;
    }
    return files;
  };
  const [templates, partials, cssFile] = await Promise.all([
    load(`${base}/templates`), load(`${base}/templates/partials`), getFile(`${base}/assets/theme.css`),
  ]);
  let css = cssFile.text;
  if (scheme === 'dark') css = css.replaceAll('@media (prefers-color-scheme: dark)', '@media all');

  const collections = {};
  for (const name of Object.keys(siteInfo.collections)) collections[name] = await collectionIndex(name);
  if (!page) page = collections.pages?.find((p) => p.slug === 'index') || { title: siteInfo.site.title, url: '/', content: '<p>Welcome.</p>', collection: 'pages' };
  const context = {
    site: siteInfo.site,
    page,
    nav: (siteInfo.navigation || []).map((e) => ({ ...e, current: e.url === page.url })),
    data: { navigation: siteInfo.navigation || [] },
    collections,
    feeds: [],
  };
  const templateName = siteInfo.collections[page.collection]?.template || 'page';
  const body = render(templates[templateName] || templates.page, context, partials);
  let html = render(templates.base, { ...context, body }, partials);
  const tokenCss = Object.keys(tokens).length
    ? `<style>:root{${Object.entries(tokens).map(([k, v]) => `${k}:${v}`).join(';')}}</style>` : '';
  return html
    .replace(/<link[^>]*\/assets\/theme\.css[^>]*>/, `<style>${css}</style>${tokenCss}`)
    .replace(/<script[^>]*enhance\.js[^>]*><\/script>/, '')
    .replace(/<link rel="icon"[^>]*>\n?/, '');
}

/**
 * Apply a starter (§10.3): merge its collections into config, set the theme
 * and the site block, optionally set navigation and install sample content.
 * Every write is a commit; returns the last commitSha.
 */
export async function applyStarter(theme, siteInfo, { site = {}, tokens = {}, navigation = true, samples = true, log = () => {} } = {}) {
  const starter = theme.starter || { starter: theme.name, collections: {} };
  log('Updating settings…');
  const configFile = await getFile('site.config.json');
  const config = JSON.parse(configFile.text);
  Object.assign(config.site, site, { theme: theme.name });
  config.collections = { ...config.collections, ...starter.collections };
  if (Object.keys(tokens).length) config.theme = { ...(config.theme || {}), tokens };
  let last = await putFile('site.config.json', JSON.stringify(config, null, 2) + '\n',
    `settings: apply the ${starter.starter} starter`, configFile.sha);

  if (navigation && starter.navigation?.length) {
    log('Setting up the menu…');
    const nav = await getFile('data/navigation.json').catch(() => ({ sha: undefined }));
    last = await putFile('data/navigation.json', JSON.stringify(starter.navigation, null, 2) + '\n', 'navigation: set starter menu', nav.sha);
  }

  const prefix = starter.sampleContent ? `themes/${theme.name}/${starter.sampleContent.replace(/\/$/, '')}/` : null;
  const sampleFiles = prefix ? await listTree(prefix) : [];
  if (samples && sampleFiles.length) {
    for (const file of sampleFiles) {
      const target = file.path.slice(prefix.length); // content/…, data/…, media/…
      if (!navigation && target === 'data/navigation.json') continue;
      log(`Adding ${target}…`);
      const text = (await getFile(file.path)).text;
      const existing = await getFile(target).catch(() => ({ sha: undefined }));
      last = await putFile(target, text, `content: install ${starter.starter} example ${target.split('/').pop()}`, existing.sha);
    }
  } else { // no samples: the build still needs each new collection's folder to exist
    for (const def of Object.values(starter.collections || {})) {
      if (!await getFile(`${def.path}/.gitkeep`).catch(() => null)) last = await putFile(`${def.path}/.gitkeep`, '', `content: create ${def.path}/`);
    }
  }
  return last.commitSha;
}

// --- the Appearance screen -----------------------------------------------------

const DEVICES = { Phone: '390px', Tablet: '768px', Desktop: '100%' };

export async function appearanceScreen(siteInfo) {
  const themes = await loadThemes();
  themes.sort((a, b) => (a.name === siteInfo.site.theme ? -1 : b.name === siteInfo.site.theme ? 1 : 0));

  const cards = themes.map((theme) => h('section', { class: 'card' },
    h('h2', {}, theme.title, theme.name === siteInfo.site.theme ? h('span', { class: 'badge' }, 'Active') : null),
    h('p', { class: 'muted' }, theme.description),
    h('div', { class: 'card-actions' },
      h('button', { class: 'primary', onclick: () => tryOn(theme, siteInfo) }, 'Preview with my content'))));

  return h('div', {},
    h('header', { class: 'screen-head' }, h('h1', {}, 'Appearance')),
    h('p', { class: 'muted' }, 'Try any look with your own pages before changing anything. Switching back is one click, and your content is never modified by a theme change.'),
    h('div', { class: 'cards' }, cards),
    h('h2', { class: 'browse-more' }, 'Browse more'),
    await registrySection(siteInfo));
}

// Starter registry (§10.6): a static registry.json in the community starters
// repo; Install copies the starter folder into this repo — no servers.
const REGISTRY_REPO = 'plain-cms/starters';

async function registrySection(siteInfo) {
  const entries = await fetch(`https://raw.githubusercontent.com/${REGISTRY_REPO}/main/registry.json`)
    .then((r) => (r.ok ? r.json() : [])).catch(() => []);
  if (!entries.length) return h('p', { class: 'muted' }, 'Community starters will appear here as they’re published.');
  return h('div', { class: 'cards' }, entries.map((entry) => h('section', { class: 'card' },
    h('h2', {}, entry.title || entry.id),
    h('p', { class: 'muted' }, `${entry.category ? `${entry.category} — ` : ''}${entry.description || ''}`),
    h('div', { class: 'card-actions' }, h('button', { class: 'primary', onclick: async (e) => {
      e.target.disabled = true;
      try {
        const repo = entry.repo || REGISTRY_REPO, ref = entry.ref || 'main', prefix = entry.path || entry.id;
        const { tree } = await fetch(`https://api.github.com/repos/${repo}/git/trees/${ref}?recursive=1`).then((r) => r.json());
        for (const file of tree.filter((f) => f.type === 'blob' && f.path.startsWith(`${prefix}/`))) {
          const text = await fetch(`https://raw.githubusercontent.com/${repo}/${ref}/${file.path}`).then((r) => r.text());
          const target = `themes/${entry.id}/${file.path.slice(prefix.length + 1)}`;
          toast(`Adding ${target}…`);
          const existing = await getFile(target).catch(() => ({ sha: undefined }));
          await putFile(target, text, `themes: install the ${entry.id} starter`, existing.sha);
        }
        toast(`${entry.title || entry.id} installed — reload this screen to preview it.`, 'success');
      } catch (error) { toast(error.message, 'error'); e.target.disabled = false; }
    } }, 'Install')))));
}

/** Full-screen try-on with device widths, scheme toggle, and the token customizer. */
async function tryOn(theme, siteInfo) {
  const state = { tokens: {}, scheme: 'light', page: null };
  const iframe = h('iframe', { class: 'tryon-frame', title: `Preview of ${theme.title}` });
  const posts = Object.keys(siteInfo.collections).filter((n) => siteInfo.collections[n].listUrl);
  const latestPost = posts.length ? (await collectionIndex(posts[0]))[0] : null;

  async function refresh() {
    try {
      iframe.srcdoc = await themePreview(theme.name, siteInfo, state);
    } catch (error) { toast(error.message, 'error'); }
  }

  const css = (await getFile(`themes/${theme.name}/assets/theme.css`)).text;
  const tokenRows = parseTokens(css).map((token) => {
    const isColor = /^#[0-9a-fA-F]{6}$/.test(token.value);
    const input = h('input', { type: isColor ? 'color' : 'text', value: token.value });
    input.addEventListener('input', () => { state.tokens[token.name] = input.value; refresh(); });
    return h('label', { class: 'token' }, token.name.slice(2), input,
      h('button', { class: 'linklike', title: 'Reset', onclick: () => { delete state.tokens[token.name]; input.value = token.value; refresh(); } }, '↺'));
  });
  const customizer = h('aside', { class: 'tryon-tokens', hidden: '' },
    h('h2', {}, 'Customize'),
    h('p', { class: 'muted' }, 'Changes preview instantly and apply with the theme. Your tweaks survive theme updates.'),
    tokenRows,
    h('button', { class: 'linklike', onclick: () => { state.tokens = {}; overlay.remove(); tryOn(theme, siteInfo); } }, 'Reset all'));

  async function apply() {
    const starter = theme.starter && Object.keys(theme.starter.collections || {}).length
      ? await ask({ title: `Use the full ${theme.title} starter?`, message: 'The starter adds its content types, menu, and example content. "Theme only" changes the look and touches nothing else.', actions: [{ label: 'Cancel', value: null }, { label: 'Theme only', value: false }, { label: 'Full starter', value: true, kind: 'primary' }] })
      : false;
    if (starter === null) return;
    try {
      let commitSha;
      if (starter) {
        commitSha = await applyStarter(theme, siteInfo, { tokens: state.tokens, log: (m) => toast(m) });
      } else {
        const file = await getFile('site.config.json');
        const config = JSON.parse(file.text);
        config.site.theme = theme.name;
        if (Object.keys(state.tokens).length) config.theme = { ...(config.theme || {}), tokens: state.tokens };
        ({ commitSha } = await putFile('site.config.json', JSON.stringify(config, null, 2) + '\n', `settings: switch theme to "${theme.name}"`, file.sha));
      }
      toast('Applied — your site is updating. Switching back is just as easy.', 'success');
      watchBuild(commitSha, siteInfo.site.url);
      overlay.remove();
    } catch (error) { toast(error.message, 'error'); }
  }

  const button = (label, onclick, cls = '') => h('button', { class: cls, onclick }, label);
  const overlay = h('div', { class: 'tryon' },
    h('header', { class: 'tryon-bar' },
      h('strong', {}, theme.title),
      h('span', { class: 'tryon-group' }, ...Object.entries(DEVICES).map(([label, width]) =>
        button(label, () => { iframe.style.width = width; }))),
      button('Light/Dark', () => { state.scheme = state.scheme === 'light' ? 'dark' : 'light'; refresh(); }),
      latestPost ? button('Home/Post', () => { state.page = state.page ? null : latestPost; refresh(); }) : null,
      button('Customize', () => { customizer.hidden = !customizer.hidden; }),
      button('Apply', apply, 'primary'),
      button('Close', () => overlay.remove())),
    h('div', { class: 'tryon-body' }, iframe, customizer));
  document.body.append(overlay);
  refresh();
}
