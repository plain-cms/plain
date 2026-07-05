# plain

**A Git-native CMS for the AI age.** The repository is the database, static files are the API, and AI is the admin.

Your whole website is a folder of plain files: Markdown for content, JSON for settings. Git gives you versioning, collaboration, and hosting hooks for free. The build turns it into a fast static site — HTML pages plus a read-only JSON API — that deploys anywhere for $0/month.

- **No database, no server, nothing to patch.** All state lives in this repo.
- **Vanilla by design.** No frameworks, no bundlers. One dependency: [`marked`](https://github.com/markedjs/marked). The entire engine is a few small, readable files.
- **Works without JavaScript.** JS is progressive enhancement only.
- **AI-operable.** Deterministic layout, machine-readable content model, and a [`CLAUDE.md`](CLAUDE.md) so agents (or Claude Code) can edit content, add collections, and write plugins safely.

## Quickstart (5 minutes)

1. **Get a copy:** click **Use this template** (or fork) to create your own repo.
2. **Enable hosting:** in your repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. **Make it yours:** edit `site.config.json` — set your `title`, `description`, and `url` — and commit.
4. Push (or edit on github.com and commit). About 30 seconds later, your site is live.

Every later change is the same loop: edit → commit → live in ~30s. Nothing is ever lost; any version of any page can be restored from Git history.

## The admin — publish from your browser

Your live site includes an editor at **`/admin/`** — a clean writing screen with Save draft / Publish buttons, live preview, image uploads, and per-page History with one-click restore. No Git knowledge needed.

Sign in once with a GitHub access token (it stays on that device):

1. On GitHub: **Settings → Developer settings → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → pick your site's repo.
3. Permissions → Repository permissions: **Contents: Read and write**, **Actions: Read-only**.
4. Generate, copy, and paste it into the admin's sign-in screen.

The token never leaves the browser except to api.github.com. Editors who prefer files can keep editing files — the admin and direct edits coexist happily.

## The API — your content as JSON

Every build also publishes a read-only JSON API: `/api/site.json`, `/api/posts/index.json`, `/api/posts/<slug>.json` — plain static files any script, app, or AI agent can consume. No keys, no rate limits, cached by the CDN.

## Writing content

A post is a Markdown file in `content/posts/`. The filename is the URL: `hello-world.md` → `/blog/hello-world/`.

```markdown
---
title: Hello world
date: 2026-07-05
description: One sentence for search engines and link previews.
tags:
  - launch
draft: false
---

Body in **Markdown**. Images by path: ![A lake](/media/lake.jpg)
```

Set `draft: true` and the post is saved but not published. Pages work the same in `content/pages/` (`about.md` → `/about/`; `index.md` is the homepage). Menus live in `data/navigation.json`; renamed URLs get an entry in `data/redirects.json`.

## Plugins

A plugin is a folder — install one by copying it into `plugins/` and adding its name to `"plugins"` in `site.config.json`. Ships with **search** (enabled: a `/search/` page over a prebuilt index, no services involved) and **contact-form** (disabled reference: write `[[contact-form]]` in any page, point it at a Formspree-style endpoint). The full hook API is documented in [`CLAUDE.md`](CLAUDE.md) — it's small enough that "write me a plugin that adds reading time" is a one-prompt job for an AI agent. Also included: **reading-time** (enabled) — written by an AI agent from the docs alone, in one prompt, as proof of that claim. Good first plugins: analytics snippet, giscus comments, image gallery, table of contents.

## Local development

```sh
npm install
node build.js            # build into dist/
node build.js --watch    # serve on http://localhost:4000, rebuild on change
node --test tests/       # run the test suite
```

## Layout

```
site.config.json   all configuration: site info, collections, plugins
content/           your words (Markdown, one file per page/post)
data/              navigation, redirects (JSON)
media/             images and files
themes/default/    templates + theme.css (design tokens at the top)
plugins/           a plugin is a folder; install = copy + enable in config
build.js + lib/    the whole engine (~1,000 lines, MIT)
```

The full product specification lives in [`cms-spec.md`](cms-spec.md); instructions for AI agents in [`CLAUDE.md`](CLAUDE.md).

## License

[MIT](LICENSE).
