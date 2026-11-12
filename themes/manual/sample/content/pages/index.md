---
title: The mkweb manual
description: mkweb is a single-binary command-line tool that turns a folder of Markdown into a fast, boring, reliable website.
example: true
---

You write files; mkweb writes HTML. One binary, no runtime, no plugins to babysit.

```sh
mkweb new my-site && cd my-site
mkweb dev     # live preview
mkweb build   # writes ./public
```

## How to read this manual

The sections are numbered and short. Read them in order the first time and you will have a site online before the coffee is cold; after that, the contents list on every page takes you straight to the part you need.

| If you want to…                 | Read |
| ------------------------------- | ---- |
| Build a first site in minutes   | [Getting started](/docs/getting-started/) |
| Add pages, pictures, downloads  | [Writing pages](/docs/writing-pages/), then [Images and files](/docs/images-and-files/) |
| Look up an option or a flag     | [Configuration](/docs/configuration/) and [Commands](/docs/commands/) |
| Put the site online             | [Deploying](/docs/deploying/) |
| Understand an error message     | [Troubleshooting](/docs/troubleshooting/) |

## Why people keep it around

- **Nothing to install but itself.** A single static binary for every major platform.
- **Nothing to configure to start.** Sensible defaults; one small `mkweb.json` when you outgrow them.
- **Nothing surprising in the output.** Plain HTML and CSS you can read, host anywhere, and diff.

> **Note** — This manual covers mkweb 2.4. Run `mkweb version` to see what you have, and `mkweb upgrade` to catch up.
