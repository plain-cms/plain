// admin/js/backend-data.js — the admin's plugin API for backend-backed screens.
//
// One factory: point it at a named service and a path, hand it a render
// function, and it deals with sign-in, loading, 401 re-prompting, errors and
// refresh. It authenticates with your GitHub sign-in by default (backends in
// GitHub mode — Admin:Repo); a pasted admin token is the fallback for
// static-token backends. Either is sent only to your backend.
//
// The Feedback and Insights screens were once written out here in full; they
// now live in `plugins/feedback/admin.js` and `plugins/sales-analytics/admin.js`
// as ordinary consumers of this factory, which is what any plugin can be.

import { h } from './ui.js';
import { auth } from './github.js';

const TOKEN_KEY = 'plain.backend.token';   // fallback static token for backends not in GitHub mode
const num = (n) => Number(n || 0).toLocaleString('en-US');
const pct = (a, b) => `${b ? Math.round((a / b) * 1000) / 10 : 0}%`;
const when = (s) => { const d = new Date(s); return isNaN(d) ? String(s || '') : d.toLocaleString(); };

// Resolve a named service, fetch `path` with your GitHub token (or a pasted fallback token),
// prompting on 401/403, and hand the parsed JSON to render(). h() sets strings as textContent,
// so backend data is inert in the DOM — no escaping needed.
//
// Exported as the admin's plugin API: a plugin's admin module receives this in
// its context and gets sign-in, loading, 401 re-prompting, error and refresh
// handling for free — without ever touching the GitHub token itself.
export function dataScreen(siteInfo, { title, path, hint, render, service = 'backend' }) {
  const api = (siteInfo.services || {})[service] || '';
  const body = h('div', { class: 'data-view' });
  const screen = h('div', {},
    h('header', { class: 'screen-head' }, h('h1', {}, title)),
    h('div', { class: 'cards' }, h('section', { class: 'card' }, body)));
  if (!api) {
    body.append(service === 'backend'
      ? h('p', { class: 'muted' }, 'No backend connected. Connect one on the ', h('a', { href: '#/backend' }, 'Backend'), ' screen first — that’s where this data comes from.')
      : h('p', { class: 'muted' }, `No "${service}" service is set. Add it to "services" in site.config.json — that’s where this data comes from.`));
    return screen;
  }
  const bar = () => h('p', { class: 'update-actions' },
    h('button', { onclick: load }, 'Refresh'),
    h('button', { class: 'linklike', onclick: () => { forget(); askToken(); } }, 'Change token'));
  const forget = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } };
  function askToken() {
    const input = h('input', { type: 'password', placeholder: 'backend admin token', autocomplete: 'off' });
    body.replaceChildren(h('form', { class: 'data-auth', onsubmit: (event) => {
      event.preventDefault();
      const value = input.value.trim(); if (!value) return;
      try { localStorage.setItem(TOKEN_KEY, value); } catch { /* private mode */ }
      load();
    } }, h('p', { class: 'muted' }, hint), h('label', {}, 'Backend admin token', input), h('button', { class: 'primary' }, 'View')));
  }
  async function load() {
    body.replaceChildren(h('p', { class: 'muted' }, 'Loading…'));
    // Prefer a manually-pasted token (static-token backends); else the GitHub login token.
    let token = auth.token; try { token = localStorage.getItem(TOKEN_KEY) || auth.token; } catch { /* private mode */ }
    try {
      const res = await fetch(`${api}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.status === 401 || res.status === 403) return askToken();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      body.replaceChildren(bar(), render(await res.json()));
    } catch (error) {
      body.replaceChildren(bar(), h('p', { class: 'muted' }, `Couldn’t reach your backend (${error.message}). Check the URL and its CORS.`));
    }
  }
  load();
  return screen;
}
