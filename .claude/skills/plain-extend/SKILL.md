---
name: plain-extend
description: Extend this plain site's capabilities — add a collection or a field, add a page layout or template, write a plugin, apply a starter, or run an engine upgrade or a content import. Use for "add a testimonials section", "posts need an author field", "write a plugin that…", "add a landing page", "update the engine", "import my old blog".
---

# Extending a plain site

Adding capability here means editing `site.config.json` and, at most, dropping a
folder into `plugins/`. There is no build step to configure and no package to
install — the constraints below are what keep it that way.

**Read `CLAUDE.md` for the full reference** (every field type, the complete plugin
hook API, template syntax, the upgrade contract). This skill is the order to do
things in and the traps to avoid.

## Never violate these

- **Vanilla only.** No frameworks, no bundlers, no TypeScript. Plain ES modules,
  JSDoc for types.
- **Exactly one runtime dependency** (`marked`). Adding *any* package — including
  a dev dependency — is out of bounds. If a task seems to need one, it doesn't.
- **No database.** All state is files in this repo.
- **The published site must work with JavaScript disabled.** Client JS is
  progressive enhancement, always.
- `lib/util.js`, `lib/template.js`, `lib/markdown.js`, `lib/i18n.js` are
  isomorphic — they must never import `node:*`, because the admin runs them in the
  browser so previews match the build exactly.
- Core (`build.js` + `lib/` + admin JS) stays under 3,000 lines; no file over 500.
  Too big → make it a plugin.

## Add a field to an existing collection

Add it to that collection's `fields` array in `site.config.json`:

```json
{ "name": "author", "type": "text" }
```

Types: `text`, `textarea`, `date`, `boolean`, `image`, `list`, `select` (needs
`options`). Optional keys: `required`, `default`.

**That is the whole job** — the admin renders its edit forms from this schema, so
no code changes. Then use it in the theme template: `{{ page.author }}`.

Careful: adding `"required": true` to a collection that already has content makes
every existing file fail validation until it has the field. Add a `default`, or
backfill the files in the same commit.

## Add a collection

1. Add the entry to `collections` in `site.config.json` (path, `urlPattern` with
   `:slug`, `template`, optional `listUrl` + `listTemplate`, `sortBy`, `rss`, and
   its `fields`).
2. `mkdir -p content/<name>` and add at least one `.md` file.
3. Make sure the theme has the template it names, in `themes/<theme>/templates/`.

**For repeated page sections — features, FAQ, testimonials, pricing tiers — use a
data-only collection instead:** add `"render": false` and omit `urlPattern`,
`template`, and `listUrl`. Each entry is one editable `.md` file with no URL of
its own; templates loop them with
`{{#each collections.<name> as item}}…{{/each}}`. Order them with a numeric
`order` field plus `"sortBy": "order", "sortOrder": "asc"`.

## Add a page layout (landing / sales pages)

A landing page is core content, not a plugin: it must work with JS off. Any item's
frontmatter can set `template:` to override its collection's template, so a
landing page is a normal `pages` item with `template: landing`. Hero and CTA come
from frontmatter fields the landing template reads (`heroTagline`,
`heroCtaLabel`/`heroCtaUrl`, `ctaHeading`/`ctaLabel`/`ctaUrl`, section headings).
To edit those as forms, add them to the collection's `fields` and tag each
`"showFor": "landing"` so the admin shows them only for that layout. Its sections
are the `render: false` collections above — each section hides when its collection
is empty.

## Write a plugin

A plugin is a folder. Install = copy the folder + add its name to `"plugins"`.

```
plugins/my-plugin/
├── plugin.json     # {name, version, description} required; hooks/client/options optional
├── index.js        # default-exports {init, transformContent, renderPage, afterBuild}
├── client.js       # auto-injected as a module before </body>
└── client.css      # auto-injected before </head>
```

Checklist: create the folder + `plugin.json` → write the hooks → add the name to
`"plugins"` in `site.config.json` → `node build.js` → inspect the output in
`dist/` → `node --test tests/`.

Rules worth stating up front:

- Every hook receives the plugin's resolved options as its **last** argument
  (manifest defaults overridden by `pluginOptions.<name>`).
- A plugin that throws fails the whole build — that is deliberate.
- Client code reads its options from the injected JSON blob
  (`#plugin-options`), and resolves backends by **name** from the reserved
  `$services` key. Never hardcode a backend URL in a plugin.
- Declare `client` entries only for files that actually exist.

Read `plugins/search/` (afterBuild + client), `plugins/contact-form/`
(renderPage + options), and `plugins/api-form/` (config-declared forms, services)
as the reference implementations. The full hook signatures are in `CLAUDE.md`.

## Apply a starter

A starter is a theme plus a `starter.json` declaring collections, a navigation
preset, sample content, and sometimes plugins. The admin's Appearance screen
applies one with a try-on preview. By hand: set `site.theme`, merge the starter's
`collections` into `site.config.json`, copy its `sample/**` into `content/`, and
enable any plugins it lists.

## Engine upgrades and imports

- **Upgrade:** `tools/update.js` replaces engine-owned files wholesale and flags
  any the user modified. Engine-owned = `build.js`, `lib/`, `admin/`,
  `themes/default/`, `config.defaults.json`, `tools/`, `migrations/`, the
  workflows, the built-in plugins, and `.claude/`. **Never hand-edit those in a
  site repo** — copy to a custom theme/plugin instead.
- **If you change an engine file in this repo**, regenerate the manifest:
  `node tools/engine-manifest.js`.
- **Import an old site:** `node tools/migrate/<source>.js <input>` (jekyll,
  joomla, vuepress). Every importer must emit a complete old→new
  `data/redirects.json` — silently changing URLs destroys SEO. The step-by-step
  guide is `tools/migrate/README.md`.

## Finish the same way, every time

```sh
node --test tests/ && node build.js
```

If the output changed on purpose, `node tests/update-goldens.js` and review the
diff before committing. A red test or a failed build must never be committed.
