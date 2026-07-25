// sales-analytics — build-time part: emit a themed dashboard page at
// options.dashboardPath that mounts the reports view. Everything real happens
// in client.js against your named backend service; the page is noindexed (a
// private tool) and says so when JavaScript is off.

import fs from 'node:fs';
import path from 'node:path';

export default {
  afterBuild(distPath, site, options) {
    const url = options.dashboardPath || '/insights/';
    const html = site.renderPage('page', {
      page: {
        title: options.dashboardTitle || 'Insights',
        url,
        content: '<div id="sales-analytics"><p class="sa-empty">Loading…</p></div>'
          + '<noscript><p>This dashboard needs JavaScript. Your published site works without it.</p></noscript>',
      },
    }).replace('</head>', '<meta name="robots" content="noindex, nofollow">\n</head>'); // keep the private tool out of search
    const dir = path.join(distPath, ...url.split('/').filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  },
};
