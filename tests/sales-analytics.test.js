import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import salesAnalytics from '../plugins/sales-analytics/index.js';
import { build } from '../build.js';

const here = path.dirname(fileURLToPath(import.meta.url));

test('afterBuild emits a noindex dashboard page that mounts the reports view', () => {
  const dist = path.join(here, '.tmp-sa');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  // Stand-in renderPage that wraps content in a head/body like a real theme.
  const site = { renderPage: (_tmpl, ctx) => `<html><head><title>${ctx.page.title}</title></head><body>${ctx.page.content}</body></html>` };

  salesAnalytics.afterBuild(dist, site, { dashboardPath: '/insights/', dashboardTitle: 'Insights' });

  const html = fs.readFileSync(path.join(dist, 'insights', 'index.html'), 'utf8');
  assert.match(html, /<div id="sales-analytics">/, 'mounts the dashboard container');
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/, 'private tool — kept out of search');
  assert.match(html, /<title>Insights<\/title>/, 'uses the configured title');
  assert.match(html, /<noscript>/, 'degrades without JavaScript');

  // A nested custom path is created too.
  salesAnalytics.afterBuild(dist, site, { dashboardPath: '/reports/dash/', dashboardTitle: 'Dash' });
  assert.ok(fs.existsSync(path.join(dist, 'reports', 'dash', 'index.html')), 'honors a custom dashboardPath');

  fs.rmSync(dist, { recursive: true, force: true });
});

test('enabled in a build, it injects its client and exposes $services for the beacon', async () => {
  const root = path.join(here, '.tmp-sa-build');
  fs.rmSync(root, { recursive: true, force: true });
  fs.cpSync(path.join(here, 'fixtures', 'site'), root, { recursive: true });
  fs.cpSync(path.join(here, '..', 'plugins', 'sales-analytics'), path.join(root, 'plugins', 'sales-analytics'), { recursive: true });
  const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
  config.plugins = [...config.plugins, 'sales-analytics']; // fixture already has services.backend
  fs.writeFileSync(path.join(root, 'site.config.json'), JSON.stringify(config));

  const dist = path.join(root, 'dist');
  await build({ root, outDir: dist, quiet: true });

  assert.ok(fs.existsSync(path.join(dist, 'insights', 'index.html')), 'dashboard page emitted');
  assert.ok(fs.existsSync(path.join(dist, 'plugins', 'sales-analytics', 'client.js')), 'client copied');
  const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.match(home, /src="\/plugins\/sales-analytics\/client\.js/, 'client injected on every page');
  const options = JSON.parse(home.match(/<script id="plugin-options"[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(options.$services.backend, 'https://backend.fixture.test', '$services rides along so the client resolves the endpoint');
  assert.ok(options['sales-analytics'], 'plugin options are exposed to the client');

  fs.rmSync(root, { recursive: true, force: true });
});
