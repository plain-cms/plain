#!/usr/bin/env node
// build.js — the entry point. `node build.js` builds the site into dist/;
// `node build.js --watch` also serves it on http://localhost:4000 and
// rebuilds on change. See cms-spec.md §6 for the pipeline.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { render } from './lib/template.js';
import { slugify } from './lib/util.js';
import { renderMarkdown } from './lib/markdown.js';
import { makeItem, sortItems, validateConfig, ContentError } from './lib/content.js';
import { sitemapXml, rssXml, robotsTxt, redirectsFile, redirectHtml, apiFiles } from './lib/outputs.js';

/** Scan every collection folder on disk into validated, sorted items. Drafts are excluded. */
function loadContent(root, config) {
  const collections = {};
  let draftCount = 0;
  for (const [name, def] of Object.entries(config.collections)) {
    const dir = path.join(root, def.path);
    if (!fs.existsSync(dir)) {
      throw new ContentError(def.path, null, `folder not found — create it (mkdir -p ${def.path}) or fix the "path" of collection "${name}" in site.config.json`);
    }
    const items = [];
    for (const entry of fs.readdirSync(dir).sort()) {
      if (!entry.endsWith('.md')) continue;
      const file = `${def.path}/${entry}`;
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      const item = makeItem(source, { file, slug: entry.slice(0, -3), collection: name, def, language: config.site.language });
      if (item.draft === true) draftCount++;
      else items.push(item);
    }
    collections[name] = sortItems(items, def);
  }
  return { collections, draftCount };
}

/** Read every *.html template in a theme into { name: source }. */
function loadTheme(root, themeName) {
  const themeDir = path.join(root, 'themes', themeName);
  const templatesDir = path.join(themeDir, 'templates');
  if (!fs.existsSync(templatesDir)) {
    throw new ContentError(`themes/${themeName}`, null, `theme "${themeName}" not found — check "site.theme" in site.config.json or create themes/${themeName}/templates/`);
  }
  const templates = {};
  for (const entry of fs.readdirSync(templatesDir)) {
    if (entry.endsWith('.html')) templates[entry.slice(0, -5)] = fs.readFileSync(path.join(templatesDir, entry), 'utf8');
  }
  const partials = {};
  const partialsDir = path.join(templatesDir, 'partials');
  if (fs.existsSync(partialsDir)) {
    for (const entry of fs.readdirSync(partialsDir)) {
      if (entry.endsWith('.html')) partials[entry.slice(0, -5)] = fs.readFileSync(path.join(partialsDir, entry), 'utf8');
    }
  }
  return { themeDir, templates, partials };
}

/** Read every data/*.json into { navigation: …, redirects: …, … }. */
function loadData(root) {
  const dir = path.join(root, 'data');
  const data = {};
  if (!fs.existsSync(dir)) return data;
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith('.json')) continue;
    try {
      data[entry.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(dir, entry), 'utf8'));
    } catch (err) {
      throw new ContentError(`data/${entry}`, null, `invalid JSON — ${err.message}`);
    }
  }
  return data;
}

/** Render one page: its own template, then the result into base.html's {{{ body }}} slot. */
function renderPage(theme, templateName, context) {
  const source = theme.templates[templateName];
  if (!source) {
    throw new ContentError(`themes/${context.site.theme || ''}/templates/${templateName}.html`, null, `template "${templateName}" not found in the theme`);
  }
  const body = render(source, context, theme.partials);
  return render(theme.templates.base, { ...context, body }, theme.partials);
}

/**
 * Build the site. Pure function of the files on disk: same input, same output.
 * @param {{root?: string, outDir?: string, quiet?: boolean}} [options]
 */
export async function build({ root = process.cwd(), outDir, quiet = false } = {}) {
  const started = performance.now();
  outDir ||= path.join(root, 'dist');

  const configPath = path.join(root, 'site.config.json');
  if (!fs.existsSync(configPath)) throw new ContentError('site.config.json', null, 'not found — every site needs one at the repo root');
  const config = validateConfig(JSON.parse(fs.readFileSync(configPath, 'utf8')));
  const site = config.site;
  const data = loadData(root);
  const theme = loadTheme(root, site.theme);
  if (!theme.templates.base) throw new ContentError(`themes/${site.theme}/templates/base.html`, null, 'not found — every theme needs a base.html with a {{{ body }}} slot');
  const { collections, draftCount } = loadContent(root, config);
  const warnings = [];

  // Feeds, rendered Markdown, tag links — computed before any page renders.
  const feeds = Object.entries(config.collections)
    .filter(([, def]) => def.rss)
    .map(([name, def]) => ({ name, listUrl: def.listUrl || '/', feedUrl: `${def.listUrl || '/'}rss.xml` }));
  for (const [name, def] of Object.entries(config.collections)) {
    for (const item of collections[name]) {
      item.content = renderMarkdown(item.body);
      if (Array.isArray(item.tags) && def.listUrl) {
        item.tagLinks = item.tags.map((tag) => ({ name: tag, url: `${def.listUrl}tag/${slugify(tag)}/` }));
      }
      if (!item.description) warnings.push(`${item.file}: no "description" — search engines and link previews will improvise one`);
    }
  }

  // Shared template context. `nav` gets a per-page copy with `current` set.
  const navigation = Array.isArray(data.navigation) ? data.navigation : [];
  const baseContext = { site, data, collections, feeds: feeds.map((f) => f.feedUrl) };
  const navFor = (url) => navigation.map((entry) => ({ ...entry, current: entry.url === url }));

  const pages = new Map(); // output path (dist-relative) → html
  const emit = (url, html) => pages.set(path.join(url.slice(1), 'index.html'), html);
  const sitemapEntries = [];

  // Item pages.
  for (const [name, def] of Object.entries(config.collections)) {
    for (const item of collections[name]) {
      emit(item.url, renderPage(theme, def.template, { ...baseContext, page: item, nav: navFor(item.url) }));
      sitemapEntries.push({ loc: site.url + item.url, lastmod: item.date });
    }
  }

  // List pages with pagination, and tag pages for collections whose items have tags.
  for (const [name, def] of Object.entries(config.collections)) {
    if (!def.listUrl) continue;
    const lists = [{ url: def.listUrl, items: collections[name], title: def.label }];
    const tags = [...new Set(collections[name].flatMap((i) => i.tagLinks || []).map((t) => JSON.stringify(t)))].map((t) => JSON.parse(t));
    for (const tag of tags) {
      lists.push({ url: tag.url, items: collections[name].filter((i) => i.tags?.includes(tag.name)), title: `${def.label} tagged “${tag.name}”`, tag: tag.name });
    }
    for (const list of lists) {
      const pageCount = Math.max(1, Math.ceil(list.items.length / def.pageSize));
      for (let n = 1; n <= pageCount; n++) {
        const url = n === 1 ? list.url : `${list.url}page/${n}/`;
        const pagination = {
          page: n,
          totalPages: pageCount,
          multiple: pageCount > 1,
          newer: n > 1 ? (n === 2 ? list.url : `${list.url}page/${n - 1}/`) : null,
          older: n < pageCount ? `${list.url}page/${n + 1}/` : null,
        };
        const context = {
          ...baseContext,
          page: { title: list.title, url },
          nav: navFor(url),
          items: list.items.slice((n - 1) * def.pageSize, n * def.pageSize),
          pagination,
          tag: list.tag,
        };
        emit(url, renderPage(theme, def.listTemplate, context));
        sitemapEntries.push({ loc: site.url + url });
      }
    }
  }

  // 404 page and redirect fallbacks.
  pages.set('404.html', renderPage(theme, '404', { ...baseContext, page: { title: 'Page not found' }, nav: navFor(null) }));
  const redirects = data.redirects || {};
  for (const [from, to] of Object.entries(redirects)) {
    pages.set(path.join(from.slice(1), 'index.html'), redirectHtml(to));
  }

  // Non-HTML outputs, including the static read-only JSON API (§6 step 8).
  const files = new Map(pages);
  files.set('sitemap.xml', sitemapXml(sitemapEntries));
  files.set('robots.txt', robotsTxt(site.url));
  if (Object.keys(redirects).length) files.set('_redirects', redirectsFile(redirects));
  for (const feed of feeds) {
    files.set(path.join(feed.feedUrl.slice(1)), rssXml(site, feed.feedUrl, feed.listUrl, collections[feed.name]));
  }
  for (const [file, json] of apiFiles(config, data, collections)) files.set(file, json);

  // Everything rendered without errors — only now touch dist/ (§5.2: never half-deploy).
  fs.rmSync(outDir, { recursive: true, force: true });
  for (const [file, contents] of files) {
    const target = path.join(outDir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  const assetsDir = path.join(theme.themeDir, 'assets');
  if (fs.existsSync(assetsDir)) fs.cpSync(assetsDir, path.join(outDir, 'assets'), { recursive: true });
  const mediaDir = path.join(root, 'media');
  if (fs.existsSync(mediaDir)) fs.cpSync(mediaDir, path.join(outDir, 'media'), { recursive: true });
  copyAdmin(root, outDir);

  const report = {
    pages: pages.size,
    files: files.size,
    draftCount,
    warnings,
    bytes: dirSize(outDir),
    ms: Math.round(performance.now() - started),
  };
  if (!quiet) printReport(report, outDir);
  return report;
}

/**
 * Copy the admin app into dist/, plus the isomorphic lib modules and the
 * marked ESM bundle it imports — so the editor's preview renders with the
 * exact code the build uses (§10.2).
 */
function copyAdmin(root, outDir) {
  const adminDir = path.join(root, 'admin');
  if (!fs.existsSync(adminDir)) return;
  fs.cpSync(adminDir, path.join(outDir, 'admin'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'admin', 'lib'), { recursive: true });
  for (const module of ['util.js', 'template.js', 'markdown.js', 'content.js']) {
    fs.copyFileSync(path.join(root, 'lib', module), path.join(outDir, 'admin', 'lib', module));
  }
  const marked = fileURLToPath(import.meta.resolve('marked'));
  fs.mkdirSync(path.join(outDir, 'admin', 'vendor'), { recursive: true });
  fs.copyFileSync(marked, path.join(outDir, 'admin', 'vendor', 'marked.esm.js'));
}

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile()) total += fs.statSync(path.join(entry.parentPath, entry.name)).size;
  }
  return total;
}

function printReport(report, outDir) {
  const size = report.bytes < 1024 * 1024 ? `${(report.bytes / 1024).toFixed(1)} KB` : `${(report.bytes / 1024 / 1024).toFixed(1)} MB`;
  console.log(`✓ built ${report.pages} pages (${report.files} files, ${size}) into ${path.relative(process.cwd(), outDir) || '.'} in ${report.ms}ms`);
  if (report.draftCount) console.log(`  ${report.draftCount} draft${report.draftCount > 1 ? 's' : ''} skipped`);
  for (const warning of report.warnings) console.log(`  ⚠ ${warning}`);
}

// ---------------------------------------------------------------------------
// Dev server + watch mode (only used by `node build.js --watch`).

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
};

function serve(outDir, port) {
  http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.normalize(path.join(outDir, url));
    if (!file.startsWith(outDir)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      const notFound = path.join(outDir, '404.html');
      res.writeHead(404, { 'content-type': MIME['.html'] });
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  }).listen(port, () => console.log(`serving on http://localhost:${port}`));
}

function watch(root, outDir) {
  const ignored = ['dist', 'node_modules', '.git'];
  let timer = null;
  fs.watch(root, { recursive: true }, (event, file) => {
    if (!file || ignored.some((dir) => file === dir || file.startsWith(dir + path.sep))) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      console.log(`\nchanged: ${file}`);
      try {
        await build({ root, outDir });
      } catch (err) {
        console.error(`✖ ${err.message}`); // keep watching; the next save may fix it
      }
    }, 100);
  });
  console.log('watching for changes…');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const root = process.cwd();
  const outDir = path.join(root, 'dist');
  try {
    await build({ root, outDir });
  } catch (err) {
    console.error(`✖ build failed\n  ${err.message}`);
    process.exit(1);
  }
  if (process.argv.includes('--watch')) {
    serve(outDir, Number(process.env.PORT) || 4000);
    watch(root, outDir);
  }
}
