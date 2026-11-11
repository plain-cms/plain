# Family contract: professional

The content contract every theme in the `professional` family shares. It is new: no shipped theme uses it yet. Planned themes: `chambers`, `taxreturn`, `apostille`, `patent`, `vigil`, `lintel`, `retrofit`.

```json
{
  "family": "professional",
  "title": "Professional services",
  "collections": {
    "services": {
      "path": "content/services",
      "urlPattern": "/services/:slug/",
      "template": "service",
      "listUrl": "/services/",
      "listTemplate": "services",
      "label": "Services",
      "sortBy": "order",
      "sortOrder": "asc",
      "pageSize": 100,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "description", "type": "text" },
        { "name": "fee", "type": "text" },
        { "name": "points", "type": "list" },
        { "name": "order", "type": "text", "default": "50" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    },
    "people": {
      "path": "content/people",
      "render": false,
      "sortBy": "order",
      "sortOrder": "asc",
      "label": "People",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "role", "type": "text" },
        { "name": "credentials", "type": "text" },
        { "name": "email", "type": "text" },
        { "name": "phone", "type": "text" },
        { "name": "photo", "type": "image" },
        { "name": "order", "type": "text", "default": "50" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Services", "url": "/services/" },
    { "label": "About", "url": "/about/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {
    "firm.json": {
      "phone": "",
      "email": "",
      "address": "",
      "hours": [
        { "days": "", "time": "" }
      ],
      "registration": "",
      "consultNote": ""
    }
  },
  "templates": ["services", "service"],
  "layouts": [],
  "contentTemplates": ["service.md", "person.md", "page.md"],
  "contentClasses": []
}
```

Not in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection. It adds two page frontmatter keys, `showServices` and `showPeople` (see Pages). `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample or to this contract.

## What the family is for

Regulated and advisory practices sold on competence and discretion: law firm, accountant, notary, patent attorney, engineer, surveyor, energy assessor, funeral director, financial adviser, mediator. The site answers three questions — what do you handle, who will handle it, how do I arrange a first meeting — from a list of services, a list of people and one file of standing facts.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/services/<slug>.md` | one service at `/services/<slug>/`, and a row on `/services/` |
| `content/people/<slug>.md` | one person in the people list; no page of its own |
| `content/pages/index.md` | the home page `/` |
| `content/pages/about.md` | `/about/` |
| `content/pages/contact.md` | `/contact/` |
| `content/posts/<slug>.md` | one news item at `/blog/<slug>/`, listed on `/blog/` (optional) |
| `data/firm.json` | the contact details, hours and registration line printed on every page |
| `data/navigation.json` | the menu: a list of `{ "label", "url" }`, starting from the four entries in the block |
| `site.config.json` | `site.title` is the firm's name as on the door plate, printed on every page; `site.description` is one sentence about the firm; `site.language` is the site's language code. Also holds the `services` and `posts` labels |

The menu is Home, Services, About, Contact. Its URLs are fixed, so the three page file names are fixed too, in every language. The engine builds `/services/` itself: do not write a page for it.

## Collection `services`

One item is one kind of work a client can instruct the firm to do: a will, a tax return, a certified copy, a beam calculation, a funeral. One file each in `content/services/`. The file name is the address: `wills-and-powers.md` → `/services/wills-and-powers/`. Never name a service `index.md`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The work, in the client's words, not the firm's jargon. Aim for 2 to 60 characters. | `Wills and lasting powers of attorney` |
| `description` | text | always write one | One sentence of 60 to 160 characters: who it is for and what they get. Shown in the row, under the title on the service page, and in search results. The build warns when it is missing. | `A will drawn up after one meeting, signed and witnessed at our office and stored free of charge.` |
| `fee` | text | no | What it costs, or how the cost is set, in a few words with the currency. Kept under 35 characters because themes set it prominently. Detail goes in the body. Leave it out rather than guess. | `Fixed fee from £240`, `First meeting free`, `By estimate` |
| `points` | list | no | What the engagement covers: three to seven short plain-text entries, each under 80 characters. No Markdown, no links. Themes print them under their own heading. | `- Storage of the original in our strongroom` |
| `order` | text | no, default `50` | Position in the list: a two-digit number from `10` to `99`, lowest first. Leave gaps (`10`, `20`, `30`). One-digit and three-digit numbers sort wrongly. | `20` |
| `draft` | boolean | no, default `false` | `true` keeps the service off the site. | `false` |

There are no select fields in this contract.

**Body.** Optional Markdown, starting at `##` (the title is the page's only `#`): who the work is for, how it runs, what the client brings, how the fee is made up (a table is fine).

**Order.** `/services/` lists every service by `order`, lowest first; services with the same number, or none (they get `50`), follow in file-name order. Put the work most clients come for first. The list holds 100 services per page, then `/services/page/2/`. Themes draw the list ungrouped: there are no categories.

## Collection `people`

One item is one person a client will deal with: partners, advisers, the person who answers the phone. One file each in `content/people/`. A person has no page and no URL; the list appears on every page that sets `showPeople: true`. A sole practitioner is a list of one.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The person's name as it should be read, with any title they use. | `Helen Calder` |
| `role` | text | no | What they do in the firm and what they handle, in a few words. | `Partner, wills and probate` |
| `credentials` | text | no | Professional title, qualification, year of admission, register number, languages spoken — one line, printed as written. Under 120 characters. Only what the person gave you. | `Solicitor, admitted 2004 · SRA no. 412345 · speaks English and Polish` |
| `email` | text | no | One address. Themes make it a `mailto:` link. | `helen.calder@calderfinch.example` |
| `phone` | text | no | A direct line, in the format of `phone` in `firm.json`. Themes make it a `tel:` link. | `01632 960171` |
| `photo` | image | no | The path of one portrait under `/media/`. Leave the line out when there is none; most sites have none. | `/media/2026/05/helen-calder.jpg` |
| `order` | text | no, default `50` | As for services: `10` to `99`, lowest first, ties in file-name order. | `10` |
| `draft` | boolean | no, default `false` | `true` leaves the person out. | `false` |

**Body.** Optional: a biography of one or two short paragraphs, printed under the person's details. Plain paragraphs and links only — no headings, lists, tables or images.

## Data file `data/firm.json`

The standing facts. Themes print them on every page, so they are written once, here.

| Key | Format | Meaning | Example |
| --- | --- | --- | --- |
| `phone` | string | The main number as a caller reads and dials it: digits, an optional leading `+`, spaces or hyphens. No words, brackets or slashes; themes put the same string after `tel:`. | `01632 960170` |
| `email` | string | The firm's one public address. Themes make it a `mailto:` link. | `office@calderfinch.example` |
| `address` | string | The office address on one line, parts separated by commas. One office only. Leave it out for a practice that works only at clients' premises. A second office or branch is a section of `contact.md` with its own address and `tel:` link. | `4 Market Place, Calderbrook HX7 4AB` |
| `hours` | list of `{ "days", "time" }` | Office hours, one row per line of the door plate, in the order to show them. Both values are free text. A closed day is a row whose `time` says so; "by appointment" is a `time` too. | `{ "days": "Monday to Friday", "time": "9:00 to 17:00" }` |
| `registration` | string, plain text | The line the profession must show: regulator or professional body, register number, VAT number. Printed as written on every page. Under 200 characters; the full legal notice is a page of its own. | see the example |
| `consultNote` | string, plain text | How a first meeting is arranged and what it costs, in one or two sentences. This is the only place that says it: no page body repeats it. No HTML, Markdown or links. | see the example |

There is no `name` key: the firm's name is `site.title`. Do not add one.

Blank values: a blank `phone`, `email`, `address`, `registration` or `consultNote`, or an empty `hours` list (`[]`), is left out with no gap, label or heading. With neither `phone` nor `email`, themes link to `/contact/` instead. A site with no `firm.json` still builds and looks finished.

## Pages

Three pages, each with a `title` and a `description`. The `description` is one sentence of 60 to 160 characters; themes print it under the title as the page's opening line and search engines show it, so write it for a reader and do not repeat it as the first sentence of the body. The `title` of `about.md` and `contact.md` is a short plain heading in the site's language (`About the firm`, `Contact and directions`).

Two optional frontmatter keys switch on the family's blocks; any page may set either:

| Key | The theme adds to the page |
| --- | --- |
| `showServices: true` | every service, in the same rows and order as `/services/` |
| `showPeople: true` | everyone in `people` |

The theme gives each block its own heading and decides whether it sits before or after the body, so do not write a heading for it, or "above" or "below". A block with nothing in it is not shown. Every page also ends with the theme's consult block (the note, phone, e-mail, hours and address from `firm.json`), so do not repeat the phone number, e-mail address, hours or address in a body; a `tel:` or `mailto:` link in a body is for a different number or address only (a second office, an out-of-hours line).

- `index.md` → `/`. `title` is the firm's headline, one sentence of up to 80 characters about what it does and for whom; not the word "Home" and not the firm's name, which is `site.title`. Set `showServices: true`. Body: one to three short sections — who the firm acts for and where, what it does not take on, what happens after the first meeting. For a practice that visits clients, the first section names the area covered (towns or postcodes). Do not hand-write a list of services.
- `about.md` → `/about/`. The firm's history, how it works, its memberships and insurance. Set `showPeople: true`; do not retype the people.
- `contact.md` → `/contact/`. Required: themes link here when `firm.json` has neither phone nor e-mail, and the body then says how to reach the firm. What to bring to a first meeting, how to find the door, parking, access. Do not repeat how to arrange the meeting: the consult block on the same page says it.

Further pages (legal notice, privacy, fee scale) are ordinary pages at `/<file-name>/`. The menu is `data/navigation.json`. Keep the four preset entries, in order, with their URLs unchanged; translate only their labels. Append any further page after Contact as one more entry, e.g. `{ "label": "Legal notice", "url": "/legal-notice/" }`, up to seven entries in all. Do not write `data/footer.json`.

News is `posts`, listed at `/blog/`, newest first. A post has `title` (required), `date` (required, `YYYY-MM-DD`), `description`, and optionally `tags` (a list of short lowercase words) and `cover` (an image path under `/media/`; leave it out when there is none). The body is plain Markdown from `##` down. A site that keeps news adds `{ "label": "News", "url": "/blog/" }` to its menu after About; without posts, add nothing. The headings of `/services/` and `/blog/` are the `label` of the `services` and `posts` collections in `site.config.json`: translate them there, and set the `posts` label to the word the menu uses.

Page bodies are plain Markdown: headings from `##` down, lists, tables, quotes, links. **This family has no content classes**: do not write raw HTML with class names in a body; no theme styles it.

## Examples

`content/services/wills-and-powers.md`:

```markdown
---
title: Wills and lasting powers of attorney
description: A will drawn up after one meeting, signed and witnessed at our office and stored free of charge.
fee: Fixed fee from £240
points:
  - One meeting of about an hour, at our office or at your home
  - A draft for your comments within ten working days
  - Signing and witnessing at our office
  - Storage of the original in our strongroom
order: 20
---

Most wills need one meeting and one draft. You leave the first meeting knowing the fee.

## What to bring

A list of what you own and roughly what it is worth, and the full names of the people you want to provide for.

## What it costs

| Document | Fixed fee |
| --- | --- |
| Single will | £240 |
| Mirror wills for a couple | £380 |
| Lasting power of attorney, each | £320 |
```

`content/people/helen-calder.md`:

```markdown
---
title: Helen Calder
role: Partner, wills and probate
credentials: Solicitor, admitted 2004 · SRA no. 412345 · speaks English and Polish
email: helen.calder@calderfinch.example
phone: 01632 960171
order: 10
---

Helen has drawn up wills and wound up estates in Calderbrook for twenty years. She sees clients at home or in hospital when they cannot come to the office.
```

`content/pages/index.md`:

```markdown
---
title: Solicitors for the people and businesses of Calderbrook
description: Calder & Finch handles property, wills, family and employment matters for private clients, at fixed fees agreed before work starts.
showServices: true
---

## Who we act for

Private clients and small businesses within an hour of Calderbrook. We do not take criminal or immigration work and will tell you who does.

## After the first meeting

You get a letter the same week setting out the work, the fixed fee and how long it should take. Nothing is charged until you have signed and returned it.
```

`data/firm.json`:

```json
{
  "phone": "01632 960170",
  "email": "office@calderfinch.example",
  "address": "4 Market Place, Calderbrook HX7 4AB",
  "hours": [
    { "days": "Monday to Friday", "time": "9:00 to 17:00" },
    { "days": "Saturday", "time": "By appointment" }
  ],
  "registration": "Calder & Finch LLP is authorised and regulated by the Solicitors Regulation Authority, no. 648213. VAT no. GB 123 4567 89.",
  "consultNote": "The first half-hour meeting is free. Ring or write and a solicitor will call you back within one working day."
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` followed by indented `- item` lines). No nesting, no multi-line values, no comments.
- Leave a blank field out. A key with nothing after it (`fee:`) stops the build.
- A value made only of digits is read as a number and loses a leading zero or trailing `.00`: write `fee: £450`, and `phone: "01632960171"` in quotes or with spaces. Do not start a value with a quotation mark unless the whole value is quoted.
- Dates (posts only) are `YYYY-MM-DD`. Never write "upcoming" or "this week": the page is not rebuilt when the day passes.
- Images are optional everywhere. The site must be complete with none: no "see the photo", no empty `photo:` line.
- Contact is `tel:` and `mailto:` links, never a form. The theme builds them from `firm.json` and `people`; write one in a body only for a different number or address, as `[01632 960199](tel:01632960199)`.
- Every service, page and post has a `description`. People need none.
- File names are lowercase letters, digits and hyphens (`erbrecht-und-testament.md`, not `Erbrecht & Testament.md`).
- Never promise an outcome, and never invent a fee, a qualification, a register number or an opening time — leave the field out. A service with only a title and a description is complete; so is a person with only a name.

## Rules for the theme builder

`starter.json` carries `collections`, `navigation` and `plugins` exactly as in the block; `theme.json` has no `layouts`; `templates/` adds `services.html` and `service.html` to the universal five; `content-templates/` holds `service.md`, `person.md` and `page.md` (the last with both `show…` keys written out, so an editor sees they exist); `sample/data/` holds `firm.json` and `navigation.json` only. Partials are the theme's own business.

Every theme must render:

- **`base`** — `site.title` linking to `/`; the menu from `nav`; `data.footer.html` when the site has it; `data.firm.registration` once, as written; and on every page (the 404 may skip it) **the consult block** (`consult-cta` in the catalogue rows) from `data.firm`: `consultNote`, `phone` as a `tel:` link, `email` as a `mailto:` link, each `hours` row (`days`, `time`), `address`. On a service page it follows the service directly. With neither phone nor e-mail it links to `/contact/`. A theme may repeat the phone elsewhere.
- **A service row** (one partial, used by the list and the block) — `title` linked to `item.url`, `description`, and `fee` only when set.
- **`services`** (the list) — `page.title` as the `h1`; a row for every item in `items`, in the order given; pagination when `pagination.multiple`; a line from `strings.json` when the list is empty.
- **`service`** — `title` as the `h1`, `description`, `fee` when set, the body, `points` as a list under a heading from `strings.json` only when it has entries, and a link back to `/services/`.
- **`page`** — `page.title` as the `h1`; `page.description` as an intro line when set; the body; and, when the key is true and there is something to show, the services block (`collections.services`, every item, same rows as the list, with a link to `/services/`) and the people block (`collections.people`: `title`, `role`, `credentials`, `photo` when set with the name as its `alt`, the body as `{{{ item.content }}}`, `email` as `mailto:`, `phone` as `tel:`).
- **`list`** — serves `/blog/` and tag pages only: `title` linked to `url`, `dateFormatted`, `description`, `cover` only when set; an empty state; pagination. **`post`** as in every family.
- **`404`** — links to `/` and `/services/`.

`tel:` and `mailto:` hrefs use the value as written. Every interface word — block headings, the points heading, any fee label — comes from the theme's `strings.json` (English keys at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks), never from the contract's data.

Every theme must tolerate:

- A service with only `title` and `description`: no fee (no empty box, slot, label or pointer), no points, no body.
- One service or forty on a page, more than a hundred (pagination), none. Anything drawn across the list — numbering, a cycle of shapes — comes from CSS counters and `nth-child`, holds for any count and may restart on page 2 and in the block. Print no counts, group headings or "first" and "last" markers: templates cannot compute them.
- A `fee` of 40 characters (it wraps, it is never clipped); ten `points` of 120 characters each, or one.
- No person, one or thirty; a person with only a name; some with a `photo` and some without (no placeholder, no reserved space); a `role` of 100 characters; a `credentials` line of 180; an e-mail address of 55; a biography of two paragraphs.
- No `firm.json`, or any key missing or blank; one `hours` row or eight, with a `days` or `time` of 45 characters; a phone number of 25 characters; an e-mail address of 40; an `address` of 150; a `registration` of 250; a `consultNote` of 300. A signature that carries one contact link (a bell, a pointer) takes `phone`, else `email`, else the `/contact/` link; one lettered with `registration` stands unlettered when it is blank. The drawing stays and no slot is left empty.
- Seven menu entries with long translated labels.
- A title of 80 characters (a home-page headline of 100) and one of two; a `description` of 300; a word of 40 characters with no break in a title, a point, a role or a table cell.
- Both blocks on one page, and a key set to true with nothing to show (no empty box, no orphan heading).
- Plain Markdown of any shape in a body (`h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, a long bare URL); posts with past or future dates, with and without `cover` and `tags`. The build does not know today's date: never call a post "latest" or "upcoming".
- No sideways scroll at 320px with any of the above, in both colour schemes. No images anywhere; a signature is drawn from text and CSS, never from `photo`.

## Not in the contract

- No pages for people, no languages field, no link from a service to the person who handles it: these go in `credentials`, the biography or the service body.
- No service categories or practice-area groups, no `featured` flag, no home-page layout: the list is one ordered column and `index.md` is an ordinary page with a key set.
- No area-covered key and no second address: the area is the first section of `index.md`, further offices are in `contact.md`.
- No booking link, enquiry form, client login, document upload or fee calculator in the contract. A firm that already takes bookings or uploads elsewhere links that address with an ordinary Markdown link in the body of `contact.md`; it never goes in `consultNote` or `firm.json`.
- No emergency number: a firm on call at night says so in `consultNote` and `hours`.
- No testimonials or case results: many professions may not publish them. Where allowed, they are a blockquote in a page body.
- No content classes and no second data file.
