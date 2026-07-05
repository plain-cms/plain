// lib/content.js — scan content/, parse frontmatter, validate (cms-spec.md §5).
//
// Frontmatter is a deliberately small, hand-parsed subset of YAML:
//   key: value          strings, true/false, numbers, "quoted strings"
//   key:                a list, followed by indented "- item" lines
//     - item
// Dates stay as ISO strings ("2026-07-05"). Nothing else is supported —
// no nesting, no multiline strings, no anchors. Errors name the file,
// line, and fix.

import fs from 'node:fs';
import path from 'node:path';
import { slugify, isIsoDate, formatDate } from './util.js';

/** A build-stopping problem in a specific file. Message includes file:line. */
export class ContentError extends Error {
  constructor(file, line, message) {
    super(line ? `${file}:${line} — ${message}` : `${file} — ${message}`);
    this.file = file;
    this.line = line;
  }
}

/** Parse one scalar frontmatter value: booleans, numbers, quoted or bare strings. */
function parseScalar(raw) {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  const quoted = value.match(/^"(.*)"$|^'(.*)'$/);
  if (quoted) return quoted[1] ?? quoted[2];
  return value;
}

/**
 * Parse a content file into frontmatter data + Markdown body.
 * @returns {{data: object, body: string, lineOf: Record<string, number>}}
 */
export function parseFrontmatter(source, file = 'content file') {
  const lines = source.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    throw new ContentError(file, 1, 'file must start with "---" on its own line, followed by frontmatter like "title: My title"');
  }
  const data = {};
  const lineOf = {};
  let listKey = null;
  let i = 1;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') break;
    if (line.trim() === '') { listKey = null; continue; }
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && listKey) {
      data[listKey].push(parseScalar(listItem[1]));
      continue;
    }
    const pair = line.match(/^([A-Za-z][\w-]*):(.*)$/);
    if (!pair) {
      throw new ContentError(file, i + 1, `cannot parse "${line.trim()}" — expected "key: value" or an indented "- item" list entry`);
    }
    const [, key, rest] = pair;
    lineOf[key] = i + 1;
    if (rest.trim() === '') {
      data[key] = [];       // "key:" alone opens a list
      listKey = key;
    } else {
      data[key] = parseScalar(rest);
      listKey = null;
    }
  }
  if (i >= lines.length) {
    throw new ContentError(file, lines.length, 'frontmatter never ends — add a closing "---" line');
  }
  return { data, body: lines.slice(i + 1).join('\n'), lineOf };
}

const FIELD_TYPES = ['text', 'textarea', 'date', 'boolean', 'image', 'list', 'select'];

/** Validate one item's data against its collection's field schema. Mutates data to apply defaults. */
export function validateFields(data, fields, file, lineOf = {}) {
  for (const field of fields) {
    const value = data[field.name];
    const at = lineOf[field.name] || 1;
    if (value === undefined) {
      if ('default' in field) data[field.name] = field.default;
      else if (field.required) throw new ContentError(file, 1, `missing required field "${field.name}" — add "${field.name}: …" to the frontmatter`);
      continue;
    }
    switch (field.type) {
      case 'date':
        if (!isIsoDate(value)) throw new ContentError(file, at, `field "${field.name}" must be an ISO date like 2026-07-05 (got "${value}")`);
        break;
      case 'boolean':
        if (typeof value !== 'boolean') throw new ContentError(file, at, `field "${field.name}" must be true or false (got "${value}")`);
        break;
      case 'list':
        if (!Array.isArray(value)) throw new ContentError(file, at, `field "${field.name}" must be a list — write "${field.name}:" then indented "- item" lines`);
        break;
      case 'select':
        if (!field.options?.includes(value)) throw new ContentError(file, at, `field "${field.name}" must be one of: ${(field.options || []).join(', ')} (got "${value}")`);
        break;
      default: // text, textarea, image
        if (typeof value === 'number') data[field.name] = String(value);
        else if (typeof value !== 'string') throw new ContentError(file, at, `field "${field.name}" must be text (got ${JSON.stringify(value)})`);
    }
  }
}

/** Build an item's URL from its collection's pattern. "index" maps to the pattern root. */
export function urlFor(pattern, slug) {
  const url = slug === 'index'
    ? pattern.replace(/:slug\/?$/, '')
    : pattern.replace(':slug', slug);
  return url.endsWith('/') ? url : `${url}/`;
}

/** Validate site.config.json. Throws ContentError with a fix for each problem. */
export function validateConfig(config) {
  const file = 'site.config.json';
  if (!config.site || typeof config.site !== 'object') throw new ContentError(file, null, 'missing "site" section — add { "site": { "title": …, "url": … } }');
  if (!config.site.title) throw new ContentError(file, null, 'missing "site.title" — the site needs a name');
  if (!/^https?:\/\//.test(config.site.url || '')) throw new ContentError(file, null, `"site.url" must be a full URL like "https://example.com" (got "${config.site.url}")`);
  config.site.url = config.site.url.replace(/\/$/, '');
  config.site.language ||= 'en';
  config.site.theme ||= 'default';
  config.collections ||= {};
  config.plugins ||= [];
  for (const [name, def] of Object.entries(config.collections)) {
    const where = `collection "${name}"`;
    if (!def.path) throw new ContentError(file, null, `${where} is missing "path" — e.g. "content/${name}"`);
    if (!def.urlPattern?.startsWith('/') || !def.urlPattern.includes(':slug')) {
      throw new ContentError(file, null, `${where} needs a "urlPattern" starting with "/" and containing ":slug" — e.g. "/${name}/:slug/"`);
    }
    if (!def.template) throw new ContentError(file, null, `${where} is missing "template" — the theme template name to render items with`);
    if (def.listUrl && !def.listTemplate) throw new ContentError(file, null, `${where} has "listUrl" but no "listTemplate" — add e.g. "listTemplate": "list"`);
    def.fields ||= [];
    for (const field of def.fields) {
      if (!field.name) throw new ContentError(file, null, `${where} has a field without a "name"`);
      if (!FIELD_TYPES.includes(field.type)) {
        throw new ContentError(file, null, `${where} field "${field.name}" has unknown type "${field.type}" — use one of: ${FIELD_TYPES.join(', ')}`);
      }
      if (field.type === 'select' && !Array.isArray(field.options)) {
        throw new ContentError(file, null, `${where} select field "${field.name}" needs an "options" list`);
      }
    }
    def.sortOrder ||= 'desc';
    def.pageSize ||= 10;
    def.label ||= name.charAt(0).toUpperCase() + name.slice(1);
  }
  return config;
}

/**
 * Load and validate every collection. Drafts are excluded from the result.
 * @returns {{collections: Record<string, object[]>, draftCount: number}}
 */
export function loadContent(root, config) {
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
      const file = path.join(def.path, entry);
      const slug = entry.slice(0, -3);
      if (slug !== slugify(slug) || slug === '') {
        throw new ContentError(file, null, `filename must be a slug (lowercase letters, digits, hyphens) — rename it to "${slugify(slug) || 'untitled'}.md"`);
      }
      const { data, body, lineOf } = parseFrontmatter(fs.readFileSync(path.join(root, file), 'utf8'), file);
      validateFields(data, def.fields, file, lineOf);
      if (data.draft === true) { draftCount++; continue; }
      const item = {
        ...data,
        slug,
        url: urlFor(def.urlPattern, slug),
        file,
        collection: name,
        body,
      };
      if (isIsoDate(item.date)) item.dateFormatted = formatDate(item.date, config.site.language);
      items.push(item);
    }
    if (def.sortBy) {
      const dir = def.sortOrder === 'asc' ? 1 : -1;
      items.sort((a, b) => (a[def.sortBy] > b[def.sortBy] ? dir : a[def.sortBy] < b[def.sortBy] ? -dir : 0));
    }
    collections[name] = items;
  }
  return { collections, draftCount };
}
