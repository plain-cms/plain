---
title: Writing pages
order: "03"
description: How a Markdown file becomes a page — frontmatter, headings, links between pages, and drafts.
prev: /docs/installation/
prevTitle: Installation
next: /docs/images-and-files/
nextTitle: Images and files
example: true
---

A page is one Markdown file in `pages/`. The file name decides the address, the frontmatter decides the title, and everything below it is the page.

## A complete page

```markdown
---
title: Opening hours
description: When the workshop is open.
---

We are open **Tuesday to Saturday**, 9 to 5.

## Bank holidays

Closed, except by appointment.
```

Save it as `pages/hours.md` and it is served at `/hours/`. There is nothing to register and no list of pages to keep up to date.

## Frontmatter

The block between the two `---` lines holds the page's settings. Only `title` is required.

| Key           | Type    | What it does |
| ------------- | ------- | ------------ |
| `title`       | string  | The page heading and the browser tab title. |
| `description` | string  | One sentence for search engines and link previews. |
| `draft`       | boolean | `true` keeps the page out of `mkweb build`. |
| `order`       | number  | Position in the menu; lower comes first. |
| `menu`        | boolean | `false` leaves the page out of the menu. |

> **Note** — Do not repeat the title as a `#` heading in the body. mkweb prints the title for you, so the body starts at `##`.

## Linking between pages

Link to the address, not the file:

```markdown
See our [opening hours](/hours/) or [get in touch](/contact/).
```

`mkweb check --links` follows every internal link and reports the file and line of any that lead nowhere, so a renamed page cannot quietly break the site.

## Folders

Folders become path segments. An `index.md` inside a folder is the page for the folder itself:

```
pages/
├── index.md         →  /
├── hours.md         →  /hours/
└── services/
    ├── index.md     →  /services/
    └── repairs.md   →  /services/repairs/
```

## Drafts

Add `draft: true` to a page that is not ready. `mkweb dev` still shows it, with a badge, so you can read it in place; `mkweb build` leaves it out entirely. Remove the line to publish.
