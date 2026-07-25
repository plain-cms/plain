// admin/js/backend.js — the "Backend" screen (cms-spec.md §8). Some plugins
// (analytics, contact, feedback) send data to a small backend; this screen
// connects one: copy-paste setup for the reference backends, a health check,
// and a field that writes services.backend into site.config.json.

import { updateFile, auth, createFromTemplate } from './github.js';
import { h, toast, watchBuild } from './ui.js';

// Enabled plugins that talk to services.backend, and what each uses it for.
const CONSUMERS = {
  'sales-analytics': 'views + CTA clicks (POST /events, GET /reports)',
  'contact-form': 'contact submissions (POST /contact)',
  feedback: 'the feedback widget (POST /feedback)',
  'api-form': 'config-declared forms (POST to your endpoint)',
};

export async function backendScreen(siteInfo) {
  const current = (siteInfo.services || {}).backend || '';
  const consumers = Object.entries(CONSUMERS).filter(([id]) => (siteInfo.plugins || []).includes(id));

  // One-click: generate a backend repo in the writer's account from the plain-cms/backend template.
  const [owner, repoName = 'site'] = (auth.repo || '/').split('/');
  const created = h('span', { class: 'muted' });
  const create = h('button', { class: 'primary', onclick: async (event) => {
    const btn = event.currentTarget; btn.disabled = true; btn.textContent = 'Creating…';
    try {
      const repo = await createFromTemplate('plain-cms/backend', { owner, name: `${repoName}-backend`, description: `Backend for ${repoName} (plain CMS)` });
      created.replaceChildren('Created ', h('a', { href: repo.html_url, target: '_blank', rel: 'noopener' }, repo.full_name), ' — deploy its dotnet/ or node/ folder, then paste its URL below.'); btn.remove();
    } catch (error) {
      btn.disabled = false; btn.textContent = 'Create backend repo';
      created.textContent = error.status === 422 ? `You already have ${repoName}-backend — deploy it, then paste its URL.` : `Couldn’t create it (${error.message}).`;
    }
  } }, 'Create backend repo');

  const health = h('span', { class: 'muted' });
  const check = h('button', { onclick: async () => {
    health.textContent = ' checking…';
    try { const r = await fetch(`${current}/health`); health.textContent = r.ok ? ' ✓ healthy' : ` ✗ HTTP ${r.status}`; }
    catch { health.textContent = ' ✗ unreachable (check the URL and its CORS)'; }
  } }, 'Check health');

  const url = h('input', { type: 'url', value: current, placeholder: 'https://api.example.com' });
  const save = h('button', { class: 'primary', onclick: async () => {
    const value = url.value.trim().replace(/\/+$/, '');
    if (value && !/^https:\/\/\S+$/.test(value)) return toast('Use a full https:// URL — an endpoint only, never a secret.', 'error');
    try {
      const result = await updateFile('site.config.json', (text) => {
        const config = JSON.parse(text);
        config.services = { ...(config.services || {}) };
        if (value) config.services.backend = value; else delete config.services.backend;
        return JSON.stringify(config, null, 2) + '\n';
      }, value ? 'settings: connect backend' : 'settings: remove backend');
      toast(value ? 'Backend connected — your site is rebuilding.' : 'Backend removed.', 'success');
      watchBuild(result.commitSha, siteInfo.site.url);
    } catch (error) { toast(error.message, 'error'); }
  } }, 'Save');

  return h('div', {},
    h('header', { class: 'screen-head' }, h('h1', {}, 'Backend')),
    h('div', { class: 'cards' },
      h('section', { class: 'card' },
        h('h2', {}, 'Status'),
        current
          ? h('p', {}, 'Connected: ', h('code', {}, current), ' ', check, health)
          : h('p', { class: 'muted' }, 'No backend connected. Plugins that need one stay inert until you add it below.')),
      h('section', { class: 'card' },
        h('h2', {}, 'Connect a backend'),
        h('p', { class: 'muted' }, 'Plugins like analytics, contact, and feedback send data to a backend. Create one in your account from ', h('a', { href: 'https://github.com/plain-cms/backend', target: '_blank', rel: 'noopener' }, 'plain-cms/backend'), ' (.NET or Node, both SQLite and the same API), deploy it, then paste its URL below.'),
        h('p', { class: 'update-actions' }, create, created),
        h('label', { class: 'field' }, 'Backend URL', url),
        save),
      consumers.length ? h('section', { class: 'card' },
        h('h2', {}, 'Used by'),
        h('ul', {}, consumers.map(([id, use]) => h('li', {}, h('strong', {}, id), ` — ${use}`)))) : null),
  );
}
