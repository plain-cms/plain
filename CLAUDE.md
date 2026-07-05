# CLAUDE.md — how to work on this repo

This is **plain**, a Git-native CMS: content is Markdown files, configuration is JSON, the build emits a static site into `dist/`. The full spec is `cms-spec.md` — read it before structural changes. This file is the working reference for day-to-day edits.

## The one rule

**Before committing, always run both:**

```sh
node --test tests/
node build.js
```

A red test or a failed build must never be committed. The golden-file test compares built output byte-for-byte; if you intentionally changed output, run `node tests/update-goldens.js` and review the diff.

## Hard constraints (from cms-spec.md §2 — never violate)

- Vanilla only: no frameworks, no bundlers, no TypeScript. Plain ES modules, JSDoc for types.
- Exactly one runtime dependency: `marked`. No new packages, including dev dependencies.
- Core (`build.js` + `lib/` + admin JS) stays under 2,500 lines; no file over 400. Too big → make it a plugin.
- No database. All state is files in this repo.
- The published site must work with JavaScript disabled.
- `lib/util.js`, `lib/template.js`, `lib/markdown.js` are **isomorphic**: they must never import `node:*` — the admin runs them in the browser so previews match the build exactly.

## Commands

| Command | What it does |
| ------- | ------------ |
| `node build.js` | Build the site into `dist/` |
| `node build.js --watch` | Build, serve on :4000, rebuild on change |
| `node --test tests/` | Run the test suite |
| `node tests/update-goldens.js` | Regenerate golden files after an intentional output change |

## Content model

Collections are defined in `site.config.json`. A collection = a folder of `.md` files + a field schema:

```json
"posts": {
  "path": "content/posts",        // folder of .md files
  "urlPattern": "/blog/:slug/",   // must start with / and contain :slug
  "template": "post",             // theme template for one item
  "listUrl": "/blog/",            // optional: emit a paginated list page
  "listTemplate": "list",         // required if listUrl is set
  "label": "Blog",                // optional: heading for list pages
  "sortBy": "date", "sortOrder": "desc",
  "pageSize": 10,                 // pagination size for list pages
  "rss": true,                    // emit <listUrl>rss.xml
  "fields": [
    { "name": "title", "type": "text", "required": true },
    { "name": "date",  "type": "date", "required": true },
    { "name": "draft", "type": "boolean", "default": false }
  ]
}
```

Field types: `text`, `textarea`, `date`, `boolean`, `image`, `list`, `select` (needs `options`). The admin renders its edit forms from this schema, so **adding a field to config is the whole job** — no code changes.

**To add a collection:** add an entry to `collections`, create its folder under `content/`, and make sure the theme has the template it names. That's all.

### Content files

Markdown with frontmatter. The frontmatter parser is a deliberate, hand-rolled subset — only these forms are legal:

```markdown
---
title: Plain scalar value          # string; true/false → boolean; 42 → number
quoted: "kept as a string"         # quotes force string
date: 2026-07-05                   # dates are ISO strings, validated by field type
tags:                              # a list: "key:" then indented "- item" lines
  - launch
---
Body in Markdown.
```

No nesting, no multiline strings, no YAML anchors. Unknown extra keys are allowed (e.g. `example: true` marks sample content).

Rules:
- **Filename = slug = URL.** `hello-world.md` → `/blog/hello-world/`. Filenames must be lowercase slugs. `index.md` maps to the collection's URL root (`/` for pages).
- **Renaming a file changes its URL** — add the old URL to `data/redirects.json`: `{ "/old-url/": "/new-url/" }`.
- `draft: true` excludes the item from the build entirely (pages, sitemap, RSS).
- Validation failures stop the build with `file:line — problem — fix`. Broken content never half-deploys.

### Data files

Every `data/*.json` is available to templates as `data.<filename>` (e.g. `{{#each data.navigation as entry}}`). `navigation.json` is a list of `{label, url}`; `redirects.json` maps old → new URLs and produces both a `_redirects` file and meta-refresh fallback pages.

## Template syntax (lib/template.js — the complete list)

```
{{ item.title }}                      escaped output (dot-paths only, no JS)
{{{ page.content }}}                  raw output, for rendered HTML
{{#if page.draft}} … {{else}} … {{/if}}    truthy test; an empty list is false
{{#each items as item}} … {{/each}}   iterate a list, alias in scope
{{> post-card}}                       partial from templates/partials/
```

Variables available in every template:

- `site` — the `site` block of config (`site.title`, `site.url`, …)
- `page` — the current item: its fields plus `url`, `slug`, `content` (rendered HTML), `body` (raw Markdown), `dateFormatted`, `tagLinks` (`[{name, url}]`)
- `nav` — navigation entries with `current: true` on the active one
- `data` — all data files; `collections` — all items by collection name
- `feeds` — RSS feed URLs (for `<link rel="alternate">`)
- List templates also get: `items` (this page's slice), `pagination` (`page`, `totalPages`, `multiple`, `newer`, `older`), `tag` (on tag pages)

Every page template renders into `base.html`'s `{{{ body }}}` slot.

## Themes

A theme is `themes/<name>/` with `templates/` (`base.html`, plus whatever templates collections name), optional `templates/partials/`, and `assets/` (copied to `/assets/`). All design decisions are CSS custom properties in one `:root` block at the top of `theme.css` — restyle by editing tokens, never selectors. Quality floor: semantic HTML, WCAG AA, visible focus, light + dark scheme, print stylesheet, no external requests.

## Build pipeline (build.js)

config → data → content (validate) → Markdown → templates → outputs (`sitemap.xml`, per-collection `rss.xml`, `robots.txt`, `_redirects` + fallback pages, `404.html`) → copy `media/` + theme assets. The build is deterministic: same files in, same bytes out (golden tests depend on this — never use the current time in outputs).

Plugin hooks (`lib/plugins.js`) arrive in Milestone 3 and will be documented here.

## Errors are teaching moments

Every error message must name the file (and line where possible), say what is wrong, and say how to fix it — in plain language. Follow the existing `ContentError` pattern.

## Style

Boring, explicit code beats clever code. Match the existing voice: small pure functions, JSDoc where types help, comments only for constraints the code can't express. Future readers include AI agents and curious non-experts.
