// backend-admin plugin — browser part. Injected into every page, but only
// acts where index.js emitted the mount point. A port of the victorantos.com
// Jekyll admin: same API paths and the same localStorage keys, so sessions
// from the old /admin/ page survive the move.

const root = document.getElementById('backend-admin');
if (root) main();

function main() {
  const opts = JSON.parse(document.getElementById('plugin-options')?.textContent || '{}');
  const API_BASE = (opts.$services || {})[opts['backend-admin']?.service || 'backend'] || '';
  if (!API_BASE) {
    root.innerHTML = '<p>This dashboard has no backend configured. Set <code>"services": { "backend": "https://api.example.com" }</code> in site.config.json — or point the plugin\'s <code>service</code> option at another named service.</p>';
    return;
  }

  const TOKEN_KEY = 'victorantos.adminToken';
  const CSRF_KEY = 'victorantos.adminCsrf';
  // The OAuth round-trip returns to this page, wherever the plugin mounts it.
  const RETURN_URL = location.origin + location.pathname;

  root.innerHTML = `
    <div id="signin-screen" class="screen" hidden>
      <div class="signin-card">
        <h1>Victorantos Admin</h1>
        <p class="muted">Sign in with the owner Google account.</p>
        <button id="signin-btn" class="btn-primary" type="button">Sign in with Google</button>
        <p id="signin-error" class="error" hidden></p>
      </div>
    </div>

    <div id="loading-screen" class="screen">
      <div class="loading">Loading…</div>
    </div>

    <div id="forbidden-screen" class="screen" hidden>
      <div class="signin-card">
        <h1>Not authorized</h1>
        <p class="muted">You are signed in, but this account does not have admin access.</p>
        <p id="forbidden-email" class="muted small"></p>
        <button id="forbidden-signout" class="btn-secondary" type="button">Sign out</button>
      </div>
    </div>

    <div id="dashboard" class="dashboard" hidden>
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">Victorantos · Admin</div>
          <div class="user">
            <span id="user-email" class="user-email"></span>
            <button id="signout" class="btn-link" type="button">Sign out</button>
          </div>
        </div>
      </header>

      <div class="content">
        <section class="card">
          <h2>Stats</h2>
          <div id="stats" class="stats-grid">
            <div class="stat-placeholder">Loading…</div>
          </div>
        </section>

        <section class="card">
          <h2>CV variants</h2>
          <p class="muted small">Upload PDFs labeled by role (e.g. <code>general</code>, <code>fullstack</code>, <code>ml</code>). Default is attached when no variant is specified.</p>
          <form id="cv-form" class="form inline-form">
            <div class="row-flex">
              <label class="grow">
                <span>Label</span>
                <input type="text" name="label" required pattern="[a-z0-9_-]+" placeholder="e.g. fullstack">
              </label>
              <label class="grow">
                <span>PDF file</span>
                <input type="file" name="file" accept="application/pdf,.pdf,.docx" required>
              </label>
            </div>
            <label class="checkbox">
              <input type="checkbox" name="isDefault">
              <span>Set as default</span>
            </label>
            <button type="submit" class="btn-primary">Upload</button>
            <p id="cv-result" class="result" hidden></p>
          </form>
          <div id="cv-list" class="cv-list">
            <div class="muted small">Loading…</div>
          </div>
        </section>

        <section class="card">
          <h2>API keys</h2>
          <p class="muted small">For LLM agents that send job-application emails on your behalf. Use header <code>X-Api-Key: vk_live_...</code> on POST <code>/api/agent/job-application/send</code>.</p>
          <form id="key-form" class="form inline-form">
            <label>
              <span>Name</span>
              <input type="text" name="name" required placeholder="e.g. claude-agent">
            </label>
            <button type="submit" class="btn-primary">Generate key</button>
            <div id="key-result" class="key-result" hidden>
              <p class="muted small">Copy this now — it won't be shown again.</p>
              <div class="key-display">
                <code id="key-value"></code>
                <button type="button" class="btn-secondary" id="key-copy">Copy</button>
              </div>
            </div>
          </form>
          <div id="key-list" class="key-list">
            <div class="muted small">Loading…</div>
          </div>
        </section>

        <section class="card">
          <h2>Applications log</h2>
          <p class="muted small">Most recent job-application emails sent by you or your agents.</p>
          <div id="applications-list" class="row-list">
            <div class="muted small">Loading…</div>
          </div>
        </section>

        <section class="card">
          <h2>Signups</h2>
          <div class="tabs" role="tablist">
            <button class="tab active" role="tab" data-tab="niche" aria-selected="true">Niche Careers</button>
            <button class="tab" role="tab" data-tab="bhf" aria-selected="false">Budget Hotel</button>
            <button class="tab" role="tab" data-tab="cloud" aria-selected="false">Cloud Clean</button>
          </div>
          <div id="signups-panel" class="signups-panel">
            <div class="muted">Loading…</div>
          </div>
        </section>

        <section class="card">
          <h2>Send job-application email</h2>
          <p class="muted small">Sends via SES and logs to the Applications table. Same flow your API agent uses.</p>
          <form id="email-form" class="form">
            <label>
              <span>To</span>
              <input type="email" name="to" required placeholder="recruiter@company.com">
            </label>
            <label>
              <span>Subject</span>
              <input type="text" name="subject" required placeholder="Expressing interest in the …">
            </label>
            <label>
              <span>CV variant</span>
              <select name="cvVariant" id="email-cv-select">
                <option value="">(use default)</option>
              </select>
            </label>
            <label>
              <span>HTML body</span>
              <textarea name="htmlBody" required rows="8" placeholder="&lt;p&gt;Hello,&lt;/p&gt;&lt;p&gt;I'd like to apply for …&lt;/p&gt;"></textarea>
            </label>

            <details class="optional">
              <summary>Optional fields</summary>
              <label>
                <span>Plain-text body</span>
                <textarea name="textBody" rows="3" placeholder="Plain-text fallback."></textarea>
              </label>
              <div class="row-flex">
                <label class="grow"><span>CC</span><input type="email" name="cc"></label>
                <label class="grow"><span>Reply-To</span><input type="email" name="replyTo" placeholder="victorantos@gmail.com"></label>
              </div>
              <label>
                <span>From name override</span>
                <input type="text" name="fromName" placeholder="Victor A">
              </label>
              <div class="row-flex">
                <label class="grow"><span>Job title</span><input type="text" name="jobTitle"></label>
                <label class="grow"><span>Company</span><input type="text" name="company"></label>
              </div>
              <label>
                <span>Job URL</span>
                <input type="url" name="jobUrl" placeholder="https://…">
              </label>
            </details>

            <button type="submit" class="btn-primary">Send</button>
            <p id="email-result" class="result" hidden></p>
          </form>
        </section>
      </div>
    </div>
  `;

  const screens = {
    signin: document.getElementById('signin-screen'),
    loading: document.getElementById('loading-screen'),
    forbidden: document.getElementById('forbidden-screen'),
    dashboard: document.getElementById('dashboard'),
  };

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
  }

  function authHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function api(path, options = {}) {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.text()).slice(0, 400); } catch {}
      throw new Error(`${res.status} ${res.statusText}${detail ? ' — ' + detail : ''}`);
    }
    if (res.status === 204) return null;
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : null;
  }

  // ===== Auth flow =====

  function randomCsrf() {
    try {
      if (crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    } catch {}
    const a = new Uint8Array(16);
    (crypto && crypto.getRandomValues ? crypto : { getRandomValues: (x) => { for (let i = 0; i < x.length; i++) x[i] = Math.floor(Math.random() * 256); return x; } }).getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
  }

  function consumeOAuthCallback() {
    const url = new URL(location.href);
    const token = url.searchParams.get('token');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    if (error) {
      showSigninError(`Sign-in error: ${error}`);
      url.searchParams.delete('error');
      history.replaceState({}, '', url.toString());
      return;
    }
    if (!token) return;

    const expectedCsrf = localStorage.getItem(CSRF_KEY);
    localStorage.removeItem(CSRF_KEY);

    if (!state || state !== expectedCsrf) {
      if (expectedCsrf === null) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        showSigninError('Login state mismatch. Please try signing in again.');
      }
      url.searchParams.delete('token');
      url.searchParams.delete('state');
      history.replaceState({}, '', url.toString());
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    url.searchParams.delete('token');
    url.searchParams.delete('state');
    history.replaceState({}, '', url.toString());
  }

  function startGoogleSignin() {
    const csrf = randomCsrf();
    localStorage.setItem(CSRF_KEY, csrf);
    location.href = `${API_BASE}/api/auth/challenge/google?redirectUri=${encodeURIComponent(RETURN_URL)}&state=${encodeURIComponent(csrf)}`;
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CSRF_KEY);
    location.replace(RETURN_URL);
  }

  function showSigninError(msg) {
    const el = document.getElementById('signin-error');
    el.textContent = msg;
    el.hidden = false;
  }

  // ===== Dashboard rendering =====

  function renderStats(stats) {
    const cards = [
      { label: 'Applications', value: stats.jobApplications, sub: `+${stats.jobApplicationsLast24h ?? 0} in 24h` },
      { label: 'API keys (active)', value: stats.activeApiKeys },
      { label: 'Niche Careers', value: stats.nicheCareerLeads, sub: `+${stats.nicheCareerLeadsLast24h ?? 0} in 24h` },
      { label: 'Budget Hotel', value: stats.budgetHotelFinder },
      { label: 'Cloud Clean', value: stats.cloudClean },
      { label: 'Sneos Premium · Active', value: stats.sneosPremiumActive, sub: `of ${stats.sneosPremiumTotal} total` },
    ];
    document.getElementById('stats').innerHTML = cards.map(c => `
      <div class="stat">
        <div class="stat-label">${escapeHtml(c.label)}</div>
        <div class="stat-value">${fmtNum(c.value)}</div>
        ${c.sub ? `<div class="stat-sub">${escapeHtml(c.sub)}</div>` : ''}
      </div>
    `).join('');
  }

  // ===== Signups =====

  const SIGNUP_TABS = {
    niche: {
      path: '/api/admin/signups/niche-career-leads',
      empty: 'No niche career leads yet.',
      render: (r) => [
        ['Name', r.name], ['Email', r.email], ['Subscription', r.subscriptionType],
        ['IP', r.ipAddress], ['Created', fmtDate(r.createdAt)],
      ],
    },
    bhf: {
      path: '/api/admin/signups/budget-hotel-finder',
      empty: 'No Budget Hotel Finder signups.',
      render: (r) => [
        ['Name', r.name], ['Email', r.email],
        ['Country', r.specificCountry || (Array.isArray(r.countries) ? r.countries.join(', ') : '')],
        ['City', r.specificCity || (Array.isArray(r.cities) ? r.cities.join(', ') : '')],
        ['Check-in', fmtDate(r.checkin)], ['Check-out', fmtDate(r.checkout)],
      ],
    },
    cloud: {
      path: '/api/admin/signups/cloud-clean',
      empty: 'No Cloud Clean signups.',
      render: (r) => [['Name', r.name], ['Email', r.email]],
    },
  };

  async function loadSignupTab(tabKey) {
    const tab = SIGNUP_TABS[tabKey];
    const panel = document.getElementById('signups-panel');
    panel.innerHTML = '<div class="muted">Loading…</div>';
    try {
      const rows = await api(`${tab.path}?limit=50`);
      if (!rows || rows.length === 0) {
        panel.innerHTML = `<div class="empty">${escapeHtml(tab.empty)}</div>`;
        return;
      }
      panel.innerHTML = `<div class="row-list">${
        rows.map(r => `
          <div class="row">
            ${tab.render(r).filter(([, v]) => v != null && v !== '').map(([k, v]) => `
              <div class="row-line">
                <span class="row-key">${escapeHtml(k)}</span>
                <span class="row-val">${escapeHtml(String(v))}</span>
              </div>
            `).join('')}
          </div>
        `).join('')
      }</div>`;
    } catch (e) {
      panel.innerHTML = `<div class="error">Failed to load: ${escapeHtml(e.message)}</div>`;
    }
  }

  function wireTabs() {
    root.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.tab').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        loadSignupTab(btn.dataset.tab);
      });
    });
  }

  // ===== CV variants =====

  async function loadCvList() {
    const container = document.getElementById('cv-list');
    container.innerHTML = '<div class="muted small">Loading…</div>';
    try {
      const rows = await api('/api/admin/cv/');
      if (!rows || rows.length === 0) {
        container.innerHTML = '<div class="muted small">No CVs uploaded yet.</div>';
        populateCvSelect([]);
        return;
      }
      container.innerHTML = rows.map(c => `
        <div class="cv-item">
          <div class="item-main">
            <div class="item-title">
              ${escapeHtml(c.label)}
              ${c.isDefault ? '<span class="badge badge-default">default</span>' : ''}
            </div>
            <div class="item-meta">${escapeHtml(c.fileName)} · ${fmtBytes(c.sizeBytes)} · ${escapeHtml(c.contentType)} · updated ${fmtDate(c.updatedAt)}</div>
          </div>
          <div class="item-actions">
            <button type="button" class="btn-small" data-action="download" data-label="${escapeHtml(c.label)}">Download</button>
            ${c.isDefault ? '' : `<button type="button" class="btn-small primary" data-action="setdefault" data-label="${escapeHtml(c.label)}">Set default</button>`}
            <button type="button" class="btn-small danger" data-action="delete" data-label="${escapeHtml(c.label)}">Delete</button>
          </div>
        </div>
      `).join('');
      populateCvSelect(rows);
    } catch (e) {
      container.innerHTML = `<div class="error">Failed to load CVs: ${escapeHtml(e.message)}</div>`;
    }
  }

  function populateCvSelect(rows) {
    const sel = document.getElementById('email-cv-select');
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">(use default)</option>' +
      rows.map(c => `<option value="${escapeHtml(c.label)}">${escapeHtml(c.label)}${c.isDefault ? ' (default)' : ''}</option>`).join('');
    if (rows.some(r => r.label === current)) sel.value = current;
  }

  function wireCvForm() {
    const form = document.getElementById('cv-form');
    const result = document.getElementById('cv-result');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      result.hidden = true; result.className = 'result';
      try {
        const fd = new FormData(form);
        // FormData checkbox sends "on" only if checked; coerce to boolean string
        const checked = form.elements.isDefault.checked;
        fd.set('isDefault', checked ? 'true' : 'false');
        await api('/api/admin/cv/', { method: 'POST', body: fd });
        result.classList.add('success');
        result.textContent = 'Uploaded ✓';
        result.hidden = false;
        form.reset();
        loadCvList();
      } catch (e) {
        result.classList.add('error');
        result.textContent = `Upload failed: ${e.message}`;
        result.hidden = false;
      } finally {
        btn.disabled = false;
      }
    });

    document.getElementById('cv-list').addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const label = btn.dataset.label;
      const action = btn.dataset.action;
      try {
        if (action === 'delete') {
          if (!confirm(`Delete CV "${label}"?`)) return;
          await api(`/api/admin/cv/${encodeURIComponent(label)}`, { method: 'DELETE' });
          loadCvList();
        } else if (action === 'setdefault') {
          await api(`/api/admin/cv/${encodeURIComponent(label)}/default`, { method: 'POST' });
          loadCvList();
        } else if (action === 'download') {
          const url = `${API_BASE}/api/admin/cv/${encodeURIComponent(label)}/download`;
          const res = await fetch(url, { headers: authHeaders() });
          if (!res.ok) throw new Error(`${res.status}`);
          const blob = await res.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${label}.pdf`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }
      } catch (err) {
        alert(`Failed: ${err.message}`);
      }
    });
  }

  // ===== API keys =====

  async function loadKeyList() {
    const container = document.getElementById('key-list');
    container.innerHTML = '<div class="muted small">Loading…</div>';
    try {
      const rows = await api('/api/admin/api-keys/');
      if (!rows || rows.length === 0) {
        container.innerHTML = '<div class="muted small">No keys yet.</div>';
        return;
      }
      container.innerHTML = rows.map(k => `
        <div class="key-item">
          <div class="item-main">
            <div class="item-title">
              ${escapeHtml(k.name)}
              ${k.revokedAt ? '<span class="badge badge-revoked">revoked</span>' : '<span class="badge badge-active">active</span>'}
            </div>
            <div class="item-meta">
              <code>${escapeHtml(k.prefix)}…</code> ·
              ${fmtNum(k.callCount)} calls (${fmtNum(k.successCount)}✓ / ${fmtNum(k.failureCount)}✗) ·
              ${k.lastUsedAt ? 'last used ' + fmtDate(k.lastUsedAt) : 'never used'} ·
              created ${fmtDate(k.createdAt)}
            </div>
          </div>
          <div class="item-actions">
            ${k.revokedAt ? '' : `<button type="button" class="btn-small danger" data-key-action="revoke" data-id="${k.id}">Revoke</button>`}
          </div>
        </div>
      `).join('');
    } catch (e) {
      container.innerHTML = `<div class="error">Failed to load keys: ${escapeHtml(e.message)}</div>`;
    }
  }

  function wireKeyForm() {
    const form = document.getElementById('key-form');
    const resultPanel = document.getElementById('key-result');
    const valueEl = document.getElementById('key-value');
    const copyBtn = document.getElementById('key-copy');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const name = form.elements.name.value.trim();
        const r = await api('/api/admin/api-keys/', {
          method: 'POST',
          body: JSON.stringify({ name }),
        });
        valueEl.textContent = r.key;
        resultPanel.hidden = false;
        form.reset();
        loadKeyList();
      } catch (e) {
        alert(`Failed to create key: ${e.message}`);
      } finally {
        btn.disabled = false;
      }
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(valueEl.textContent);
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => copyBtn.textContent = 'Copy', 1200);
      } catch {
        const range = document.createRange();
        range.selectNode(valueEl);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
    });

    document.getElementById('key-list').addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-key-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.keyAction === 'revoke') {
        if (!confirm('Revoke this API key? Agents using it will stop working.')) return;
        try {
          await api(`/api/admin/api-keys/${id}`, { method: 'DELETE' });
          loadKeyList();
        } catch (err) {
          alert(`Failed: ${err.message}`);
        }
      }
    });
  }

  // ===== Applications log =====

  async function loadApplications() {
    const container = document.getElementById('applications-list');
    container.innerHTML = '<div class="muted small">Loading…</div>';
    try {
      const rows = await api('/api/admin/applications?limit=50');
      if (!rows || rows.length === 0) {
        container.innerHTML = '<div class="muted small">No applications sent yet.</div>';
        return;
      }
      container.innerHTML = rows.map(a => `
        <div class="app-item">
          <div class="item-main">
            <div class="item-title">
              ${escapeHtml(a.recipient)}
              ${a.status === 'sent' ? '<span class="badge badge-sent">sent</span>' : '<span class="badge badge-failed">failed</span>'}
              ${a.cvVariantLabel ? `<span class="badge badge-default">${escapeHtml(a.cvVariantLabel)}</span>` : ''}
            </div>
            <div class="item-subject">${escapeHtml(a.subject)}</div>
            <div class="item-meta">
              ${a.company ? escapeHtml(a.company) + ' · ' : ''}
              ${a.jobTitle ? escapeHtml(a.jobTitle) + ' · ' : ''}
              ${a.jobUrl ? `<a href="${escapeHtml(a.jobUrl)}" target="_blank" rel="noopener">link</a> · ` : ''}
              ${fmtDate(a.createdAt)}
              ${a.errorMessage ? ' · err: ' + escapeHtml(a.errorMessage.slice(0, 120)) : ''}
            </div>
          </div>
        </div>
      `).join('');
    } catch (e) {
      container.innerHTML = `<div class="error">Failed to load applications: ${escapeHtml(e.message)}</div>`;
    }
  }

  // ===== Email composer =====

  function wireEmailForm() {
    const form = document.getElementById('email-form');
    const result = document.getElementById('email-result');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      result.hidden = true; result.className = 'result';

      const fd = new FormData(form);
      const payload = trimAndNullify({
        to: fd.get('to'),
        subject: fd.get('subject'),
        htmlBody: fd.get('htmlBody'),
        textBody: fd.get('textBody'),
        cc: fd.get('cc'),
        replyTo: fd.get('replyTo'),
        fromName: fd.get('fromName'),
        cvVariant: fd.get('cvVariant'),
        jobTitle: fd.get('jobTitle'),
        company: fd.get('company'),
        jobUrl: fd.get('jobUrl'),
      });

      try {
        const res = await api('/api/admin/email/job-application', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        result.classList.add('success');
        result.textContent = `Sent ✓ messageId: ${res.messageId}${res.cvVariant ? ' · CV: ' + res.cvVariant : ' · (no CV attached)'}`;
        result.hidden = false;
        form.reset();
        loadApplications();
      } catch (e) {
        result.classList.add('error');
        result.textContent = `Send failed: ${e.message}`;
        result.hidden = false;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  function trimAndNullify(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v == null) { out[k] = null; continue; }
      const s = String(v).trim();
      out[k] = s === '' ? null : s;
    }
    return out;
  }

  // ===== Boot =====

  async function loadDashboard(me) {
    document.getElementById('user-email').textContent = me.email || '';
    show('dashboard');
    try {
      const stats = await api('/api/admin/stats');
      renderStats(stats);
    } catch (e) {
      document.getElementById('stats').innerHTML =
        `<div class="error">Failed to load stats: ${escapeHtml(e.message)}</div>`;
    }
    loadCvList();
    loadKeyList();
    loadApplications();
    loadSignupTab('niche');
  }

  // ===== Helpers =====

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function fmtNum(n) {
    if (n == null || isNaN(n)) return '–';
    return new Intl.NumberFormat().format(n);
  }

  function fmtBytes(n) {
    if (!Number.isFinite(n)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  }

  function fmtDate(s) {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d)) return s;
    return d.toLocaleString();
  }

  async function init() {
    consumeOAuthCallback();

    document.getElementById('signin-btn').addEventListener('click', startGoogleSignin);
    document.getElementById('signout').addEventListener('click', signOut);
    document.getElementById('forbidden-signout').addEventListener('click', signOut);

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { show('signin'); return; }

    try {
      const me = await api('/auth/me');
      const roles = me?.roles ?? [];
      if (roles.includes('Admin')) {
        wireTabs();
        wireEmailForm();
        wireCvForm();
        wireKeyForm();
        await loadDashboard(me);
      } else {
        document.getElementById('forbidden-email').textContent =
          me?.email ? `Signed in as ${me.email}` : '';
        show('forbidden');
      }
    } catch (e) {
      if (e.message === 'unauthorized') {
        show('signin');
        showSigninError('Session expired. Please sign in again.');
      } else {
        show('signin');
        showSigninError(`Could not verify session: ${e.message}`);
      }
    }
  }

  // Module scripts are deferred, so the DOM is ready by the time this runs.
  init();
}
