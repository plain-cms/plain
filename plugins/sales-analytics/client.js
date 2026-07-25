// sales-analytics — browser part. Two jobs, both progressive enhancement:
//   1. On every page, POST a view beacon and a click beacon for any [data-cta]
//      element to your configured backend (the services.<service> endpoint).
//   2. On the dashboard page (a #sales-analytics mount) fetch aggregated counts
//      and render stat tiles + a per-page table.
// No cookies; the only thing stored on-device is an optional admin token you
// paste on the dashboard. CTA links work with JavaScript off — the beacon is
// pure enhancement (C5). Discloses one network call per the plugins-registry rule.

const opts = JSON.parse(document.getElementById('plugin-options')?.textContent || '{}');
const cfg = opts['sales-analytics'] || {};
const api = (opts.$services || {})[cfg.service || 'backend'] || null;
const TOKEN_KEY = 'plain.sales-analytics.token';

// --- 1. Tracking (every page) ---------------------------------------------
if (api) {
  const send = (body) => {
    try {
      const json = JSON.stringify(body);
      if (navigator.sendBeacon) navigator.sendBeacon(`${api}/events`, new Blob([json], { type: 'application/json' }));
      else fetch(`${api}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json, keepalive: true }).catch(() => {});
    } catch { /* tracking must never break the page */ }
  };
  send({ type: 'view', page: location.pathname, ref: document.referrer || null });
  document.addEventListener('click', (event) => {
    const el = event.target.closest?.('[data-cta]');
    if (el) send({ type: 'click', page: location.pathname, cta: el.getAttribute('data-cta') });
  }, { capture: true });
}

// --- 2. Dashboard (only where the mount exists) ----------------------------
const mount = document.getElementById('sales-analytics');
if (mount) loadReports();

async function loadReports() {
  if (!api) return set('<p class="sa-empty">No backend configured. Add a <code>services</code> endpoint to site.config.json — see the sales-analytics README.</p>');
  let token = null;
  try { token = localStorage.getItem(TOKEN_KEY); } catch { /* private mode */ }
  try {
    const res = await fetch(`${api}/reports`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (res.status === 401 || res.status === 403) return askToken();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    render(await res.json());
  } catch (err) {
    set(`<p class="sa-empty">Couldn't load reports (${esc(String(err.message))}). Check the endpoint and its CORS headers — see the README.</p>`);
  }
}

function askToken() {
  set('<form class="sa-auth"><label>This dashboard is protected — paste your access token: <input type="password" autocomplete="off"></label> <button type="submit">View reports</button></form>');
  mount.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const value = mount.querySelector('input').value.trim();
    if (!value) return;
    try { localStorage.setItem(TOKEN_KEY, value); } catch { /* private mode */ }
    loadReports();
  });
}

function render(data) {
  const pages = (Array.isArray(data.pages) ? data.pages : []).slice().sort((a, b) => (b.views || 0) - (a.views || 0));
  const views = pages.reduce((n, p) => n + (p.views || 0), 0);
  const clicks = pages.reduce((n, p) => n + (p.clicks || 0), 0);
  const tile = (label, value) => `<div class="sa-stat"><div class="sa-stat-value">${value}</div><div class="sa-stat-label">${label}</div></div>`;
  const rows = pages.map((p) => {
    const ctas = (p.ctas || []).map((x) => `${esc(x.cta)} ${num(x.clicks || 0)}`).join(', ');
    return `<tr><td>${esc(p.page)}</td><td class="sa-num">${num(p.views || 0)}</td><td class="sa-num">${num(p.clicks || 0)}</td><td class="sa-num">${pct(p.clicks || 0, p.views || 0)}</td><td class="sa-ctas">${ctas}</td></tr>`;
  }).join('');
  set(`<div class="sa-stats">${tile('Views', num(views))}${tile('CTA clicks', num(clicks))}${tile('Click-through', pct(clicks, views))}</div>`
    + '<table class="sa-table"><thead><tr><th>Page</th><th class="sa-num">Views</th><th class="sa-num">Clicks</th><th class="sa-num">CTR</th><th>By CTA</th></tr></thead>'
    + `<tbody>${rows || '<tr><td colspan="5" class="sa-empty">No events recorded yet.</td></tr>'}</tbody></table>`
    + (data.range ? `<p class="sa-range">Range: ${esc(String(data.range))}</p>` : ''));
}

function set(html) { mount.innerHTML = html; }
function num(n) { return Number(n || 0).toLocaleString('en-US'); }
function pct(a, b) { return `${b ? Math.round((a / b) * 1000) / 10 : 0}%`; }
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
