// backend-admin plugin — build-time part: emit a themed page that mounts
// the dashboard. Everything real happens in client.js against the site's
// named backend service; without JavaScript the page says so instead of
// breaking.

import fs from 'node:fs';
import path from 'node:path';

export default {
  afterBuild(distPath, site, options) {
    const html = site.renderPage('page', {
      page: {
        title: options.title,
        url: options.path,
        content: '<div id="backend-admin"></div><noscript><p>This dashboard requires JavaScript. The rest of the site works without it.</p></noscript>',
      },
    }).replace('</head>', '<meta name="robots" content="noindex, nofollow">\n</head>'); // a private tool — keep it out of search results
    const dir = path.join(distPath, ...options.path.split('/').filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  },
};
