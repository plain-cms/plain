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

## The admin (`admin/`)

A vanilla single-page app served at `/admin/` on the published site. It reads
the static API (`/api/site.json` for the schema, `/api/<collection>/index.json`
for published items) and writes through the GitHub contents API — every save
is a commit; there is no other backend.

- `js/github.js` — GitHub REST calls, token in localStorage (never sent anywhere but api.github.com)
- `js/app.js` — router + dashboard, collection lists, navigation editor, settings, sign-in
- `js/editor.js` — the schema-driven editor: fields come from config, preview renders with `lib/markdown.js`
- `js/media.js` — media library + uploads to `media/YYYY/MM/` (≤5 MB, resize offer over 1 MB)
- `js/ui.js` — DOM helpers, toasts, dialogs, the build-status pill

The build copies `admin/` plus the isomorphic lib modules and `marked` into
`dist/admin/` — the editor preview and the build share one renderer (§10.2).
UI language rule: never show Git words. Say Save / Publish / History / Restore.
Commit messages it writes: `post: publish "Title"`, `page: edit "About"`,
`media: add lake.jpg`, `navigation: update menu`, `settings: update site settings`.

## The static API (`dist/api/`)

- `api/site.json` — `{site, collections, plugins, navigation}` (the machine-readable content model)
- `api/<collection>/index.json` — `{items: [...]}`, sorted like the site
- `api/<collection>/<slug>.json` — one item: frontmatter fields + `url`, `slug`, `file`, `body` (Markdown), `content` (HTML). Exception: an item named `index.md` has no per-item file (it would collide with the listing above, which carries every item in full).

Drafts never appear in the API. Any script or agent can consume these without a server.

The build also emits `llms.txt` (title, summary, and a link list per collection — the llms.txt convention) so AI agents can survey the site in one request.

## AI assist (admin/js/ai.js)

Editor-facing AI (§8.3): a provider interface `complete(prompt, content) → text` with an Anthropic adapter calling `/v1/messages` directly from the browser (BYOK — key pasted in Settings, kept in localStorage, sent only to api.anthropic.com). Five actions in `assist`: `improve`, `describe`, `titles`, `altText` (vision), `translate`. Rules: every action shows a before/after review and requires an explicit Apply — never auto-apply; without a key the buttons explain how to add one; no `temperature`/`thinking` params (removed on current models — they 400).

Because content is plain files, **any agent workflow works with zero integration**: Claude Code writing a weekly post, an Action drafting a changelog PR, a scheduled agent updating a prices page. The tests protect this — an agent that breaks the schema gets a failing build with a clear message, not a broken site.

## Themes & starters

A theme is `themes/<name>/` with `templates/` (`base.html`, plus whatever templates collections name), optional `templates/partials/`, and `assets/` (copied to `/assets/`). All design decisions are CSS custom properties in one `:root` block at the top of `theme.css` — restyle by editing tokens, never selectors. Quality floor: semantic HTML, WCAG AA, visible focus, light + dark scheme, print stylesheet, no external requests, system fonts only.

A **starter** (§10.3) is a theme plus an optional `starter.json` declaring the collections, navigation preset, and `sampleContent` folder it installs. Applying a starter merges its `collections` into config, sets navigation, and copies `sample/**` (all `example: true`) into the site — each a commit. A theme may also ship `content-templates/*.md` (pre-structured "New post" starting points) and, via `config.theme.tokens`, per-token customizations that the build injects as a `<style id="theme-tokens">` block **after** `theme.css` — so upgrades replace theme files wholesale while customizations survive (§10.5). Ships with five ★ starters: `default` (Journal), `toolbox` (trades), `studio` (portfolio), `bistro` (restaurant), `manual` (docs).

The admin's Appearance screen renders a **try-on** of the user's own pages with a candidate theme entirely in the browser, using the same `lib/template.js`/`lib/markdown.js` the build uses (§10.2) — nothing is committed until Apply. `admin/js/appearance.js` also reads the community starter registry (§10.6). The first-run wizard (`admin/js/wizard.js`) runs when the config still has the placeholder title `"My Site"`.

## Plugins — the AI extension surface

**A plugin is a folder in `plugins/`. Install = copy the folder + add its name to `"plugins"` in `site.config.json`.** No npm, no registry, no build step. This section is the complete API.

```
plugins/my-plugin/
├── plugin.json     # manifest (required)
├── index.js        # build-time hooks (optional)
├── client.js       # browser module, auto-injected into every page (optional)
└── client.css      # stylesheet, auto-injected into every page (optional)
```

`plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "One sentence.",
  "hooks": ["transformContent"],
  "client": { "js": "client.js", "css": "client.css" },
  "options": { "someOption": "default value" }
}
```

Only `name`, `version`, `description` are required. `hooks` is documentation (the loader inspects `index.js` itself). Declare `client` entries only for files that exist.

`index.js` default-exports an object of hooks. All are optional; each may be sync or async. **Every hook receives the plugin's resolved options as its last argument** (manifest `options` overridden by the site's `pluginOptions.<name>` in `site.config.json`):

```js
export default {
  // After config load, before content is scanned. site = {config, data, collections: null}.
  init(site, options) {},

  // Once per content item, after frontmatter parsing, BEFORE Markdown rendering.
  // Mutate the item freely: item.body is raw Markdown; fields (title, date, …)
  // are set; item.url/slug/file/collection too. Anything you add rides along
  // into templates and the JSON API (e.g. item.readingTime = …).
  transformContent(item, site, options) {},

  // Once per rendered HTML page (items, list pages, the 404). Return a string
  // to replace the page's HTML; return nothing to leave it unchanged.
  // page = the template context's page object (item or {title, url}).
  renderPage(page, html, site, options) { return html; },

  // After everything is written to dist/. Emit extra files here.
  // site.renderPage(templateName, context) renders a themed page for you:
  //   site.renderPage('page', {page: {title: 'X', url: '/x/', content: '<p>…</p>'}})
  afterBuild(distPath, site, options) {},
};
```

Rules:
- `site` is `{config, data, collections, renderPage}` — `collections` is filled after `init`.
- A plugin that throws fails the whole build, with the plugin's name in the error.
- Client assets publish to `/plugins/<name>/…` and are injected into every page in config order (`css` before `</head>`, `js` as a module before `</body>`). Client code reads its options from the injected JSON: `JSON.parse(document.getElementById('plugin-options').textContent)["my-plugin"]`.
- Client JS must be progressive enhancement — the page must work without it (C5).
- The build also emits `search-index.json` (`[{url, title, description, tags, text}]`) — plugins may consume it.
- Study `plugins/search/` (afterBuild + client) and `plugins/contact-form/` (renderPage + options) as reference implementations.

**Checklist for a new plugin:** create the folder + `plugin.json` (+ `index.js`/client files) → add its name to `"plugins"` in `site.config.json` → `node build.js` → check the output in `dist/` → `node --test tests/`.

## Build pipeline (build.js)

config → load plugins → data → `init` hooks → content (validate) → `transformContent` hooks → Markdown → templates → client-asset injection → `renderPage` hooks → outputs (`sitemap.xml`, per-collection `rss.xml`, `robots.txt`, `_redirects` + fallback pages, `404.html`, `api/`, `search-index.json`, `llms.txt`) → copy `media/` + theme assets + plugin client assets + admin → `afterBuild` hooks. The build is deterministic: same files in, same bytes out (golden tests depend on this — never use the current time in outputs).

## Upgrade system (§14) — `tools/`, `migrations/`, `engine.json`

Upgrades are pull requests built by **wholesale file replacement**, never a merge. Ownership contract (§14.1): engine-owned = `build.js`, `lib/`, `admin/`, `themes/default/`, `config.defaults.json`, the workflows, `tools/`, `migrations/`, `plugins/{search,contact-form,reading-time}`. User-owned = `content/`, `data/`, `media/`, `site.config.json`, custom themes/plugins. Never hand-edit an engine file in a user's site — copy the default theme to `themes/custom/` first.

- `engine.json` — `{version, migration, files: {path: sha256}}`, generated by `node tools/engine-manifest.js`. **Regenerate it whenever you change an engine file, before a release.**
- `config.defaults.json` — engine defaults deep-merged *under* the user's sparse `site.config.json` at build time (§14.3, `deepMerge` in `lib/util.js`). New features ship with working defaults without touching the user's file.
- `tools/update.js` — the updater. For each engine file: if the local hash matches the *installed* manifest it's replaced; if it differs the user modified it, so it's left and flagged for manual/AI merge. Runs `migrations/NNN-*.js` between the installed and target levels. Emits a PR-ready report.
- `migrations/NNN-description.js` — idempotent plain-Node scripts for breaking changes (see `migrations/README.md`).
- `.github/workflows/update.yml` — `workflow_dispatch` (from the admin's update banner) + weekly cron: fetch upstream, run the updater, test + build, open a PR.

## Importers (§15) — `tools/migrate/`

Local CLIs, plain Node, outside the core dependency budget. `node tools/migrate/<source>.js <input> [outDir]` writes `content/`, `media/`, and — non-negotiably — a complete old→new `data/redirects.json`, plus a migration report. `tools/migrate/jekyll.js` is the reference (Jekyll → plain: frontmatter remap, Liquid stripping, permalink-based redirects). Every importer must emit redirects; silently changing URLs destroys SEO.

## Errors are teaching moments

Every error message must name the file (and line where possible), say what is wrong, and say how to fix it — in plain language. Follow the existing `ContentError` pattern.

## Style

Boring, explicit code beats clever code. Match the existing voice: small pure functions, JSDoc where types help, comments only for constraints the code can't express. Future readers include AI agents and curious non-experts.
