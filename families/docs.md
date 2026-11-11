# Manual and handbook — family contract

For an organisation that needs one numbered handbook online: a product or user manual, a staff handbook, a club rulebook, a house guide for guests, a help centre. The reader either works through the sections in order or jumps straight to the one they need, so every section has a number, a one-line summary and a way to the sections before and after it.

```json
{
  "family": "docs",
  "title": "Manual and handbook",
  "collections": {
    "docs": {
      "path": "content/docs",
      "urlPattern": "/docs/:slug/",
      "template": "doc",
      "listUrl": "/docs/",
      "listTemplate": "list",
      "label": "Documentation",
      "sortBy": "order",
      "sortOrder": "asc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "order", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "prev", "type": "text" },
        { "name": "next", "type": "text" },
        { "name": "prevTitle", "type": "text" },
        { "name": "nextTitle", "type": "text" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Docs", "url": "/docs/" },
    { "label": "Search", "url": "/search/" }
  ],
  "plugins": [],
  "data": {},
  "templates": ["doc"],
  "layouts": [],
  "contentTemplates": ["doc.md"],
  "contentClasses": []
}
```

The contract is `themes/manual`'s, verbatim, with no change. Themes: `manual` (shipped); none planned.

There is no data file, no image field, no date field, no select field and no content class in this family. Everything is the `docs` collection plus a home page.

## Collection `docs`

One item is one section of the manual: one topic a reader would look up ("Opening the shop", "Installation", "Rule 4: Subscriptions"). One file per section in `content/docs/`. The file name is the slug and the URL: `opening-the-shop.md` → `/docs/opening-the-shop/`.

| Field | Required | Format | Meaning | Example |
| --- | --- | --- | --- | --- |
| `title` | yes | text, one line | The section's name. Printed as the page heading, in the contents and on the neighbours' previous and next links. No number in it — the number comes from `order`. | `Opening the shop` |
| `order` | no, but always write it | text in double quotes: two digits, zero-padded | The section's place in the manual and the number printed beside its title. | `"03"` |
| `description` | no, but always write it | text, one sentence, about 60–160 characters | What the section covers. Printed under the title on the section's page and under it in the contents, and used as the search and link-preview text. A missing one is a build warning. | `Keys, alarm, till float and the checks to make before the door is unlocked.` |
| `prev` | no | the URL of another section: `/docs/<slug>/`, with both slashes | The section before this one. Leave the line out on the first section. | `/docs/who-does-what/` |
| `prevTitle` | no | text, one line | The `title` of the section `prev` points to, copied exactly. Write it whenever `prev` is set. | `Who does what` |
| `next` | no | `/docs/<slug>/` | The section after this one. Leave the line out on the last section. | `/docs/closing-up/` |
| `nextTitle` | no | text, one line | The `title` of the section `next` points to, copied exactly. Write it whenever `next` is set. | `Closing up` |
| `draft` | no | `true` or `false` (default `false`) | `true` takes the section off the site without deleting the file. | `false` |

The body (Markdown under the frontmatter) is the section itself. The theme prints `title` as the page's main heading and `description` under it, so start the body with a sentence, not a heading, and use `##` for the parts of the section.

### Order

Sections are sorted by `order`, ascending. Quoted values are compared **as text, character by character** — not as numbers. For the author this means:

- Number the sections `"01"`, `"02"`, `"03"` … in reading order, always two digits, always in double quotes. Unquoted, `02` is read as the number 2 and prints as "2" instead of "02". Without the leading zero, text order puts `"10"` before `"2"`.
- With more than 99 sections use three digits on every one.
- To add a section between `"09"` and `"10"` without renumbering the rest, give it `"09.5"`.
- Give every section an `order`. One without it has no number and no fixed place, and it can pull the numbered sections around it out of order too.

### Previous and next

The build does not work out a section's neighbours and does not check these four fields: a wrong `prev` or `next` is a dead link with no warning. Whenever a section is added, removed, renamed or moved, correct `prev`/`prevTitle` and `next`/`nextTitle` on the sections either side of it. Fill the chain on every section; where `prev` or `next` is left out the theme links to the contents instead.

### URLs

- `/docs/` — the contents: every section in order, ten to a page (then `/docs/page/2/`). Its heading is the collection label, "Documentation". A site in another language may change `"label"` in its own `site.config.json`; nothing else in the collection may be edited.
- `/docs/<slug>/` — one page per section.

## Data files

None. `data/navigation.json` is created from the navigation preset; `data/footer.json` and `data/strings.<lang>.json` belong to the site, not to this contract.

## Pages

Files in `content/pages/`, each with `title` and `description`. The theme prints both at the top of the page, so do not repeat them in the body.

- **`index.md`** (`/`, "Home") — the cover of the manual. `title` says what the manual is ("Staff handbook", "The Harbour Cottage guide"), not the organisation's name (the site title already shows it). Body: one or two sentences on who it is for; a short "where to start" list or table that links the sections people need first (`[Opening the shop](/docs/opening-the-shop/)`) and the full contents (`/docs/`); the edition or the date it was last revised, if the customer gave one; and, last, who to ask when the manual has no answer — a phone number as a `tel:` link and an e-mail address as a `mailto:` link.
- **`/docs/`** ("Docs") — built from the collection. Write nothing for it.
- **`/search/`** ("Search") — built by the `search` plugin, which the engine turns on by default. Write nothing for it, and never create `content/pages/search.md`. If the site's own `site.config.json` has a `"plugins"` list, `"search"` must stay in it.
- **Posts** (`content/posts/`, `/blog/`) exist on every site but the navigation does not link them. Write one only when the customer gives dated news (a new edition, a changed rule), and link it from the home page.

Other pages (legal notice, about) are ordinary pages. The navigation preset does not list them, so link them from the home page.

### Content classes

None. Page and section text is plain Markdown; no theme in this family styles a class written in content. Three conventions every theme honours:

- **A note** is a blockquote that opens with a bold label in the site's language, then a dash: `> **Note** — A copy on the same disk is not a backup.` Use `Note`, `Tip` or `Warning` (or their translations), one paragraph, at most two or three a section.
- **Steps** are an ordered list; a command or a sample of text goes in a fenced code block (```` ``` ````), a single setting, file name or display message in backticks.
- **A key or button** is `<kbd>OK</kbd>` — the only raw HTML this family needs.

## Examples

`content/docs/opening-the-shop.md`:

```markdown
---
title: Opening the shop
order: "03"
description: Keys, alarm, till float and the checks to make before the door is unlocked.
prev: /docs/who-does-what/
prevTitle: Who does what
next: /docs/closing-up/
nextTitle: Closing up
---

Whoever is on the early shift opens up. Allow twenty minutes before the door is unlocked at 8:30.

## Before you unlock

1. Switch off the alarm: the panel is inside the back door, on the left.
2. Count the till float. It should be £80:

   | Coins and notes | Amount |
   | --- | --- |
   | £5 notes | £40 |
   | £1 coins | £30 |
   | Silver | £10 |

3. Turn on the coffee machine. It needs fifteen minutes to heat.

> **Note** — If the float is short, write the amount in the day book before the first sale.

## If something is wrong

Call Dana on [07700 900123](tel:+447700900123). Do not open until someone has answered.
```

`content/pages/index.md`:

```markdown
---
title: Staff handbook
description: How we open, serve, close and look after each other at the Corner Bakery — for everyone who works a shift.
---

Read sections 01 to 04 before your first shift. The rest is there for when you need it.

## Where to start

| If you want to… | Read |
| --- | --- |
| Know who to ask | [Who does what](/docs/who-does-what/) |
| Open or close on your own | [Opening the shop](/docs/opening-the-shop/), then [Closing up](/docs/closing-up/) |
| See everything | [The contents](/docs/) |

> **Note** — This is the March 2026 edition. It replaces the printed folder in the office.

## If the handbook has no answer

Call Dana on [07700 900123](tel:+447700900123) or write to [dana@cornerbakery.example](mailto:dana@cornerbakery.example).
```

## Rules for the author

- **Frontmatter is flat.** `key: value` lines only — no nesting, no multi-line values, no lists in this family. Quote every `order`, and any value that is only a number or the word `true` or `false`.
- **File names** are lowercase a–z, digits and hyphens (`stoerungscodes.md`, not `Störungscodes.md`). Renaming a file changes its URL — and breaks the `prev` and `next` of its neighbours until they are corrected.
- **One topic a section**, short enough to read in a few minutes. A manual is usually five to twenty sections; one long page is the wrong shape for this family.
- **Dates**, where a post needs one, are `YYYY-MM-DD`. Sections have no date field: write an edition or "last revised" line on the home page.
- **No images are needed.** The family has no image field; a manual is complete with none. Add a Markdown image only if the customer supplied the picture, and never let a step depend on it.
- **Contact is links, never a form.** Phone: `[07700 900123](tel:+447700900123)` — the visible number as the customer writes it, the `tel:` target with `+`, country code and digits only. E-mail: `[dana@cornerbakery.example](mailto:dana@cornerbakery.example)`.
- **Every page, post and section has a `description`.**
- **Write only what the customer told you.** No invented steps, numbers, prices or rules; a gap in the manual is better than a guess.
- **Link sections by their URL** (`/docs/closing-up/`), never by number: numbers change when a section is added.
- **Interface words** ("Contents", "Previous", "Next", "Search the manual") belong to the theme. Do not repeat them in content.

## Rules for the theme builder

Ship `starter.json` with the `collections` and `navigation` above, key for key, and no `plugins`; templates `base`, `page`, `post`, `list`, `404` and `doc`; `content-templates/doc.md`; no `layouts` in `theme.json`; no file in `sample/data/` other than `navigation.json`. Partials are the theme's own business.

What every theme renders, with JavaScript off:

- **On every page (`base`):** the site title, the menu, `data.footer.html` when set, and a way to the contents — either every section from `collections.docs` (its `order` when set, its `title`, linked to its `url`) or a link to `/docs/`. Templates cannot compare, so marking the section being read in such a list is progressive enhancement only; without it the page itself must still say where the reader is.
- **`doc`:** `title` as the heading; `order` when set; `description` when set; the body; a link to `prev` labelled with `prevTitle`, and one to `next` labelled with `nextTitle`, each falling back to a word from `strings` when the title is blank; and a link to `/docs/` whenever `prev` or `next` is blank, so no section is a dead end.
- **`list`:** for each item its `order` when set, its `title` linked to `item.url`, its `description` when set and its date when it has one — the same template lists posts and tag pages if the site keeps a blog. An empty-list message from `strings`. When `pagination.multiple`, the position ("page 2 of 2") and both links, worded for pages, not for time: sections are not dated, so "newer" and "older" are wrong here.
- **`page`:** `title`, `description` as a standfirst, the body. The search plugin's `/search/` page renders through this template.
- **`404`:** links to `/` and `/docs/`.
- **In body text:** `h2` to `h4`; ordered, unordered and nested lists; tables; fenced code and inline code; `<kbd>`; a blockquote, with its leading bold label set apart when it has one; a rule; `tel:` and `mailto:` links.

A theme may link `/search/` in its own chrome. It must not depend on any frontmatter key that is not in this file, and must not hard-code a section's slug.

What every theme tolerates, with no sideways scroll at 320px and no lost text:

- `order` blank on one section or on all of them: no number, and no stray "§" or punctuation beside the title. A neutral placeholder that holds the number column in a list is allowed if it is hidden from screen readers (`aria-hidden="true"`);
- `order` of two digits, or of five characters such as `"09.5"`; sections in whatever order the build hands them over, so nothing is styled as first or last;
- `prev` and `next` both set, one set, or neither; set without their titles; a `prevTitle` or `nextTitle` of 90 characters; a `prev` that points at a page outside the collection;
- a `title` of 2 characters and one of 83, and a single unbreakable word of 32 letters — in the heading, the breadcrumb, the contents and the previous and next links;
- a `description` that is blank or about 290 characters long;
- a section with no body; a site with no sections at all;
- one section or forty: a contents list beside the page must never push the page out of reach on a phone, and the contents page holds ten rows, so its last page may hold one;
- a table of three columns with a long cell and a code line of 80 characters, each scrolling inside itself; a long bare URL, which wraps;
- posts with past or future dates in the shared `list` template: the build does not know today's date, so never call anything "latest" or "upcoming";
- no image anywhere.

Interface words come from the theme's `strings.json`: English keys at the top level, and one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. Text drawn by CSS (`content:`) counts as an interface word. No theme emits a `<form>`.

## Left out on purpose

- Working out previous and next from the sort order, marking the current section without JavaScript, giving templates a neighbour's `order`, the collection label or the item count, and help text on schema fields: engine features, not content. The four hand-kept fields stay as they are.
- A numeric or validated `order`: retyping a field is not additive. The two-digit quoted form is a rule for the author, above.
- `"plugins": ["search"]`: the engine turns `search` on by default, as it does for the `default` theme's own Search link.
- `data/contact.json`: the phone and e-mail links are written on the home page, as in the `restaurant` family; no theme needs them in its chrome.
- A `home` layout that lists the sections under the home page's own text: a theme is free to show `collections.docs` in its chrome, and the home page links the sections itself.
- An `updated` or `revision` field: the edition is one line on the home page.
- A `pageSize` on `docs`: it changes how an existing site's contents page is paged, so it is not additive. The cost is known: past ten sections the contents page splits, which is why every theme words its paging links for pages and gives another way to the full list.
