# Family contract: portfolio

For people hired on the strength of past work — designers, photographers, architects, makers, filmmakers, writers. The site is a dated record of projects, each a short case study, and it must read well when no project has a picture.

Every theme in this family ships exactly this contract, so a site can move between two of them with no content change. It is the contract of the shipped theme `studio`, unchanged.

```json
{
  "family": "portfolio",
  "title": "Portfolio",
  "collections": {
    "projects": {
      "path": "content/projects",
      "urlPattern": "/work/:slug/",
      "template": "project",
      "listUrl": "/work/",
      "listTemplate": "projects",
      "label": "Work",
      "sortBy": "date",
      "sortOrder": "desc",
      "pageSize": 12,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "description", "type": "text" },
        { "name": "cover", "type": "image" },
        { "name": "client", "type": "text" },
        { "name": "services", "type": "list" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Work", "url": "/work/" },
    { "label": "About", "url": "/about/" }
  ],
  "plugins": [],
  "data": {},
  "templates": ["project", "projects"],
  "layouts": [],
  "contentTemplates": ["project.md"],
  "contentClasses": []
}
```

`pages` and `posts` are the universal collections, unchanged. There is no data file and no content class: everything a visitor reads comes from project fields, page Markdown and the site title.

The name of the person or studio is `site.title` in `site.config.json` — the name only, as they sign their work (`Ellison & Okafor`), under 40 characters; themes print it on every page and may use it as a signature. `site.description` is one plain sentence on what they do and where; themes may print it in the footer. Write both.

## The `projects` collection

One item is one piece of work — a case study: what it was, who it was for, what was done, and the story in the body. One file per project in `content/projects/`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The name of the project, not of the client. The page heading and the name on its tile. Best under 60 characters. | `The ring mark` |
| `date` | date | yes | When the work was finished or handed over, `YYYY-MM-DD`. Themes show only its year. When only a month or a year is known, use its first day (`2026-05-01`, `2026-01-01`). Unbuilt, unrealised or self-initiated work: the date the design or piece was finished (a competition entry: its submission date). Work in progress: the expected completion date if the customer gave one, otherwise the date it began. | `2026-05-14` |
| `description` | text | no, but always write it | One sentence: what this was and who it was for. Shown under the title on the project page, on the tile of a project with no picture, and in search results and link previews. Aim for 100–160 characters. | `A brand identity and packaging system for a two-person roastery that outgrew its stamped kraft bags.` |
| `cover` | image | no | Root-relative path of one picture under `/media/`. Leave the line out when there is no picture — never point at a placeholder. Decorative: it is printed with empty alt text. | `/media/2026/05/corvid.jpg` |
| `client` | text | no | Who the work was for, as they would want to be named. Leave the line out for self-initiated work or a private client who should not be named. | `Corvid Coffee Roasters` |
| `services` | list | no | What you did on this project: one to six short labels, spelled the same way across projects. Use the words of the trade: an architect's scope (`Planning`, `Interiors`), a filmmaker's roles (`Direction`, `Camera`, `Edit`), a writer's deliverables (`Tagline`, `Web copy`), a maker's medium or technique (`Linocut`, `Carved slate`). Not prices, places or dates. They are printed, not linked — no page is made per service. | `Identity`, `Packaging` |
| `draft` | boolean | no (default `false`) | `true` keeps the project out of the site entirely. | `false` |

There are no select fields.

**Body.** The case study in Markdown. The usual shape is one opening paragraph, then `## The challenge`, `## The approach`, `## The outcome` (in the site's language), but any Markdown is valid and the body may be empty. Start headings at `##`. A picture that needs describing goes here as `![what it shows](/media/…)`, not in `cover`. No raw HTML and no class names here either — no embedded player. A film, a live site or a shop listing is a Markdown link on its own line: `[Watch the film (4 min)](https://vimeo.com/…)`.

**Order.** Newest `date` first, everywhere: the home page, `/work/`, and any list of other projects. Projects with the same date follow file-name order. To move a project up, change its date — there is no other ordering field.

**URLs.** `content/projects/corvid-coffee.md` → `/work/corvid-coffee/`. The file name is the address: lowercase letters, digits and hyphens only (`cafe-elysee.md`, not `Café Élysée.md`). The list is `/work/`, twelve per page, then `/work/page/2/`.

Example — `content/projects/corvid-coffee.md`:

```markdown
---
title: The ring mark
date: 2026-05-14
description: A brand identity and packaging system for a two-person roastery that outgrew its stamped kraft bags.
client: Corvid Coffee Roasters
services:
  - Identity
  - Packaging
---

Corvid started as a weekend market stall with a rubber stamp and a roll of kraft bags. By the time they came to us they were roasting four days a week and supplying eleven cafés.

## The challenge

The founders wanted to look established without looking corporate, and the whole system had to print on the two-colour press in their own studio.

## The approach

One heavy charcoal ring — the mark a cup leaves — became the logo, the label frame and the shelf language at once.

## The outcome

Wholesale accounts grew from eleven cafés to nineteen within four months, and every label is now printed in-house in an afternoon.
```

## Data files

None. Contact details are written in the Markdown of the home and about pages. `data/footer.json` and `data/strings.*.json` belong to the site; `data/navigation.json` is set from the preset above.

## Pages

| File | URL | What it holds |
| --- | --- | --- |
| `content/pages/index.md` | `/` | The home page. Its frontmatter **must** carry `template: projects`: the theme then shows the title, the body, and every project. `title` is a one-line statement of what the person or studio does (it is the page's main heading — never "Home"). The body is one or two short paragraphs — who, what, where — and a contact line. |
| `content/pages/about.md` | `/about/` | Who they are, how they work, what they do (a list), who they have worked for, how to start a project, then the contact details: e-mail, phone, address, hours. Plain Markdown with `##` sections. |
| (none — generated) | `/work/` | Every project, twelve per page. Headed by the collection label. |

The file name `about.md` is fixed by the navigation preset, whatever the site's language; its `title` is free (`Über uns`). "Work" and "About" are labels: a site in another language changes them in its own `site.config.json` (`label`) and `data/navigation.json`; URLs, file names and field names never change. A site may add more pages (a legal notice, a price list) and posts; they are ordinary pages and posts. An added page or `/blog/` is reached only if something links it: append it to `data/navigation.json` after About (keep the menu to five entries, Work first), or link it from the about page's text.

Page and project Markdown in this family uses **no raw HTML and no class names**. Contact is written as Markdown links.

Example — `content/pages/index.md`:

```markdown
---
title: Design and photography, made in one room
description: Ellison & Okafor is a two-person studio in Bristol. Identity, print and photography for people who make things.
template: projects
---

Ellison & Okafor is Mara Ellison, graphic designer, and Tomas Okafor, photographer. We make identities, books and pictures for people who make things — a handful of projects a year, from one room in Bristol.

[hello@ellisonokafor.example](mailto:hello@ellisonokafor.example) · [0117 496 0123](tel:+441174960123)
```

Example — `content/pages/about.md`:

```markdown
---
title: About
description: Who Ellison & Okafor are, what the studio does, and how to start a project with us.
---

Ellison & Okafor was founded in 2021 by Mara Ellison and Tomas Okafor. Every project is led by the two of us, start to finish.

## What we do

- Identity and naming
- Packaging and print
- Photography — portrait, product and documentary

## Who for

Corvid Coffee Roasters, The Tidemill Hotel, Kiln Row Ceramics and Pilcrow Books.

## Start a project

Write to [hello@ellisonokafor.example](mailto:hello@ellisonokafor.example) or ring Mara on [0117 496 0123](tel:+441174960123).

Ellison & Okafor, Unit 4, The Old Printworks, Hillgrove Street, Bristol BS2 — by appointment, Tuesday to Friday.
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` then indented `- item` lines). No nesting, no multi-line values. Put a value in double quotes only if it is the word `true` or `false`, or a bare number, and must stay text. Never write a key with nothing after the colon — for a text or image field that stops the build; leave the whole line out. A value must not both begin and end with a straight quote mark: for a quoted tagline use curly quotes (`title: “Think small”`). Colons and `#` inside a value are fine and need no quoting.
- Dates are `YYYY-MM-DD`.
- Every project and every page needs a `description`. A missing one is a build warning.
- Images are optional everywhere. A site with none must be complete: write the description so the tile works without a picture, and never invent an image path.
- Contact is `mailto:` and `tel:` links in page Markdown, never a form. Write the phone number as people read it and link it in international form: `[0117 496 0123](tel:+441174960123)`.
- Do not write "latest", "upcoming" or "current" about a project: the site cannot know today's date. The date says it.
- No theme says whether a project was built, shipped or shown. If it matters, say so in the first words of the description: `Unbuilt competition entry for …`.
- Do not add fields the contract lacks (role, location, running time, medium, size, edition, price, alt text for the cover, a link). Put such facts in the opening paragraph of the body as one plain sentence — `Linocut, 30 × 40 cm, edition of 40, £120 unframed.` — and anything a visitor can follow as a Markdown link.
- A new site may have few projects. Three honest ones are better than nine padded ones; themes must look right with one.

## Rules for the theme builder

**Templates.** Ship `project` and `projects` beside the universal `base`, `page`, `post`, `list`, `404`, and `content-templates/project.md`. Partials are the theme's own business. `theme.json` has no `layouts`.

`projects` has two callers and must serve both:

- **As the list at `/work/`:** `page` is `{title, url}` with no `slug`; loop `items` (this page's twelve), print `pagination`, and print `strings.nothingHere` when `items` is empty.
- **As the home page's layout** (`template: projects` on a pages item): `page.slug` is set; print `page.title` as the `h1`, `page.content` (the contact line lives there), then loop **all** of `collections.projects`. Print nothing for the list when the collection is empty.

Tell them apart with `{{#if page.slug}}`.

**What must be rendered.**

- On every page: `site.title` linked to `/`, the menu from `nav`, and `data.footer.html` when the site has it.
- A project on the home page and on `/work/`: `title` linked to `url`; `date` as its year; `client` when set. With a `cover`, the picture (`alt=""`) with the title still present as text. Without one, a tile that is complete by itself — the `description` is the natural filler.
- A project page: `title` as the `h1`; `date` as its year; `client` when set; each of `services` when set; `description` when set; `cover` when set; `page.content`; and a way on to other work (a link to `/work/` or a short list from `collections.projects` — in that short list only the linked `title` is required).
- Labels such as Client, Year, Services are interface words: `strings.json`, English flat at the top level plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`.
- A signature may draw only on project fields, `page.title`, `page.description`, `site.title` and `site.description`. A theme prints no contact block of its own — there is no data to fill it.

**Dates.** `date` is the string `YYYY-MM-DD`; `dateFormatted` is the same date written out in the site's language. There is no year field: wherever a project's date is visible, print `date` inside `<time datetime="{{ page.date }}">` (`item.date` in a list) and clip it to its first four characters in CSS, as `studio` does (`.year`: `display: inline-block; width: 4ch; overflow: hidden; white-space: nowrap`). Do not print `dateFormatted` for a project — authors use the first day of the year when only the year is known, so a written-out date would state a day the customer never gave.

**What must be tolerated.**

- Blank `description`, `cover`, `client`, `services` and an empty body, alone or all at once: no empty label row, no dangling separator, no empty image box.
- Zero projects, one, or forty. The home page shows them all; `/work/` paginates at twelve. Position effects (`:nth-child`, CSS counters) restart on each page of `/work/`. Templates cannot count, group by year, or find the first or last item — do not design for it.
- Titles of 3 and of 80 characters; an unbreakable word of 35 characters in a title, a client or a service at 320px; a client of 80 characters; seven services, one of them 45 characters long; a description of 300 characters.
- Two to five menu entries with translated labels of up to 20 characters each, and a site title of 40 characters, at 320px.
- Past and future dates, several projects on one date, a year with a single project. Never label a project by its position in time.
- Page and project bodies with `h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, pictures, a long bare URL and a 40-character e-mail address as link text. Nothing may make the page scroll sideways at 320px.
- A cover of any shape. Most sites in this family have no pictures at all: the no-picture design is the main design, not a fallback.

## Not in the contract

Raised by the audit of `studio` and left out on purpose:

- A `layouts` entry or a separate `home` template for the home page — `template: projects` already works and the admin keeps it on save; a `home` template would be a rename.
- `coverAlt` — the cover is decorative beside the title; a picture that needs describing goes in the body with Markdown alt text.
- `data/contact.json` — Markdown links already give `mailto:` and `tel:`; a data file would make every theme carry a contact block.
- `pages` declared in `starter.json` — it is a universal collection and this family does not change it.
- A `role` field — `services` already says what was done.
- A status field (built, unbuilt, in progress) and fields for location, running time, medium, size, edition or price — each belongs to one trade and no theme draws on one; the description and the body's opening sentence carry them.
- An embedded film or audio player — raw HTML and an outside request; a Markdown link does the job.
- A year field and previous/next project links — engine features, not content.
