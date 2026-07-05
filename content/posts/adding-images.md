---
title: Adding images
date: 2026-06-10
description: Where images live, how to include them, and why alt text is worth ten seconds of your time.
cover: /media/sample/cover.svg
tags:
  - example
  - media
example: true
---

Images live in the `media/` folder and are referenced by their path, like this:

![Abstract paper boats on a calm gradient sea](/media/sample/cover.svg)

The line above is just `![a description](/media/sample/cover.svg)`. The description in the square brackets is the **alt text** — what screen readers speak and what appears if the image fails to load. Ten seconds writing it makes your site usable by more people; please don't skip it.

Two practical tips:

- Keep files under about 1 MB where you can. Photos resized to ~2000px wide look sharp everywhere and load fast.
- A post can also set a `cover` image in its frontmatter (this post does) — themes show it above the text and in link previews.
