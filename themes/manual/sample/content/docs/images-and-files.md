---
title: Images and files
order: "04"
description: Where pictures, downloads and the favicon live, and how to link to them from a page.
prev: /docs/writing-pages/
prevTitle: Writing pages
next: /docs/configuration/
nextTitle: Configuration
example: true
---

Anything that is not a page goes in `static/`. mkweb copies the folder to the output exactly as it finds it — same names, same structure, nothing resized or renamed.

## Adding an image

Put the file in `static/`, then point at it from the page with a path that starts at the site root:

```markdown
![The workshop front door](/img/front-door.jpg)
```

```
static/
└── img/
    └── front-door.jpg   →  /img/front-door.jpg
```

The text in square brackets is read aloud by screen readers and shown if the image fails to load. Describe what the picture shows; leave it empty only for decoration.

> **Tip** — Resize photos before you add them. 1600 pixels wide is plenty for a full-width picture, and a page of ten untouched phone photos can weigh more than the rest of the site.

## Downloads

A PDF or spreadsheet works the same way. Link to it like any other address:

```markdown
Download the [price list (PDF, 120 KB)](/files/prices-2026.pdf).
```

Say what the file is and how big it is in the link text. Nobody likes a surprise download.

## Files with a special job

A few names are picked up automatically when they sit at the top of `static/`:

| File            | What it does |
| --------------- | ------------ |
| `favicon.svg`   | The icon in the browser tab. A `favicon.ico` is used as a fallback. |
| `robots.txt`    | Replaces the one mkweb would otherwise write. |
| `style.css`     | Loaded after the built-in stylesheet, so your rules win. |
| `_headers`      | Passed through for hosts that read it. |

## What not to put here

- **Pages.** A Markdown file in `static/` is copied as a text file, not turned into a page.
- **Anything private.** Everything in `static/` is public the moment you deploy.
- **The build output.** `public/` is written by mkweb; files you add there are deleted by the next build.
