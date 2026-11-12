---
title: Deploying
order: "07"
description: Put the built site online — any static host, a plain web server, or an automatic deploy on every push.
prev: /docs/commands/
prevTitle: Commands
next: /docs/troubleshooting/
nextTitle: Troubleshooting
example: true
---

A built mkweb site is a folder of files. Any service that can serve a folder can host it, and moving between hosts means uploading the same folder somewhere else.

## Before you deploy

1. Set `url` in `mkweb.json` to the address the site will live at. Canonical links and the sitemap depend on it.
2. Run the checks and build:

   ```sh
   mkweb check --links && mkweb build
   ```

3. Open `public/index.html` in a browser. What you see is exactly what will be served.

## Static hosts

Every static host asks the same two questions. The answers are always:

| Setting          | Value         |
| ---------------- | ------------- |
| Build command    | `mkweb build` |
| Output directory | `public`      |

If the host does not have mkweb installed, add the install script in front of the build command:

```sh
curl -fsSL https://get.mkweb.example/install.sh | sh && mkweb build
```

## Your own server

Copy the folder. `rsync` sends only what changed and removes files that no longer exist:

```sh
mkweb build
rsync -az --delete public/ deploy@example.org:/var/www/site/
```

> **Warning** — `--delete` removes anything on the server that is not in `public/`. Point it at a directory that holds nothing but the site.

## Deploy on every push

In CI, the whole pipeline is three steps: install, check, build. Fail the job on the first error and a broken page never reaches the live site:

```sh
curl -fsSL https://get.mkweb.example/install.sh | sh
mkweb check --links
mkweb build
```

Hand `public/` to your host's upload step. Because builds are byte-for-byte repeatable, most hosts will upload only the files that changed.

## Check it worked

Visit the live address and one inner page. If pages load but look unstyled, `url` is wrong or missing — see [Troubleshooting](/docs/troubleshooting/).
