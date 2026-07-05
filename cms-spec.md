# cms-spec.md — A Git-native CMS for the AI age

Working name: **plain** (placeholder — rename freely).
License: MIT, open source from day one.
Audience for this document: Claude Code (or any capable engineer) building the project from scratch in a fresh GitHub repo.

---

## 1. Vision

A CMS where **the repository is the database, static files are the API, and AI is the admin**.

Traditional CMSes (WordPress, Strapi, Ghost) assume a database, a server, and a human clicking through admin panels. In the AI age, all three assumptions are wrong for small/medium sites:

1. **Content as plain files** (Markdown + JSON) is the most AI-legible, AI-editable format that exists. An agent can read, write, diff, and review it natively. A database hides content behind a driver; a repo exposes it to every tool ever made for text.
2. **Git is the backend.** It gives you versioning (undo = revert), auth (GitHub accounts), collaboration (PRs), audit history, and a REST API for free. There is nothing to patch, back up, or get hacked.
3. **The build emits a static read-only JSON API** alongside HTML. Any script, agent, or frontend can consume the site's content without a running server.
4. **Non-technical editors never see Git.** They see a clean admin page with "Save draft" and "Publish" buttons. Under the hood those are commits.
5. **Features are added by prompting.** The repo ships with this spec and a `CLAUDE.md`, so "add a testimonials section" is a one-prompt job for Claude Code, and a plugin is a folder an AI can generate in one shot.

The product a non-technical person experiences: a website that costs $0/month to host, updates in ~30 seconds after clicking Publish, can never lose their work, and has an "Improve with AI" button next to every text field.

---

## 2. Hard constraints (non-negotiable)

These constraints ARE the product. Violating them to "do it properly" defeats the purpose.

- **C1. Vanilla only.** No frameworks (no React/Vue/Svelte), no bundlers (no Vite/webpack), no CSS preprocessors, no TypeScript compile step. Plain ES modules, plain CSS with custom properties, semantic HTML. Types via JSDoc comments.
- **C2. One runtime dependency budget.** The core may depend on exactly one npm package: `marked` (Markdown → HTML). Frontmatter parsing, templating, routing, RSS, sitemap, search index — all hand-rolled. Dev dependencies: none (use built-in `node:test` and `node --watch`).
- **C3. Readable in one sitting.** The entire core (`build.js` + `lib/` + admin JS, excluding themes/plugins/content) must stay under **2,500 lines**. No single file over 400 lines. If a feature can't fit, it becomes a plugin.
- **C4. No database, ever.** All state lives in files inside the repo. All media lives in the repo (with size guidance, see §7).
- **C5. Works without JavaScript.** The published site must be fully readable and navigable with JS disabled. JS is progressive enhancement (search, galleries, forms). The admin panel is exempt (it requires JS).
- **C6. Any static host.** Output is a plain folder of files. Must deploy unmodified to GitHub Pages, Cloudflare Pages, Netlify, or an nginx folder.
- **C7. Node 20+, ES modules**, `"type": "module"` in package.json. No CommonJS.
- **C8. AI-operable by design.** Deterministic file layout, machine-readable content model, `llms.txt`, and stable IDs so agents can modify the site without breaking it.

---

## 3. Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub repo                          │
│                                                             │
│  content/*.md   data/*.json   media/*   themes/  plugins/   │
│        │                                                    │
│        │  git push (from admin UI, Claude Code, or agent)   │
│        ▼                                                    │
│  GitHub Action ──► node build.js ──► dist/                  │
│                                       ├── *.html  (pages)   │
│                                       ├── api/*.json (API)  │
│                                       ├── search-index.json │
│                                       ├── sitemap.xml, rss  │
│                                       └── llms.txt          │
│        │                                                    │
│        ▼                                                    │
│  GitHub Pages / Cloudflare Pages (free static hosting)      │
└─────────────────────────────────────────────────────────────┘

Admin (/admin/) = static SPA on the same site.
It reads & writes content via the GitHub REST API (contents endpoint).
Publish = commit to main → Action rebuilds → site updates in ~30s.
```

**Does it need an API backend?** No server of ours, ever. Three roles of a backend, solved without one:

- **Read API** → the build emits `dist/api/` as static JSON (free, cacheable, CDN-served).
- **Write API** → GitHub's REST API (create/update file = commit). The admin calls it directly from the browser.
- **Auth** → v1: a GitHub fine-grained Personal Access Token (scoped to this one repo, contents read/write) pasted once into the admin and kept in `localStorage`. v2 (optional, Milestone 6): a ~60-line Cloudflare Worker doing the GitHub OAuth code exchange so editors just click "Sign in with GitHub". The Worker holds no state.

Dynamic needs (contact forms, comments) are plugins that point at third-party endpoints (Formspree/own Worker, giscus). Core stays serverless.

---

## 4. Repository layout

```
/
├── cms-spec.md              # this file — source of truth
├── CLAUDE.md                # instructions for AI agents working on the repo
├── README.md                # human quickstart: fork → enable Pages → edit
├── LICENSE                  # MIT
├── package.json             # "type": "module", dep: marked
├── site.config.json         # ALL site configuration, one file
├── build.js                 # entry point, orchestrates lib/
├── lib/
│   ├── content.js           # scan content/, parse frontmatter, validate
│   ├── markdown.js          # marked config + small extensions
│   ├── template.js          # hand-rolled template engine (~150 lines)
│   ├── plugins.js           # plugin loader + hook runner
│   ├── outputs.js           # sitemap, rss, robots, llms.txt, api/*.json
│   └── util.js              # slugify, dates, fs helpers
├── content/
│   ├── pages/               # one .md per page (about.md, contact.md…)
│   └── posts/               # blog collection
├── data/
│   ├── navigation.json      # menus
│   └── redirects.json       # old → new URL map
├── media/                   # images & files, referenced by relative path
├── themes/
│   └── default/
│       ├── theme.json       # name, tokens description
│       ├── templates/       # base.html, page.html, post.html, list.html, 404.html
│       └── assets/          # theme.css (tokens + styles), enhance.js
├── plugins/
│   ├── search/              # ships enabled
│   └── contact-form/        # ships disabled, as reference
├── admin/
│   ├── index.html           # the editor app shell
│   ├── admin.css
│   └── js/                  # es modules: github.js, editor.js, media.js, ai.js, app.js
├── tests/                   # node:test golden-file tests
└── .github/workflows/
    └── build-deploy.yml     # build + deploy to Pages on push to main
```

---

## 5. Content model

### 5.1 Collections

Defined in `site.config.json`. A collection = a folder of Markdown files + a schema. Ships with `pages` and `posts`; users (or AI) add more by editing config — no code changes.

```json
{
  "site": {
    "title": "My Site",
    "url": "https://example.com",
    "description": "…",
    "language": "en",
    "theme": "default"
  },
  "collections": {
    "pages": {
      "path": "content/pages",
      "urlPattern": "/:slug/",
      "template": "page",
      "fields": [
        { "name": "title",       "type": "text",     "required": true },
        { "name": "description", "type": "text" },
        { "name": "draft",       "type": "boolean",  "default": false }
      ]
    },
    "posts": {
      "path": "content/posts",
      "urlPattern": "/blog/:slug/",
      "template": "post",
      "listUrl": "/blog/",
      "listTemplate": "list",
      "sortBy": "date",
      "sortOrder": "desc",
      "rss": true,
      "fields": [
        { "name": "title",  "type": "text",   "required": true },
        { "name": "date",   "type": "date",   "required": true },
        { "name": "description", "type": "text" },
        { "name": "cover",  "type": "image" },
        { "name": "tags",   "type": "list" },
        { "name": "draft",  "type": "boolean", "default": false }
      ]
    }
  },
  "plugins": ["search"]
}
```

Field `type` drives the admin form control: `text`, `textarea`, `date`, `boolean`, `image`, `list`, `select` (with `options`). The admin renders forms **from this schema** — adding a field to config instantly adds it to the editor. This is the core trick that makes the CMS extensible without code.

### 5.2 Content files

Markdown with YAML-style frontmatter (parse by hand: `key: value`, lists as `- item`, booleans, ISO dates — a deliberately small subset, documented; no YAML library):

```markdown
---
title: Hello world
date: 2026-07-05
tags:
  - launch
draft: false
---

Body in **Markdown**. Images by relative path: ![Lake](/media/lake.jpg)
```

Rules:
- Filename = slug (`hello-world.md` → `/blog/hello-world/`). Renaming a file is a URL change; admin warns and offers to add a redirect to `data/redirects.json`.
- `draft: true` items are excluded from the build (and from `api/`, sitemap, RSS). The admin previews drafts client-side by rendering Markdown in the browser with the same `marked` build.
- The build **validates** every file against its collection schema and fails with a precise, human-readable error (file, line, field). Broken content must never half-deploy.

### 5.3 Data files

Anything that isn't a page: `data/navigation.json` (array of `{label, url}` trees), `data/redirects.json`. Templates can access all data files as `{{data.navigation}}` etc. The admin exposes a simple menu editor for navigation.

---

## 6. Build engine (`build.js`)

Single command: `node build.js` (and `node build.js --watch` for local dev with a tiny static file server on :4000, using only `node:http`).

Pipeline (target: < 2s for 500 pages):

1. Load `site.config.json`; load enabled plugins; run `init` hooks.
2. Scan collections → parse frontmatter → validate against schema → build an in-memory `site` object: `{ config, collections: { posts: [items…] }, data }`.
3. Run `transformContent(item, site)` hooks (plugins may mutate items).
4. Render Markdown bodies with `marked` (GFM tables, code fences with language classes; external links get `rel="noopener"`; heading anchors auto-generated).
5. Render each item through its template (see §6.1) into `dist/`, plus collection list pages with pagination (`page/2/`), plus tag pages for collections with `tags`.
6. Run `renderPage(page, html, site)` hooks (plugins may post-process HTML — e.g., inject scripts).
7. Emit outputs: `sitemap.xml`, `rss.xml` per RSS-enabled collection, `robots.txt`, `_redirects` (from `data/redirects.json`, Cloudflare/Netlify format) **and** meta-refresh HTML fallbacks for GitHub Pages, `404.html`.
8. Emit the **static API**: `api/site.json` (config + nav), `api/<collection>/index.json` (all items, body as both markdown and rendered HTML), `api/<collection>/<slug>.json`.
9. Emit `search-index.json` (slug, title, description, tags, plain-text body truncated to ~2000 chars) and `llms.txt` (site summary + link list, per the llms.txt convention).
10. Copy `media/`, theme assets, admin folder, plugin client assets into `dist/`.
11. Run `afterBuild(distPath, site)` hooks. Print a one-screen build report (pages, warnings, total size, time).

### 6.1 Template engine (hand-rolled, ~150 lines)

Mustache-flavored subset — enough, and no more:

- `{{ expr }}` escaped output, `{{{ expr }}}` raw (used for rendered content)
- `{{#if expr}} … {{else}} … {{/if}}`
- `{{#each list as item}} … {{/each}}`
- `{{> partial-name}}` partials from the theme's `templates/partials/`
- Dot-path expressions only (`item.title`, `site.config.site.title`). No arbitrary JS in templates — this keeps templates safe for AI generation and trivial to parse.

Every template extends `base.html` via a `{{{ body }}}` slot. `base.html` owns `<head>` (meta, OG tags from item fields, canonical, RSS link, theme CSS, plugin styles/scripts).

---

## 7. Media

- Admin uploads commit files to `media/YYYY/MM/filename` via the GitHub contents API (base64). Enforce ≤ 5 MB per file in the admin, warn at 1 MB, auto-suggest client-side resize (canvas) to max 2000px before upload — this keeps the repo lean without any server image pipeline.
- Build v1 does **no** image processing (would blow the dependency budget). Templates emit `loading="lazy"` and `decoding="async"`; admin nags for alt text (with an AI button to generate it).
- Milestone 7 (optional): an opt-in GitHub Action step generates responsive variants in CI. Never in core.

---

## 8. Admin (`/admin/`)

A single-page vanilla app. Design goal: **a smart but non-technical person publishes a post in under 2 minutes without learning anything about Git, Markdown syntax, or hosting.**

### 8.1 Screens

1. **Sign in** — v1: paste a GitHub fine-grained token (one-time; setup guide with screenshots is part of README; the site owner typically does this once on the editor's machine). Stored in `localStorage`. v2: "Sign in with GitHub" via the OAuth Worker.
2. **Dashboard** — collections as cards, recent items, site status (last publish time via commits API), "New post" front and center.
3. **Editor** — schema-driven form (fields from config) + Markdown body with: formatting toolbar (bold, heading, link, image, list — inserts Markdown, no contenteditable rich-text in v1), live side-by-side preview (rendered with the same `marked`), autosave to `localStorage` every 5s, image upload by drag-drop or paste.
4. **Media library** — grid of `media/`, upload, copy-path, alt-text prompts.
5. **Navigation editor** — reorder/add/remove menu items (writes `data/navigation.json`).
6. **Settings** — form over `site.config.json` site block (title, description, language, theme picker).

### 8.2 Publish model

- **Save draft** → commit with `draft: true`. **Publish** → commit with `draft: false`. Commit messages are auto-generated and human-readable: `post: publish "Hello world"`, `page: edit "About"`, `media: add lake.jpg`.
- After publish, poll the Actions API and show a status pill: "Building… → Live ✓ (view site)". Never show raw Git vocabulary in the UI — no "commit", "push", "branch", "merge". Say "Save", "Publish", "History", "Restore".
- **History tab** per item: list of commits touching that file, one-click "Restore this version" (creates a new commit; nothing is ever destructive).
- Conflict safety: before writing, compare the file's SHA; if it changed since load, show "This was edited elsewhere — reload / overwrite / copy my text".

### 8.3 AI assist (the "age of AI" part, editor-facing)

An `ai.js` module with a provider interface (`complete(prompt, text) → text`). Ships with an Anthropic adapter; key is **BYOK**, pasted in Settings, stored in `localStorage`, calls made directly from the browser. Buttons, not chat:

- **Improve writing** (tightens the selected text, preserves voice)
- **Generate description** (SEO meta from body)
- **Suggest title** (3 options)
- **Alt text** for images (sends the image)
- **Translate page** (creates a sibling file, groundwork for i18n)

Every AI action shows a diff-style before/after and requires an explicit "Apply". Never auto-apply. If no key is configured, the buttons explain how to add one in one sentence.

### 8.4 Agent-facing AI (the deeper half)

- `CLAUDE.md` at repo root: how content is structured, how to add a collection, how to write a plugin, the schema of `site.config.json`, the rule "run `node build.js` and `node --test` before committing".
- Because content = files, **any** agent workflow works with zero integration: Claude Code writing a weekly post, an Action that drafts a changelog PR, a scheduled agent updating a prices page. The spec should state this as an explicit supported use case, and `tests/` must protect it: an agent that breaks the schema gets a failing build with a clear message, not a broken site.

---

### 8.5 First run & onboarding (falling in love in the first five minutes)

The product must teach itself. No manual, no video, no docs required to reach the first published page. The emotional target: within five minutes the user has a live site that looks professionally designed, contains their name, and they understand exactly how to change anything.

**Setup wizard** — runs automatically when the admin detects a fresh install (config still has the template placeholder title). Five steps, each skippable, progress dots, back always works:

1. **"What are you building?"** — a searchable grid of starter categories (blog, portfolio, restaurant, clinic, nonprofit… see §10.7). This one answer selects the theme, the collections, the navigation, and the sample content. It is the single highest-leverage question in the product.
2. **Name it** — site title, one-line tagline, optional logo upload. Nothing else.
3. **See it** — full-screen live preview of the chosen theme *already showing their title and tagline* (rendered in-browser, §10.2). One button: "Looks great" (plus "Try another look" returning to a filtered gallery).
4. **First words** — the starter's homepage and one example post open in the editor with clearly marked placeholder prompts (*"Replace this: one sentence about who you are"*). Optional AI shortcut if a key is configured: "Describe your site in one sentence and I'll draft these for you" — always shown as an editable draft, never auto-published.
5. **Go live** — Publish → build pill → success screen with the live URL, a tasteful one-time celebration (respects `prefers-reduced-motion`), and the setup checklist introduced.

**Setup checklist** — a dismissible dashboard card with a progress ring: ✓ Pick a look · ✓ Name your site · ○ Publish your first post · ○ Set up your menu · ○ Replace example content · ○ Connect a custom domain (links to a plain-language guide) · ○ Add an AI key (optional). Each item deep-links to the exact screen. Checklist state lives in `data/.onboarding.json` so it syncs across devices and editors.

**Empty states are invitations.** Every empty screen says what this place is for and offers the one next action: *"No posts yet. Your first one takes about two minutes."* [Write a post]. Never a blank table.

**Coach marks** — exactly three, on first editor open only: (1) write here, Markdown is optional; (2) the preview is your real site; (3) Publish makes it live in about 30 seconds — and History means you can always undo. Dismissed = never again (`localStorage`).

**Content templates** — "New post" offers *Blank / Announcement / How-to / Story / Update*: pre-structured bodies with instructional placeholders. Starters may ship their own (a restaurant starter adds *Menu item*, *Event*). Defined as plain `.md` snippets in `themes/<name>/content-templates/`.

**Example content is honest.** Starter samples carry `example: true` frontmatter; the admin badges them "Example" and the checklist tracks their replacement. They build and publish like normal content — the site never looks broken while learning.

**Safety as a feeling.** The UI repeats one promise in different words at the right moments: *you cannot break anything here — every change can be restored from History.* That sentence is what makes non-technical people brave enough to explore.

---

## 9. Plugin system

**A plugin is a folder. Install = copy the folder + add its name to config. No npm, no registry, no build step.** This makes "write me a plugin that does X" a one-prompt AI task.

```
plugins/search/
├── plugin.json      # manifest
├── index.js         # build-time hooks (optional)
└── client.js        # browser module (optional), auto-injected
└── client.css       # (optional), auto-injected
```

`plugin.json`:

```json
{
  "name": "search",
  "version": "1.0.0",
  "description": "Client-side full-text search over the prebuilt index",
  "hooks": ["afterBuild"],
  "client": { "js": "client.js", "css": "client.css" },
  "options": { "maxResults": 10 }
}
```

Build-time hooks (all optional, sync or async), called with a frozen-except-where-documented API:

```js
export default {
  init(site) {},                       // after config load
  transformContent(item, site) {},     // may mutate item (e.g. reading time)
  renderPage(page, html, site) { return html; },  // may transform final HTML
  afterBuild(distPath, site) {}        // emit extra files
}
```

Rules: plugins read options from `site.config.json` under `pluginOptions.<name>`; a throwing plugin fails the build with its name in the error; client assets are injected into `base.html` automatically in config order. Document the hook API exhaustively in `CLAUDE.md` — it is the AI extension surface.

**Ships with:** `search` (enabled — a `/search/` page + input consuming `search-index.json`, no dependencies) and `contact-form` (disabled reference — progressive-enhancement form POSTing to a configurable endpoint). Good first community plugins to list in README: analytics snippet, giscus comments, image gallery, reading time, table of contents.

---

## 10. Theming, starters & the theme gallery

### 10.1 Theme anatomy

A theme = `templates/` + `assets/theme.css` + `theme.json` + `screenshot.png` (1280×800, rendered from sample content). Switching themes = one config value. All colors, type, spacing as CSS custom properties in one `:root` block at the top of `theme.css` (~30 tokens) so users and AI restyle by editing tokens, never selectors.

**Every theme's quality floor:** semantic HTML, WCAG AA contrast, visible focus states, `prefers-reduced-motion` respected, print stylesheet, no cookies, no external requests (fonts self-hosted or system stack), light + dark scheme, Lighthouse ≥ 95 on all four categories.

**Design direction:** no theme may look like generic AI output. Explicitly avoid the current AI-design clichés (cream background + serif display + terracotta accent; near-black + single acid-green accent; hairline-rule broadsheet pastiche). Each theme makes deliberate choices grounded in its industry's real vernacular — its materials, artifacts, and conventions — and spends its boldness on **one signature element**, keeping everything around it quiet and precise.

### 10.2 Isomorphic rendering (the trick behind every preview)

`lib/template.js` and `lib/markdown.js` must run unmodified in the browser: they take strings in and return strings out, never touching `node:fs` (the build passes file contents in; the admin passes editor state in). One rendering engine therefore powers the build, the editor's live preview, **and** the theme gallery's try-on — what you preview is what deploys, byte for byte.

### 10.3 Starters: a theme is not enough

The best restaurant "theme" is not a color palette — it's a menu collection with price alignment. So the unit users choose is a **starter** = theme + collections + navigation preset + sample content + content templates, declared in an optional `starter.json` inside the theme folder:

```json
{
  "starter": "bistro",
  "collections": { "menu": { "path": "content/menu", "urlPattern": "/menu/:slug/", "fields": [
    { "name": "title", "type": "text", "required": true },
    { "name": "price", "type": "text" },
    { "name": "section", "type": "select", "options": ["Starters", "Mains", "Desserts", "Drinks"] }
  ] } },
  "navigation": [ { "label": "Menu", "url": "/menu/" }, { "label": "Visit", "url": "/visit/" } ],
  "sampleContent": "sample/"
}
```

Applying a starter merges its collections into `site.config.json`, installs sample content (all `example: true`), and sets navigation — each step shown and confirmable. Applying only a *theme* to an existing site changes appearance and touches nothing else.

### 10.4 Gallery & try-on UX

The admin's **Appearance** screen: a screenshot grid, filterable by category, "currently active" pinned first. Selecting a theme opens a full-screen **try-on**: the user's *own* homepage and latest post rendered client-side (§10.2) with the candidate theme, with device-width toggles (mobile/tablet/desktop) and a light/dark switch. Nothing is committed during try-on. **Apply** = one config commit → rebuild → status pill; **switching back is the same one click**, and content is never modified by a theme change — the UI says so.

### 10.5 Customizer (upgrade-safe by design)

A "Customize" panel beside the try-on exposes the theme's tokens as real controls: color pickers, 5–6 curated font pairings, spacing density, corner radius, default color scheme. Edits write to `theme.tokens` in `site.config.json`; the build injects them as a `:root` override **after** `theme.css`. The user never edits the theme folder, so §14 upgrades replace theme files wholesale while customizations survive untouched. Per-token reset + "reset all", and every change live in the try-on pane.

### 10.6 Starter registry (a marketplace with no backend)

Core repo ships **five launch starters**; the official `<name>-starters` repo hosts the rest. Its `registry.json` (static file) lists id, category, description, screenshot URL, engine compat. The admin's "Browse more" fetches it raw from GitHub; **Install** copies the starter folder into the user's repo via the GitHub contents API — same copy-a-folder story as plugins, zero servers. Community starters arrive by PR and must pass the §10.1 quality floor plus sample content in CI.

### 10.7 Starter catalog — 20 fields, each done properly

Launch five marked ★. Each line = audience → structure it ships → its signature.

1. ★ **Journal** — personal blog (the default). Pure reading experience; characterful display face over a humanist body, ~65ch measure. Signature: typography itself.
2. ★ **Toolbox** — trades & local services (plumber, electrician). Services + service-area pages, testimonials, before/after gallery. Signature: sticky call-now bar on mobile.
3. ★ **Studio** — portfolio (designer, photographer). Project collection with case-study template, full-bleed grid. Signature: images speak, chrome disappears.
4. ★ **Bistro** — restaurant/café. Menu collection with tabular-number price alignment, hours + map + reserve CTA above the fold. Signature: the menu as a designed object.
5. ★ **Manual** — documentation. Sidebar tree from collection structure, prominent search, prev/next. Signature: never lets you feel lost.
6. **Civic** — government/municipality. GOV.UK-inspired: system type, AAA contrast, service cards, document lists, crest slot. Signature: radical clarity — boring is the feature.
7. **Practice** — medical/dental clinic. Calm two-color palette, oversized legible type, services collection, appointment CTA. Signature: persistent hours/phone/emergency strip.
8. **Chambers** — law firm. Practice-area collection, attorney profiles, restrained serif authority, zero decoration. Signature: confidence through omission.
9. **Cause** — nonprofit/charity. Mission hero, programs collection, donate CTA, impact numbers from a data file. Signature: one human photograph, one number, one verb.
10. **Parish** — church/community org. Service-times block, events collection, sermon archive with audio embeds. Signature: the welcome, not the institution.
11. **Campus** — school/kindergarten. Announcements + term calendar first, staff directory, parent-first navigation. Signature: "what parents need this week" panel.
12. **Launch** — startup/SaaS. Product hero with real screenshot slot, feature sections, pricing from a data file, changelog collection. Signature: the changelog as proof of life.
13. **Terminal** — developer blog. Dark-first, best-in-class code blocks, TOC, keyboard navigation. Signature: code presented better than GitHub.
14. **Letters** — newsletter/essayist. Essay-first type, subscribe slot, archive with excerpts. Signature: the archive reads like a book's contents.
15. **Vows** — wedding/event. One-pager sections, countdown, RSVP via form plugin, schedule + travel. Signature: names set like an invitation.
16. **Keys** — real-estate agent. Listings collection (price/rooms/area fields), photo-card grid, inquiry CTA. Signature: the listing card.
17. **Form** — fitness/yoga studio. Class schedule from a data file, instructor collection, trial CTA. Signature: the timetable, legible at arm's length on a phone.
18. **Encore** — band/artist. Shows collection (date/venue/tickets), streaming embeds, press-kit page, dark stage aesthetic. Signature: the tour-dates list.
19. **Gazette** — local news/magazine. Multi-column front page, category sections, dateline typography. Signature: hierarchy that lets 12 stories breathe.
20. **Folio** — résumé/CV. Single hire-me page, experience collection, print-perfect PDF styles. Signature: prints beautifully on one sheet of A4.

---

## 11. Non-functional requirements

- **Performance:** build < 2s / 500 pages; published pages < 50KB HTML+CSS before images; zero render-blocking JS.
- **Security:** admin token never leaves the browser except to api.github.com; AI key never leaves the browser except to the chosen provider; escape all template output by default; sanitize is unnecessary for own-content Markdown but `marked` must not execute raw HTML from frontmatter fields.
- **Privacy:** no analytics, no cookies, no third-party requests in core.
- **Accessibility:** AA for both the published theme and the admin.
- **Tests (`node --test`):** frontmatter parser, template engine, slug/URL generation, config validation errors, and golden-file tests (fixture site in `tests/fixtures/` → build → compare `dist/` snapshots). CI runs tests before deploy.
- **Errors are teaching moments:** every build error names the file and the fix. Every admin error says what happened and what to do, in plain language.

---

## 12. Milestones (build in this order; each ends deployable)

**M1 — Engine + theme (the site works).** `build.js` + `lib/`, pages & posts collections, default theme, sample content (5 posts, 3 pages), sitemap/RSS/robots/404/redirects, `--watch` dev server, tests, GitHub Action deploying to Pages. *Done when:* fork → enable Pages → live site in < 5 min.

**M2 — Admin core (non-tech people can publish).** Sign-in (PAT), dashboard, schema-driven editor with preview + autosave, media upload, publish with build-status pill, history/restore, nav + settings editors, empty-state invitations, setup checklist, the three editor coach marks. *Done when:* a non-technical tester publishes a post with an image in under 2 minutes, unassisted.

**M3 — Plugin system.** Hook runner, manifest loading, client asset injection, `search` + `contact-form` plugins, hook API docs in `CLAUDE.md`. *Done when:* Claude Code, given only `CLAUDE.md`, writes a working "reading time" plugin in one prompt.

**M4 — AI layer.** Static JSON API + `llms.txt` in build; `ai.js` with Anthropic adapter and the five assist actions; `CLAUDE.md` finalized. *Done when:* the assist buttons work with a pasted key, and `api/posts/index.json` is consumable by a script.

**M5 — Starters, gallery & first-run wizard.** Isomorphic rendering verified in-browser (§10.2); Appearance screen with try-on and token customizer; `starter.json` support; the five ★ launch starters; the setup wizard; starter registry read from the starters repo. *Done when:* a first-time user goes from empty repo to a themed, named site with example content via the wizard in under 5 minutes — and switching themes shows their own homepage in the candidate theme before anything is committed.

**M6 — Open-source polish.** README with 5-minute quickstart + screenshots, CONTRIBUTING, template-repo setup ("Use this template" button), demo site, optional OAuth Worker (separate folder `workers/oauth/`, ~60 lines, deploy instructions), and the **upgrade system** (§14: `engine.json` manifest, `update.yml` workflow, admin update banner), plus the **Jekyll importer** (§15) as the launch switch-story. *Done when:* a stranger can go from README to their own live site without asking a question, a site on v1.0 upgrades to v1.1 by merging one auto-generated PR, and a real Jekyll blog converts with working redirects.

**M7 (optional/backlog):** i18n conventions, CI image variants, scheduled publishing (Action cron builds; items with future dates excluded until due), roles via CODEOWNERS + PR-based publish for teams, remaining §10.7 starters (community-driven), WordPress / VuePress / Joomla importers (§15).

**Out of scope, permanently (use plugins or other tools):** user accounts on the published site, comments backend, e-commerce, page-builder drag-and-drop, server-side rendering, databases.

---

## 13. Answers to foundational questions (rationale)

- **Is it a GitHub-Pages-like site?** Yes. Static output + Git-backed content is the architecture that maximizes all five goals at once (simple, maintainable, vanilla, hostable, AI-native). Cloudflare Pages is the recommended alternative host (faster builds, `_redirects` support); the output is host-agnostic per C6.
- **Does it need an API backend?** No owned backend. Reads: static JSON emitted at build. Writes: GitHub's API. Auth: PAT in v1, tiny stateless OAuth Worker in v2. Dynamic features are plugins pointing at third-party or user-owned endpoints.
- **Open source?** Yes, MIT. A CMS lives or dies by themes, plugins, and trust; all three require openness. The repo doubles as the distribution (template repo). If commercialized later: hosted onboarding, managed OAuth/AI proxy, or paid themes — never a closed core.

## 14. Upgrade system

**Principle: upgrades are pull requests, not merges — and definitely not magic.** A bare `git merge upstream/main` is not the mechanism: template repos share no history with upstream, and forks conflict the moment the user has customized config or a theme. Instead, make merging unnecessary by construction:

**14.1 Ownership contract.** Every path belongs to exactly one party. Engine-owned (upstream may change, user must never edit): `build.js`, `lib/`, `admin/`, `themes/default/`, `config.defaults.json`, `.github/workflows/build-deploy.yml`, `engine.json`. User-owned (upstream never touches): `content/`, `data/`, `media/`, `site.config.json`, `themes/<custom>/`, `plugins/<user's>/`. Customizing the default theme means copying it to `themes/custom/` first — the admin and docs enforce this norm.

**14.2 Engine manifest.** Each release ships `engine.json`: `{ "version": "1.4.2", "files": { "lib/content.js": "<sha256>", … } }`. Because engine files are never hand-edited, the updater **replaces them wholesale** — no three-way merge, so no conflicts are possible. Files whose hash doesn't match the installed manifest were modified by the user: the updater leaves them, lists them in the PR as "locally modified, needs manual/AI merge", and continues.

**14.3 Config never conflicts.** The engine reads `config.defaults.json` (engine-owned) deep-merged under the user's sparse `site.config.json`. New features arrive with working defaults without ever writing to the user's file.

**14.4 Migrations.** Breaking changes ship as idempotent scripts in `migrations/NNN-description.js` (plain Node, no deps). The updater runs every migration between the installed and target version — e.g. renaming a config key, moving a folder. `engine.json` records the last applied migration.

**14.5 Delivery: one button.** The admin shows an "Update available — v1.5" banner by fetching upstream's raw `engine.json` and comparing semver (a plain `fetch`, no server). Clicking it triggers `update.yml` via `workflow_dispatch`; the Action downloads the release tarball, applies 14.2–14.4, runs the test suite and a full build, and opens a PR with the changelog, migration notes, and any flagged files. Merge = upgraded; revert the PR = rollback. An optional weekly cron opens the PR automatically (Dependabot-style), so unattended sites still receive security fixes as reviewable PRs.

**14.6 Compatibility.** The engine follows semver; hook and template-variable changes are the public API. Plugins declare `"engine": ">=1 <2"` in `plugin.json`; the updater lists incompatible plugins in the PR body rather than failing.

**14.7 AI as merge tool of last resort.** When 14.2 flags locally modified engine files or a migration fails, the PR body contains exact resolution instructions addressed to Claude Code ("re-apply your change on top of the new `lib/template.js`; the function moved to…"). Optionally, a Claude GitHub Action attempts the reconciliation itself and marks uncertain hunks for human review. Routine upgrades need zero AI; AI handles only the long tail that would otherwise require a developer.

**14.8 Fork vs template.** Recommend "Use this template" over forking (private repos allowed, clean history, no accidental upstream PRs). The updater never relies on shared Git history, so both work identically.

---

## 15. Migration & importers

**Form factor: a local CLI, never a hosted requirement.** `tools/migrate/<source>.js`, run as `node tools/migrate/wordpress.js <export.xml | site-url>` on the user's machine or inside a GitHub Action. It writes `content/`, downloads files into `media/`, generates the old→new map in `data/redirects.json`, and opens a PR with a **migration report**: pages converted, media fetched, and a review queue of items it couldn't convert cleanly. Nothing requires a server we own — but an in-browser admin plugin is the wrong shape for the heavy sources: WordPress media fetching fails on CORS, Joomla needs database access, large sites need long-running crawls. `tools/` sits outside the core dependency budget (C2 governs core), so an HTML→Markdown library is acceptable here.

Per source:

- **Jekyll / Hugo / Eleventy** — already Markdown + frontmatter in Git: remap frontmatter keys, strip or convert Liquid/shortcodes, move assets, map permalinks. A pure file transform — the easy, high-volume win, and the launch switch-story.
- **VuePress / VitePress** — Markdown with embedded Vue components and JS config: convert what maps to plain HTML, flag components for the review queue.
- **WordPress** — input: WXR export (Tools → Export) or the REST API. Convert post/page HTML (including Gutenberg block markup) to Markdown, fetch `wp-content/uploads` media referenced in content, map categories/tags, preserve slugs or emit redirects. Comments export to a static JSON archive (a plugin can render "archived comments").
- **Joomla** — no standard export: read a database dump (`#__content` tables) or crawl the rendered site. Messiest path; expect the largest review queue.

**Two universal requirements.** (1) **Redirects are non-negotiable** — every importer emits a complete old→new URL map; silently changing URLs is how migrations destroy SEO. (2) **Honest scoping** — the report includes a dynamic-feature mapping table: forms → `contact-form` plugin, comments → archive/giscus, search → built-in, e-commerce/memberships → explicitly out of scope for a static CMS.

**AI for the long tail.** The converter is deterministic and should handle ~80% of real sites. The remaining 20% — unknown shortcodes, page-builder markup, inline widgets, malformed HTML — is exactly what makes migrations expensive, and it becomes agent work: the report lists each item as a ready-to-run task, `CLAUDE.md` gains a migration section, and a verification pass diffs the extracted text of old vs new pages so nothing silently disappears.

**Commercial boundary:** the CLI importers are free and open — they are the adoption engine. A hosted "paste your URL, get a PR" wizard, AI cleanup at scale, and done-for-you migration services are deliberately left outside core as commercial territory.

---

## 16. Instructions to Claude Code

Read this file fully before writing code. Work milestone by milestone; do not start M(n+1) until M(n)'s "done when" passes. Keep the line budgets (C3) — when tempted to add a library or abstraction, re-read §2. Write `CLAUDE.md` in M1 and keep it current as the API evolves. Prefer boring, explicit code over clever code: this codebase's target audience includes future AI agents and curious non-experts reading it to learn.
