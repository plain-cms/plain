---
name: plain-site
description: Manage this plain site's setup rather than its writing — images and media, the navigation menu, footer, site settings (title, URL, favicon, social image), redirects, switching or restyling the theme, turning plugins on and off, adding a language, and checking a deploy. Use for "add this image", "change the menu", "rename the site", "make it look different", "the site didn't update".
---

# Running a plain site

Everything about this site is a file in this repo. There is no dashboard to log
into and no settings database — you edit JSON and Markdown, then push.

| What you want to change | The file |
| --- | --- |
| Title, URL, description, theme, branding | `site.config.json` → `site` |
| The menu | `data/navigation.json` |
| The footer | `data/footer.json` |
| Old URLs that must keep working | `data/redirects.json` |
| Collections and their fields | `site.config.json` → `collections` (see `plain-extend`) |
| Which plugins run | `site.config.json` → `plugins` |
| Images and files | `media/` |
| The writing itself | `content/` (see `plain-post`) |

After **any** change here: `node --test tests/ && node build.js`, then commit and push.

## Images and media

Anything under `media/` is copied to the site as `/media/...`. Put new files in a
dated folder to match what the admin's uploader does:

```sh
mkdir -p media/2026/09 && cp ~/Downloads/lake.jpg media/2026/09/lake.jpg
```

Then reference it with a root-relative path — in Markdown
`![A lake on a still morning](/media/2026/09/lake.jpg)`, or in a frontmatter
`image` field like `cover: /media/2026/09/lake.jpg`.

- **Filenames**: lowercase, hyphens, no spaces.
- **Size**: keep images under ~1 MB; the admin refuses anything over 5 MB. Resize
  before committing — Git keeps every version of a binary forever.
- **Alt text is required work, not a nicety.** Describe the image; don't write
  "image of".
- Commit as `media: add lake.jpg`.

## The menu

`data/navigation.json` is a list of `{label, url}`, in display order:

```json
[{ "label": "Home", "url": "/" }, { "label": "Blog", "url": "/blog/" }]
```

URLs are root-relative and end with a slash. The theme marks the active entry
automatically. Commit as `navigation: update menu`.

## Site settings

The `site` block of `site.config.json`:

- `title`, `description`, `language` — identity and the default language.
- `url` — the full public base (`https://example.com`), used to absolutize feeds,
  the sitemap, and social tags. Wrong `url` = broken RSS and previews.
- `theme` — the folder name under `themes/`.
- `basePath` — only for a site served under a subpath (a GitHub *project* page at
  `/<repo>/`). Empty for a custom domain or a user page.
- `favicon`, `appleTouchIcon`, `socialImage` — root-relative paths under `/media/`.
  `socialImage` is the site-wide link preview for pages with no `cover`.
- `oauthUrl` — set only if the OAuth Worker in `workers/oauth/` is deployed; it
  turns the admin's sign-in into a "Sign in with GitHub" button.

Commit as `settings: update site settings`.

## Redirects

`data/redirects.json` maps old URL → new URL:

```json
{ "/old-url/": "/new-url/" }
```

The build emits both a `_redirects` file and meta-refresh fallback pages. **Every
time a file is renamed or removed, an entry belongs here.** This is the one rule
whose violation is invisible locally and expensive in production.

## Look and feel

**Switching theme:** set `site.theme` to another folder in `themes/` — `default`
(journal), `terminal`, `studio`, `bistro`, `manual`, `letters`, `launch`,
`gazette`, `folio`, `keys`, `cause`, `practice`, `form`, `encore`, `toolbox`.
A theme only renders the templates it ships, so after switching, build and check
for warnings about templates a collection names but the theme lacks.

**Restyling without forking:** put CSS custom properties in the **top-level**
`theme` key of `site.config.json` — note this is a different key from
`site.theme`, which is just the theme's name:

```json
"theme": { "tokens": { "--color-accent": "#c0ffee", "--measure": "70ch" } }
```

The build injects these *after* the theme's CSS, so upgrades replace theme files
wholesale and these survive. This is the correct way to recolor a site.

**Deeper changes:** never hand-edit `themes/default/` — it is engine-owned and an
upgrade will overwrite it. Copy it to `themes/custom/`, point `site.theme` at
`custom`, and edit there. All design decisions live in the `:root` block at the
top of `theme.css`; change tokens, not selectors.

## Plugins

`"plugins": ["search", "reading-time"]` in `site.config.json` — the array is the
on/off switch, in load order. Per-plugin settings go in
`"pluginOptions": { "<name>": { … } }`. Installing one by hand is: copy the folder
into `plugins/` and add its name to the array. Client JS must be progressive
enhancement — the site has to work with JavaScript off.

## Adding a language

i18n activates only when `site.languages` lists 2+ codes **and** includes
`site.language`, e.g. `"languages": ["en", "fr"]`. Then translations are sibling
files (`about.fr.md` → `/fr/about/`), menu labels come from
`data/navigation.fr.json`, and UI strings from `data/strings.fr.json`. With one
language the build is byte-identical to a site with no i18n at all.

## Publishing and checking a deploy

```sh
node --test tests/ && node build.js
git add -A && git commit -m 'settings: update site settings' && git push
```

The workflow in `.github/workflows/` builds and deploys on push; the site is live
in about 30 seconds. If it didn't update:

```sh
gh run list -L 3      # did the run start, and did it pass?
gh run watch          # follow the current one
```

A failed run is almost always a content or config error that `node build.js`
would have caught locally — run it and read the message, which names the file,
the line, the problem, and the fix.
