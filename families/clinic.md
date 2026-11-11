# Family contract: clinic

The content contract every theme in the `clinic` family shares. Source: `themes/practice`, reused verbatim, with one additive change (the optional `email` key in `data/practice.json`).

```json
{
  "family": "clinic",
  "title": "Clinic and practice",
  "collections": {
    "services": {
      "path": "content/services",
      "urlPattern": "/care/:slug/",
      "template": "service",
      "listUrl": "/care/",
      "listTemplate": "list",
      "label": "Care",
      "sortBy": "title",
      "sortOrder": "asc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "description", "type": "text" },
        { "name": "preparation", "type": "list" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Care", "url": "/care/" },
    { "label": "About", "url": "/about/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {
    "practice.json": {
      "phone": "",
      "emergencyPhone": "",
      "emergencyNote": "",
      "hours": [
        { "days": "", "time": "" }
      ],
      "address": "",
      "bookingUrl": "",
      "email": ""
    }
  },
  "templates": ["service"],
  "layouts": [],
  "contentTemplates": ["page.md", "service.md"],
  "contentClasses": []
}
```

## What the family is for

Health and care practices people visit or call: dentist, family doctor, physiotherapist, optician, pharmacy, midwife, vet. Their visitors are often anxious or in a hurry, so every page answers three questions without a search: when are you open, what number do I call, and what do I do in an emergency.

## Collection `services`

One item is one kind of care the practice offers (a check-up, a vaccination, a home visit): what it is, what happens, what it costs and how to prepare.

- File `content/services/<slug>.md` becomes the page `/care/<slug>/`. The file name is the URL: lowercase a–z, digits and hyphens only (`zahnaerztliche-vorsorge.md`, not `Zahnärztliche Vorsorge.md`).
- All items are listed at `/care/`, ten to a page by default (`/care/page/2/` and so on). Its heading is the collection's `label`, "Care".

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The name of the care, in the words a patient would use. It is the page heading and the link text in the list. Up to 80 characters; under 40 reads best, since themes set it large. | `Check-ups & cleaning` |
| `description` | text | yes, by rule | One plain-text sentence, about 80–160 characters. Shown under the title on the page, as the summary in the list, and in search results. The schema allows leaving it out, but the build then warns; always write one. | `Thirty unhurried minutes, once a year for most people, with the price told before you sit down.` |
| `preparation` | list | no | What to do or bring before the visit: up to about eight short plain-text steps, one per line, no Markdown and no links. The theme shows them under its own "Before your visit" heading. Leave the field out when there is nothing to prepare. | `- Eat a normal meal beforehand` |
| `draft` | boolean | no | `true` keeps the item off the site entirely. Default `false`. | `false` |

There are no select fields.

**Body.** Markdown, starting at `##` (the title is the page's only `#`). The usual sections are "What happens", "What it costs" and "Afterwards". Use only the sections the customer gave material for; with no price information, leave out "What it costs" rather than writing around it. Prices go in the body, as text or a table; there is no price field.

**Sorting.** The list is alphabetical by `title` and cannot be reordered. The comparison is by character code: digits, then A–Z, then a–z, then accented letters. So start every title with a capital letter, and expect a title beginning with Ä, Ö or É to come after Z. To put the most wanted care first, link it by hand on the home page.

## Data file `data/practice.json`

The practice's contact details, shown by the theme on every page. Write each value exactly as it should be read.

| Key | Meaning and format | Example | When blank |
| --- | --- | --- | --- |
| `phone` | The main number. It is shown as written **and** used as the `tel:` link as written, so it must be dialable: digits, an optional leading `+`, hyphens between groups. No spaces, brackets, slashes or words. | `+1-555-0104` | No call link. The appointment block shows the `mailto:` link instead when `email` is set; the Book link is there either way. |
| `emergencyPhone` | The number to call when the practice is closed or it cannot wait. Same format. Use a public number (`116117`, `111`) only when the customer named it. A practice with no after-hours line (most opticians, therapists, audiologists) leaves both emergency keys blank; that is normal, and the contact page then says nothing about emergencies unless the customer did. | `+1-555-0199`, `116117` | The emergency line is shown nowhere, with or without a note. |
| `emergencyNote` | A short label for the emergency number, up to about 60 characters. Shown only together with `emergencyPhone`; leave it blank when that is blank. It is a label, so do not put a number in it. | `In pain after hours?` | The theme's own words for "After hours", beside the number. |
| `hours` | A list of `{ "days", "time" }` pairs in reading order, both free text shown as written. Seven rows or fewer; `days` up to about 35 characters, `time` up to about 50. Morning and afternoon sessions go in one `time` value (`8–12 and 15–18`). To show a closed day, add a row whose `time` is the word for "Closed" in the site's language. A practice with no fixed hours writes one row (`{ "days": "Mon–Fri", "time": "By appointment" }`) or leaves the list empty. | `{ "days": "Mon–Fri", "time": "8 am – 6 pm" }` | An empty list `[]` shows no hours. |
| `address` | The street address on one line, parts separated by commas. Shown as text. Up to about 130 characters. A practice with no premises leaves it blank. | `14 Alder Street, Fairview` | Left out. |
| `bookingUrl` | The full `https://` address of an external online-booking page, if the practice has one. | `https://book.example.com/alder-street` | Every "Book an appointment" link goes to `/contact/`. This is the usual case. |
| `email` | One e-mail address. The theme makes it a `mailto:` link. | `hello@alderstreetdental.example` | No e-mail link. Sites built before this key existed do not have it. |

## Pages

Every site has these three pages in `content/pages/`, each with `title` (up to 80 characters) and `description`. The navigation preset links them, and themes link `/care/` and `/contact/` directly — so the menu's labels may be translated in `data/navigation.json`, but the four URLs must stay. The list heading is the `label` of `services` in the site's own `site.config.json`; a site in another language, or a practice that uses another word ("Leistungen", a vet's "Services"), changes it there and in the menu. Nothing else in the collection, and no URL, file name or field name, may change.

- **`index.md` → `/`** The `title` is the home page's headline, a sentence about the practice (`A calm, unhurried dental practice on Alder Street`), not "Home". Body: a short welcome; a hand-written list of links to the three to six most wanted services, most wanted first, then a link to `/care/`; what a first visit is like; where the practice is, with an hours table; a link to `/contact/`.
- **`about.md` → `/about/`** Who runs the practice, how it works, and the people a patient will meet, with names and roles in a list. No photos are needed.
- **`contact.md` → `/contact/`** Required: this is where "Book an appointment" leads when `bookingUrl` is blank. How to book, with the phone as a `tel:` link and the e-mail as a `mailto:` link; what to do in an emergency; an hours table, closed days included; the address and how to find the door; parking; access.

Leave out what does not apply. A practice that visits people at home has no address, door, parking or access section and says which area it covers instead. A walk-in practice (a pharmacy) says on the contact page that no appointment is needed. Where this file says "patient", a vet's site means the animal's owner.

A site may add more pages (fees and insurance, a legal notice, privacy) as `content/pages/<slug>.md` → `/<slug>/`, each with `title` and `description`. Link them from the home page or the contact page. The menu keeps its four entries in this order; a site may append at most two more after Contact in `data/navigation.json`, which is the `navigation` array above written as the whole file.

Hours, phone and address on these pages repeat `data/practice.json`. Keep the two the same.

News such as holiday closures or new hours goes in the universal `posts` collection (`content/posts/`, listed at `/blog/`), which the menu does not link; link a post from the home page when it matters. A post is `content/posts/<slug>.md` → `/blog/<slug>/` with `title` (required), `date` (required, `YYYY-MM-DD`), `description`, and optionally `tags` (a list of short words; each makes a page at `/blog/tag/<tag>/`), `cover` (an image path under `/media/`; leave it out) and `draft`. Posts are listed newest first. A new site needs no posts.

**Content classes: none.** Pages, services and posts are plain Markdown — headings, paragraphs, lists, tables, blockquotes, links, images. Do not write raw HTML with class names; no theme in this family styles any.

## Examples

`content/services/fillings.md`

```markdown
---
title: Fillings
description: Tooth-colored fillings done gently, with numbing that gets time to work and a price agreed before we start.
preparation:
  - Eat a normal meal beforehand — your mouth may be numb for a couple of hours after
  - Tell us about any allergies or reactions to anesthetic you have had
  - Plan a quiet hour afterwards rather than a big meeting
---

A filling repairs a tooth where decay has made a hole. Done early it is a small, calm procedure.

## What happens

We numb the area, wait until it has worked, and check with you before starting. You are done in about forty minutes.

## What it costs

The price depends on the size of the filling. You hear the exact figure before anything begins.

## Afterwards

Numbness fades within a couple of hours. If the bite feels tall, call and we adjust it the same week.
```

`content/pages/contact.md`

```markdown
---
title: Contact & finding us
description: Where we are, when we are open, parking and access — and what to do if you are in pain right now.
---

## Book or ask

Call **[+1-555-0104](tel:+1-555-0104)** whenever we are open, or write to [hello@alderstreetdental.example](mailto:hello@alderstreetdental.example).

**In pain after hours?** Call **[+1-555-0199](tel:+1-555-0199)** and you reach the dentist on duty.

## Opening hours

| Day | Open |
| --- | --- |
| Monday–Friday | 8 am – 6 pm |
| Saturday | 9 am – 1 pm |
| Sunday | Closed |

## Where we are

**14 Alder Street, Fairview** — the blue-green door between the pharmacy and the bakery. Free parking behind the building; step-free entrance at the back door.
```

`content/posts/closed-over-new-year.md`

```markdown
---
title: Closed 24 December to 3 January
date: 2026-12-01
description: The practice is closed from 24 December and opens again on Monday 4 January. The emergency line stays open.
---

We are closed from Thursday 24 December and back on Monday 4 January. If you are in pain while we are away, call **[+1-555-0199](tel:+1-555-0199)**.
```

`data/practice.json`

```json
{
  "phone": "+1-555-0104",
  "emergencyPhone": "+1-555-0199",
  "emergencyNote": "In pain after hours?",
  "hours": [
    { "days": "Mon–Fri", "time": "8 am – 6 pm" },
    { "days": "Sat", "time": "9 am – 1 pm" },
    { "days": "Sun", "time": "Closed" }
  ],
  "address": "14 Alder Street, Fairview",
  "bookingUrl": "",
  "email": "hello@alderstreetdental.example"
}
```

## Rules for the author

- The practice's name is `site.title` and its one-line description `site.description`, both in the site's `site.config.json`. Themes print the name on every page: keep it under 40 characters and do not repeat it as a heading in a page body.
- Frontmatter is flat: `key: value` lines and simple lists (`key:` then indented `- item` lines). No nesting, no multi-line values. Put a value that is only a number, or only `true` or `false`, in double quotes if it is meant as text.
- Dates (posts only) are `YYYY-MM-DD`.
- Images are optional everywhere and a site must be complete without one. This contract has no image field. A photograph the customer supplied goes in a page or service body as `![what it shows](/media/YYYY/MM/file.jpg)`, with real alt text; never point at a placeholder or a picture you do not have.
- Contact is `tel:` and `mailto:` links, never a form.
- Every service, page and post needs a `description`.
- Write phone numbers the same way everywhere: the format given for `phone` above.
- Never make a medical promise the practice did not make, and never invent a price, an opening time or an emergency number — leave the key blank, or leave the sentence or section out.
- `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract. `data/navigation.json` is written from the preset above.

## Rules for the theme builder

**Every theme renders**

- `base.html`, on every page, without JavaScript: `site.title` linking to `/`; the menu from `nav`; a Book link to `bookingUrl`, or to `/contact/` when it is blank; and from `data.practice` the `hours` rows (`days` and `time`), `phone` as a `tel:` link, the emergency line (`emergencyNote`, or the theme's own string when blank, with `emergencyPhone` as a `tel:` link), `address`, and `email` as a `mailto:` link; and `data.footer.html`, raw (`{{{ data.footer.html }}}`), when the site has it. Where they sit is the theme's choice; address and e-mail in the footer are enough.
- `service.html`: `page.title`, `page.description`, `page.content`; `page.preparation` as a list under a heading from `strings`, only when it has steps; a link back to `/care/`; and an appointment block that always holds the Book link (to `bookingUrl`, or to `/contact/` when it is blank) and, beside it, one direct link: `phone` as a `tel:` link when set; otherwise `email` as a `mailto:` link when set; otherwise nothing more.
- `list.html` draws **every** list on the site: the care index, the blog index and tag pages. Only posts have `item.date`. Each item shows its title linked to `item.url`, its description, and its date when it has one. Show the pagination links when `pagination.multiple`, and a line from `strings` when the list is empty. The template language cannot tell which list it is drawing, but CSS can: put `data-list="{{ page.url }}"` on the list wrapper and key anything that belongs only to the care index on `[data-list^="/care/"]` (this matches `/care/` and `/care/page/2/`; the blog index and tag pages start `/blog/`). A theme whose signature is the care index must do this, and must draw the blog index and tag pages as a plain dated list with none of the chart's furniture (no acuity fractions, vertebra numbers, core-word cells or duochrome row).
- `page.html`, `post.html`, `404.html` as in every family. The 404 links home, to `/care/` and to `/contact/`, and shows the phone.
- `tel:` and `mailto:` hrefs use the value as written. Every interface word comes from `strings`.

**Every theme tolerates**

- `data/practice.json` missing, or any key in it missing or blank (older sites have no `email`): the part is left out, with no empty box, label or stray punctuation.
- A service with only `title` and `description`: no body, no `preparation`.
- One service or forty. A list page holds ten unless the site's own config says otherwise, so anything drawn across the list (numbering, a size or colour sequence) must look right for any count and may restart on the next page.
- A title of 3 characters and one of 80, on a service, a page or a post; an unbreakable word of 40 characters in a title, a step or a table cell; a long bare URL in body text or in a step; a three-column table; nine preparation steps of two lines each.
- A 20-character phone number, a 6-digit one, a 60-character `emergencyNote`, a 130-character `address`, a 40-character e-mail address, seven `hours` rows with a 35-character `days` and a 50-character `time` — at 320px wide with no sideways scroll.
- A menu of four to six entries, with labels in any language.
- Titles that are not in English and do not sort the way the reader expects.
- Posts with past or future dates. The build does not know today's date; never call anything "upcoming" or "latest".
- Body Markdown of any kind: `h2`–`h4`, nested lists, tables, blockquotes, code blocks, `hr`.
- No images anywhere: never reserve space for one. An image in a body, when there is one, scales to the column.

## Deliberately not in the contract

- No `order` or `pageSize` on `services`, no price field, no staff or notices collection, no home-page layout: the list is alphabetical and paged by ten, and the rest is written in Markdown.
- No separate dial string for a phone number: the one value is written dialable.
- No `contactUrl`: the contact page is always `/contact/`.
