// lib/outputs.js — the non-HTML build outputs (cms-spec.md §6 step 7):
// sitemap.xml, rss.xml, robots.txt, _redirects + meta-refresh fallbacks.
// Every function takes data in and returns a string; build.js writes files.

import { escapeXml, escapeHtml, rfc822Date } from './util.js';

/** @param {{loc: string, lastmod?: string}[]} entries - absolute URLs */
export function sitemapXml(entries) {
  const urls = entries.map(({ loc, lastmod }) =>
    `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/** RSS 2.0 feed for one collection. Deterministic: dates come from items, not the clock. */
export function rssXml(site, feedUrl, listUrl, items) {
  const entries = items.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(site.url + item.url)}</link>
      <guid>${escapeXml(site.url + item.url)}</guid>
      ${item.date ? `<pubDate>${rfc822Date(item.date)}</pubDate>` : ''}
      ${item.description ? `<description>${escapeXml(item.description)}</description>` : ''}
    </item>`);
  const newest = items.map((i) => i.date).filter(Boolean).sort().at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(site.url + listUrl)}</link>
    <atom:link href="${escapeXml(site.url + feedUrl)}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(site.description || '')}</description>
    <language>${escapeXml(site.language)}</language>
    ${newest ? `<lastBuildDate>${rfc822Date(newest)}</lastBuildDate>` : ''}
${entries.join('\n')}
  </channel>
</rss>
`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

/** Cloudflare/Netlify _redirects file from the {"/old/": "/new/"} map. */
export function redirectsFile(map) {
  return Object.entries(map).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n';
}

/** Meta-refresh fallback page for hosts without redirect support (GitHub Pages). */
export function redirectHtml(to) {
  const href = escapeHtml(to);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${href}">
<link rel="canonical" href="${href}">
<title>Redirecting…</title>
</head>
<body>
<p>This page has moved to <a href="${href}">${href}</a>.</p>
</body>
</html>
`;
}
