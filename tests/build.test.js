// Golden-file test: build the fixture site and compare every output file,
// byte for byte, against tests/fixtures/expected/.
//
// To regenerate the goldens after an intentional output change:
//   node tests/update-goldens.js
// then review the diff before committing.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../build.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(here, 'fixtures', 'site');
const expectedDir = path.join(here, 'fixtures', 'expected');
const outDir = path.join(here, '.tmp-dist');

function walk(dir, base = dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, base));
    else files.push(path.relative(base, full));
  }
  return files.sort();
}

test('fixture site builds to exactly the expected files', async () => {
  fs.rmSync(outDir, { recursive: true, force: true });
  const report = await build({ root: fixtureRoot, outDir, quiet: true });

  const expected = walk(expectedDir);
  const actual = walk(outDir);
  assert.deepEqual(actual, expected,
    'built file list differs from tests/fixtures/expected/ — if the change is intentional, run node tests/update-goldens.js and review the diff');

  for (const file of expected) {
    const want = fs.readFileSync(path.join(expectedDir, file), 'utf8');
    const got = fs.readFileSync(path.join(outDir, file), 'utf8');
    assert.equal(got, want, `dist/${file} differs from the golden copy`);
  }

  assert.equal(report.draftCount, 1, 'the draft post must be skipped');

  // §10.5: customizer tokens from config.theme.tokens are injected after the
  // theme CSS, so theme upgrades never overwrite user tweaks.
  const home = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
  assert.match(home, /<style id="theme-tokens">:root\{--color-accent:#c0ffee;--measure:70ch\}<\/style>/);

  fs.rmSync(outDir, { recursive: true, force: true });
});

test('build fails loudly on schema violations, naming file and field', async () => {
  const brokenRoot = path.join(here, '.tmp-broken');
  fs.rmSync(brokenRoot, { recursive: true, force: true });
  fs.cpSync(fixtureRoot, brokenRoot, { recursive: true });
  fs.writeFileSync(path.join(brokenRoot, 'content/posts/bad.md'), '---\ndate: not-a-date\n---\nBody.\n');

  await assert.rejects(
    build({ root: brokenRoot, outDir: path.join(brokenRoot, 'dist'), quiet: true }),
    (err) => err.message.includes('content/posts/bad.md') && err.message.includes('title'),
  );
  fs.rmSync(brokenRoot, { recursive: true, force: true });
});
