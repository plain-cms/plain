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

**AI assist (optional, BYOK):** paste an Anthropic API key in Settings and the editor grows ✨ buttons — improve writing, suggest titles, generate the meta description, write image alt text, translate a page into a new draft. Every suggestion shows a before/after and asks before applying. The key stays in your browser and is sent only to Anthropic.

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

## Themes & starters

First sign in and the admin greets you with a five-step wizard: pick what you're building, name it, see it (a live preview already wearing your name), write your first words, and go live. Under the hood it applies a **starter** — a theme plus the right content types, menu, and example content.

Fifteen starters ship in the box: **Journal** (blog), **Toolbox** (trades & local services), **Studio** (portfolio), **Bistro** (restaurant), **Manual** (documentation), **Terminal** (developer blog), **Letters** (newsletter & essays), **Launch** (startup/SaaS), **Gazette** (local news & magazine), **Folio** (résumé/CV), **Keys** (real estate), **Cause** (nonprofit), **Practice** (clinic), **Form** (fitness studio), and **Encore** (band & artist). The Appearance screen lets you try any of them on *your own pages* — with device widths and a light/dark toggle — before committing, and a customizer exposes each theme's colors and fonts as live controls. Your tweaks survive theme updates.

## Plugins

A plugin is a folder — install one by copying it into `plugins/` and adding its name to `"plugins"` in `site.config.json`. Ships with **search** (enabled: a `/search/` page over a prebuilt index, no services involved) and **contact-form** (disabled reference: write `[[contact-form]]` in any page, point it at a Formspree-style endpoint). The full hook API is documented in [`CLAUDE.md`](CLAUDE.md) — it's small enough that "write me a plugin that adds reading time" is a one-prompt job for an AI agent. Also included: **reading-time** (enabled) — written by an AI agent from the docs alone, in one prompt, as proof of that claim. Good first plugins: analytics snippet, giscus comments, image gallery, table of contents.

## Moving an existing blog in

Already have a site? The importers under `tools/migrate/` convert it — content, media, and a complete old→new redirect map so your URLs (and your SEO) survive the move. Run one on your machine:

```sh
node tools/migrate/jekyll.js /path/to/your-jekyll-site
node tools/migrate/joomla.js https://your-joomla-site.example   # crawls the live site
```

Each writes `content/`, `media/`, and `data/redirects.json` (Joomla also `data/navigation.json`) into `./plain-import/` — never touching your working tree — plus a migration report of anything that needs a human eye, from unconvertible markup to old query-string URLs that need a redirect rule at your host. Copy those folders into your plain repo, work the report's review queue, and build. Jekyll and Joomla ship today; Hugo, Eleventy, and WordPress are on the roadmap (§15).

## Staying up to date

plain follows [semver](https://semver.org). Engine files (`build.js`, `lib/`, `admin/`, `themes/default/`) are upstream-owned; your content, config, and custom themes are yours. When a new version ships, the admin shows an **Update available** banner: click it and a pull request appears with the changelog and any files you'd customized flagged for review. **Merge to upgrade, revert to roll back** — never a surprise. An optional weekly workflow opens that PR on its own, so even an unattended site keeps getting security fixes as reviewable PRs. See §14 for the mechanism.

## Local development

```sh
npm install
node build.js            # build into dist/
node build.js --watch    # serve on http://localhost:4000, rebuild on change
node --test tests/       # run the test suite
node tools/engine-manifest.js   # regenerate engine.json before a release
```

## Layout

```
site.config.json   all configuration: site info, collections, plugins
config.defaults.json  engine-owned defaults, merged under your config
content/           your words (Markdown, one file per page/post)
data/              navigation, redirects (JSON)
media/             images and files
themes/            fifteen starters ship in the box; add your own
plugins/           a plugin is a folder; install = copy + enable in config
admin/             the browser editor (static, vanilla ES modules)
tools/migrate/     importers (Jekyll and Joomla today)
workers/oauth/     optional "Sign in with GitHub" worker (v1 uses a token)
build.js + lib/    the whole engine — under 2,500 lines, one dependency, MIT
```

The full product specification lives in [`cms-spec.md`](cms-spec.md); instructions for AI agents (and how to add collections, plugins, themes) in [`CLAUDE.md`](CLAUDE.md). To contribute, read [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE) — open source from day one. Themes, plugins, and importers are the adoption engine; the core will never be closed.
