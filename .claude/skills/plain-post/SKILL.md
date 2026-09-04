---
name: plain-post
description: Write, edit, publish, or unpublish a post or page on this plain site — create the Markdown file with valid frontmatter, verify it builds, and push it live. Use whenever the user says write/draft/publish/schedule a post, add an article, fix a typo on a page, take a page down, or translate a post.
---

# Writing and publishing on a plain site

This repo **is** the website. Content is Markdown files, the build turns them into
a static site, and pushing to the default branch publishes. There is no database
and no API to call — you edit files.

The whole loop:

```
write content/<collection>/<slug>.md  →  node --test tests/ && node build.js  →  git commit && git push  →  live in ~30s
```

## 1. Read the schema before writing a word

Frontmatter is validated against the collection's field list in
`site.config.json`. Never guess the fields — print them:

```sh
node -e 'const c=JSON.parse(require("fs").readFileSync("site.config.json","utf8")).collections||{};for(const [n,d] of Object.entries(c))console.log(`${n}  ${d.path}  →  ${d.urlPattern||"(no pages: render:false)"}\n  `+(d.fields||[]).map(f=>f.name+": "+f.type+(f.required?"  REQUIRED":"")).join("\n  ")+"\n")'
```

Every required field must be present or **the build fails** (which is the point —
broken content never half-deploys). Optional fields are worth filling in anyway:
`description` becomes the meta description and the link preview.

## 2. Pick the slug carefully

**Filename = slug = URL, forever.** `content/posts/hello-world.md` → `/blog/hello-world/`.

- Lowercase letters, digits, hyphens. No spaces, no uppercase, no underscores.
- `index.md` maps to the collection's URL root (`/` for pages).
- Changing a filename changes a live URL. If you rename an existing file, add the
  old URL to `data/redirects.json`: `{ "/old-url/": "/new-url/" }`. This is not
  optional — silently changing URLs destroys search rankings and breaks links.

## 3. Write the file

```markdown
---
title: The post title
date: 2026-09-03
description: One sentence for search engines and link previews.
tags:
  - launch
draft: false
---

Body in **Markdown**. Images by path: ![A lake](/media/2026/09/lake.jpg)
```

The frontmatter parser is a deliberate hand-rolled subset. **Only these forms are legal:**

- `key: value` — a plain scalar. `true`/`false` become booleans, `42` a number.
- `key: "value"` — quotes force a string.
- `key: 2026-09-03` — ISO dates only, validated by the field type.
- A list is `key:` on its own line, then indented `- item` lines.

No nesting, no multiline strings, no YAML anchors, no `|` or `>` blocks. Unknown
extra keys are allowed (`example: true` marks the shipped sample content — safe
to delete). Use today's real date; don't invent one.

Body conventions:

- The `title` field renders as the page heading — **don't repeat it as an `#` H1**
  in the body. Start at `##`.
- Link internally with root-relative URLs (`/about/`, `/blog/other-post/`), never
  with a full domain and never with a `.md` path.
- Images live under `media/` and are referenced as `/media/...` — see `plain-site`.

Starting points: if the theme ships `themes/<theme>/content-templates/*.md`,
those are pre-structured skeletons (announcement, how-to, story, update, landing)
worth copying from.

## 4. Verify — always, before committing

```sh
node --test tests/ && node build.js
```

Both must be green. A content mistake stops the build with `file:line — problem —
fix`; read it literally, it names the fix. A red test or a failed build must never
be committed.

Optional local preview: `npm run dev` serves the site on :4000 (admin at `/admin/`).

## 5. Publish

```sh
git add content/posts/<slug>.md
git commit -m 'post: publish "The post title"'
git push
```

Match the admin's commit-message vocabulary so the history reads consistently:
`post: publish "Title"`, `post: edit "Title"`, `page: edit "About"`,
`media: add lake.jpg`. Never use Git jargon in anything user-facing.

The push triggers the workflow in `.github/workflows/` — the site is live in about
30 seconds. Check it with `gh run watch` if the user wants confirmation. Never
commit `dist/`; it is generated and gitignored.

## Common jobs

**Draft it, don't publish it.** Set `draft: true`. The item is excluded from the
build *entirely* — no page, no sitemap entry, no RSS, no JSON API. Flip to
`false` and push to publish it.

**Take a published page down.** Set `draft: true` — but the URL then 404s, so if
it had traffic, add a `data/redirects.json` entry pointing at the closest
replacement instead.

**Edit an existing post.** Find it by URL: the slug is the filename. Edit in
place, keep the same slug, verify, commit as `post: edit "Title"`.

**Change the layout of one page.** Any item's frontmatter may set `template:` to
override its collection's template (e.g. `template: landing` turns a page into a
sales page with a hero and CTA). The theme must ship that template; check
`themes/<theme>/templates/` and the `layouts` list in `theme.json`.

**Translate a post.** Only if `site.languages` has 2+ codes. Translations are
sibling files: `about.fr.md` next to `about.md` → `/fr/about/`. A translation
without an original is a build error, and drafting the original drafts every
translation with it.

## Gotchas that will bite you

- `node --test tests/` and `node build.js` are both required before a commit —
  the golden-file test compares built output byte for byte.
- Don't hand-edit engine files (`build.js`, `lib/`, `admin/`, `themes/default/`)
  to make a post work — that breaks upgrades. Content problems are content-shaped.
- An unknown frontmatter key is *allowed* — it rides into templates and the JSON
  API — but it is unvalidated and the admin shows no editor for it. To make a new
  field real, add it to the collection's `fields` in `site.config.json`. See the
  `plain-extend` skill.
- The published site must work with JavaScript disabled — never write a post whose
  content depends on client JS.
