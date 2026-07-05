# Contributing to plain

Thank you for helping. plain lives or dies by its themes, plugins, and trust — all three are open by design. This guide is short on purpose.

## Ground rules (the constraints *are* the product)

Read [`cms-spec.md` §2](cms-spec.md) before proposing anything structural. The non-negotiables:

- **Vanilla only.** No frameworks, no bundlers, no TypeScript compile step, no CSS preprocessors. Plain ES modules, plain CSS with custom properties, JSDoc for types.
- **One runtime dependency.** The core may depend on exactly `marked` and nothing else. No new dependencies — including dev dependencies (we use built-in `node:test`). Frontmatter, templating, RSS, search — all hand-rolled. Tools under `tools/` are exempt from this.
- **Under 2,500 lines.** The whole core (`build.js` + `lib/` + `admin/js/`, excluding themes, plugins, and content) stays under 2,500 lines, no single file over 400. If a feature can't fit, it's a plugin.
- **Works without JavaScript.** The published site must be fully readable and navigable with JS off. The admin is exempt.
- **Boring, explicit code.** The audience includes future AI agents and curious non-experts reading to learn. Prefer clarity over cleverness.

A PR that breaks a constraint won't be merged, however good the feature — that's the deal that keeps plain plain.

## Before you open a PR

```sh
npm install
node --test tests/     # must be green
node build.js          # must succeed
```

If you changed build output on purpose, run `node tests/update-goldens.js` and review the diff. Add a test for any new behavior — the golden-file test in `tests/build.test.js` is the safety net that lets an AI agent edit content without breaking the site.

## Good first contributions

- **Plugins** — a folder in `plugins/`. See the hook API in [`CLAUDE.md`](CLAUDE.md); "write a plugin that does X" is a one-prompt job. Wanted: analytics snippet, giscus comments, image gallery, table of contents.
- **Themes / starters** — a folder in `themes/`. Meet the quality floor in [`cms-spec.md` §10.1](cms-spec.md) (semantic HTML, WCAG AA, light+dark, print, no external requests, system fonts) and don't look like generic AI output. The remaining starters in §10.7 are community-driven.
- **Importers** — `tools/migrate/<source>.js`, plain Node. Every importer must emit a complete old→new redirect map. See `tools/migrate/jekyll.js` as the reference.

## How the pieces fit

[`CLAUDE.md`](CLAUDE.md) is the working reference: content model, template syntax, plugin hooks, the build pipeline, the admin, and the upgrade system. It's kept current as the API evolves — update it in the same PR when you change the API.

## Licensing

By contributing you agree your work is released under the [MIT License](LICENSE).
