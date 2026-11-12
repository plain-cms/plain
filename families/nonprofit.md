# Family contract: nonprofit

The content contract every theme in the `nonprofit` family shares. Source: `themes/cause`, reused verbatim — no change. Themes: `cause` (shipped); `undersigned`, `cairn`, `bequest`, `pushrim`, `hustings`, `dropin` (planned).

```json
{
  "family": "nonprofit",
  "title": "Nonprofit and campaign",
  "collections": {
    "programs": {
      "path": "content/programs",
      "urlPattern": "/programs/:slug/",
      "template": "program",
      "listUrl": "/programs/",
      "listTemplate": "list",
      "label": "Programs",
      "sortBy": "title",
      "sortOrder": "asc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "description", "type": "text" },
        { "name": "cover", "type": "image" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Programs", "url": "/programs/" },
    { "label": "About", "url": "/about/" },
    { "label": "Donate", "url": "/donate/" }
  ],
  "plugins": [],
  "data": {
    "impact.json": {
      "stat": { "number": "", "unit": "", "verb": "" },
      "donateUrl": "",
      "donatePrompt": "",
      "volunteerEmail": ""
    }
  },
  "templates": ["program"],
  "layouts": [],
  "contentTemplates": ["mission.md", "page.md", "program.md"],
  "contentClasses": []
}
```

Not repeated in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection; it adds four page frontmatter keys — `hero`, `heroImage`, `heroAlt`, `donateCta` (see Pages). Partials are each theme's own business.

## What the family is for

Charities, voluntary services and campaigns: a food bank, an animal rescue, a youth centre, a mountain rescue team, a community foundation, a residents' campaign. The site earns trust quickly — what you do, one honest number, where the money goes — and then asks for one thing: a donation — or, for a campaign that takes no money, a signature or an evening — with a volunteer's e-mail as the second way to help.

## Collection `programs`

One item is one thing the organisation does for people (a tutoring service, a weekly drop-in, a repair call-out) or one way to take part (volunteering): who it is for, what happens, what it costs to run. For a campaign or a candidate, one item is one demand or pledge, or one way to take part (sign, deliver leaflets, come to the meeting).

- File `content/programs/<slug>.md` becomes the page `/programs/<slug>/`. The file name is the URL: lowercase a–z, digits and hyphens only; write `ae`, `oe`, `ue`, `ss` for umlauts (`waermestube.md`).
- All items are listed at `/programs/`, ten to a page (`/programs/page/2/` and so on). The list's heading is the collection label, "Programs".

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The program's name in the words of the people it serves. It is the page heading and the link text in the list. Up to about 60 characters. | `One-to-one tutoring` |
| `description` | text | yes, by rule | One or two plain-text sentences, about 80–160 characters: who it serves and what changes for them. Shown under the title on the page, as the summary in the list, and in search results. The schema allows leaving it out, but the build then warns; always write one. | `Same tutor, same table, one hour a week. Most adult learners reach everyday reading within eighteen months.` |
| `cover` | image | no | The path of one photograph (`/media/2026/03/tutoring.jpg`), shown above the body as decoration, with no caption and no alt text. Leave the key out when there is no photo — the usual case. | — |
| `draft` | boolean | no | `true` keeps the item off the site entirely. Default `false`. | `false` |

There are no select fields.

**Body.** Markdown, starting with a plain paragraph on the problem the program answers; any heading starts at `##`. The pattern that works is three bold-labelled paragraphs: **Who it serves:**, **A typical week:**, **What it costs us:** (a per-unit figure and what it buys). For a campaign's demand or pledge the labels become **What it changes:**, **What happens next:**, **What it needs:**. A body is optional.

**Sorting.** The list is alphabetical by `title` and cannot be reordered. The comparison is by character code: digits, then A–Z, then a–z, then accented letters. So start every title with a capital letter, and expect a title beginning with Ä, Ö or É to come after Z. Position means nothing; to put the main program first, link it in a sentence on the home page.

## Data file `data/impact.json`

The one impact figure and the two ways to help. Themes read it on the home page, on every program page and on the donate page.

| Key | Meaning and format | Example | When blank |
| --- | --- | --- | --- |
| `stat.number` | The single figure the organisation is proudest of, written as it should be read. **Seven characters or fewer** — themes set it very large; write millions as `1.2M`. Never invent or round up a figure the organisation did not give. | `1,142`, `$12,480` | No figure anywhere, whatever `unit` and `verb` hold; the hero is the mission alone. Leave the `stat` key out of the file altogether (a blank `number` means the same). |
| `stat.unit` | What the number counts, one to three words. | `adults`, `meals` | Left out. |
| `stat.verb` | What happened to them, up to about 40 characters. Themes print number, unit, verb in that order, so the three must read as one phrase: "1,142 adults taught to read since 2011". | `taught to read since 2011` | Left out. |
| `donateUrl` | The full `https://` address of the organisation's online giving page (its own page at a payment or fundraising service). Only ever a page that takes money: a petition or sign-up address is a link in the body of the home and donate pages, never here. | `https://give.example.org/pageandchapter` | Every Donate button leads to the site's own `/donate/` page, and that page shows no button. This is the usual case. |
| `donatePrompt` | One short sentence printed beside the Donate button: what a small gift buys. Up to about 60 characters, with a full stop. | `$10 buys a learner's first three books.` | Left out. |
| `volunteerEmail` | One e-mail address for people who want to give time. Themes print it and make it a `mailto:` link on every program page. If the organisation has only one address, use it here as well as on the about page. | `volunteer@example.org` | The program pages link to `/about/` instead. |

A missing file is the same as every key blank.

## Pages

Every site has these three pages in `content/pages/`. The navigation preset links them and themes link `/programs/`, `/about/` and `/donate/` directly, so the URLs must stay; the menu labels may be translated in `data/navigation.json` and the collection label in the site's own `site.config.json`. If a site adds menu entries, Donate stays last — a theme may draw the last entry as a button.

Page frontmatter: `title` (required), `description` (required by rule: one or two plain-text sentences, about 80–160 characters, as for programs — it is the mission text in the hero and the lede on every other page), `draft`, and four keys of this family:

| Key | Format | Meaning |
| --- | --- | --- |
| `hero` | `true` | Turns the page into the mission page: the impact figure, `title` as the mission headline, `description` as the mission text, the Donate button with `donatePrompt`. Use it on the home page only. |
| `heroImage` | image path | An optional photograph for the hero: one person mid-task, not a group shot. Leave it out, or `""`, when there is none. Read only with `hero: true`. |
| `heroAlt` | text | What the photograph shows, for someone who cannot see it. Needed whenever `heroImage` is set; ignored otherwise. |
| `donateCta` | `true` | On a page without `hero`: prints a Donate online button (and `donatePrompt`) between the heading and the body, **only when `donateUrl` is set**. Use it on the donate page. |

- **`index.md` → `/`**, with `hero: true`. `title` is the change the organisation exists to make, in one plain sentence of up to about 70 characters (`Every adult in this city can learn to read here, free`) — never "Home" and not the organisation's name, which is already in the header. `description` says who you are and what you do in one or two sentences. Body, three short sections: what we do (the problem in a number a neighbour would recognise), how it works (what happens to someone who walks in), where the money goes. Link `/programs/` and `/donate/` in sentences. Do not list every program by hand, and do not write "above" or "below": a theme may print the program list after the body.
- **`about.md` → `/about/`**. Who started it and when, who runs it (names and roles in a list), how it answers for the money — a table of shares — and the registration or charity number. **Required content:** how to reach the organisation — every one of address, phone (`tel:` link) and e-mail (`mailto:` link) that the organisation gave, and at least one link — because this is where "Get in touch" leads when `volunteerEmail` is blank. Leave out what it did not give; never invent one.
- **`donate.md` → `/donate/`**, with `donateCta: true`. **Required content:** how to give without the button — the ways the organisation named (bank transfer, cheque, in person) — and an e-mail or phone link for questions, because this is where every Donate button leads when `donateUrl` is blank. If it named no way to give, write that details are sent on request, with the `mailto:` or `tel:` link. Open with a table of what a gift buys, when the organisation gave the sums, then other ways to help. If the organisation takes no money (a petition, a candidate who wants leaflets delivered), leave `donateUrl` and `donatePrompt` blank, give the page a `title` that names the real ask (`Add your name`), and open it with that link. The page and its URL stay: every theme's button still says its own word for Donate and leads here.

News — an annual report, an appeal, an open day — goes in the universal `posts` collection. A post is `content/posts/<slug>.md` → `/blog/<slug>/`, with `title` (required), `date` (required, `YYYY-MM-DD`: the day the news is published), `description`, and optionally `tags` (a list of short words), `cover` (an image path; leave it out) and `draft`. Posts are listed at `/blog/`, newest first. Write an event's own day in the title or body, never as `date`. The menu does not link the list; link a post from the home page when it matters. A new site needs no posts.

**Tables.** In this family a table is where the sums are shown. Put the figure — a gift, a share, a year — in the **first column** and keep it to 12 characters or fewer; themes set that column as large figures on one line. The explanation goes in the later columns. This holds for every table in a page, a program or a post. If the first column cannot be a figure or a label of 12 characters or fewer (`Tuesdays`, `2024`, `€25`), use a list instead of a table: session times, opening hours, names and roles.

**Content classes: none.** Pages and programs are plain Markdown — headings, paragraphs, lists, tables, blockquotes, links. Do not write raw HTML with class names; no theme in this family styles any.

## Examples

`content/programs/one-to-one-tutoring.md`

```markdown
---
title: One-to-one tutoring
description: The core program — same tutor, same table, one hour a week, for as long as it takes. Most learners reach everyday reading within eighteen months.
---

This is the heart of everything: one learner, one tutor, one hour a week.

**Who it serves:** any adult, at any starting point, including complete beginners.

**A typical week:** the same tutor at the same table, mornings, evenings and Saturdays. Childcare is available during the busiest sessions.

**What it costs us:** $4 per learner-hour, mostly books, rooms and childcare. The tutoring itself is given free by trained volunteers.
```

`content/pages/index.md`

```markdown
---
title: Every adult in this city can learn to read here, free
description: Page & Chapter is an adult-literacy nonprofit. One-to-one tutoring, no waiting list longer than two weeks, no cost, no judgment.
hero: true
---

## What we do

One in six adults in this city can't read a bus timetable or a prescription label. We pair each one who walks in with a trained volunteer tutor — same tutor, same table, every week.

## How it works

A learner and a tutor meet for an hour a week at the central library. See [our programs](/programs/) for every way in.

## Why it costs money at all

Tutors volunteer. Your money buys books learners keep, room rental and childcare. The [donate page](/donate/) shows where a dollar goes.
```

`content/pages/donate.md`

```markdown
---
title: Donate
description: Where a dollar actually goes — books a learner keeps, room rental, tutor training, and childcare that keeps people coming.
donateCta: true
---

Tutors give the hours. Your money buys everything around the table.

| Gift | What it buys |
| --- | --- |
| $10 | A learner's first three books — theirs to keep |
| $60 | A neighborhood room for a month of evenings |

## How to give

**By check:** made out to Page & Chapter and mailed to 14 Library Row, Millbrook.

**By bank transfer:** email [hello@example.org](mailto:hello@example.org) or call [+1-555-0142](tel:+15550142) and we send the details the same day.
```

`content/pages/about.md`

```markdown
---
title: About Page & Chapter
description: Founded by a librarian in 2011, run by two staff and 160 volunteers, with accounts anyone can read — who we are and how we answer for the money.
---

Page & Chapter started in 2011, when a children's librarian noticed parents memorizing picture books rather than reading them.

## The people

- **Ruth Abara**, founder and director
- **Daniel Osei**, tutor training

## Accountability

Our accounts are filed publicly every year. Of every dollar we were given last year:

| Share | Where it went |
| --- | --- |
| 81¢ | Programs — books, rooms, tutor training, childcare |
| 12¢ | Fundraising |
| 7¢ | Running the organization |

Page & Chapter is a registered 501(c)(3) nonprofit, EIN 00-0000000.

## Get in touch

14 Library Row, Millbrook

[+1-555-0142](tel:+15550142)

[hello@example.org](mailto:hello@example.org)
```

`content/posts/annual-report-2025.md`

```markdown
---
title: Annual report 2025
date: 2026-02-03
description: 212 new learners, 9,400 tutoring hours and where every dollar went — last year on one page.
---

We taught 212 new learners in 2025. The full report is sent on request: [hello@example.org](mailto:hello@example.org).
```

`data/impact.json`

```json
{
  "stat": {
    "number": "1,142",
    "unit": "adults",
    "verb": "taught to read since 2011"
  },
  "donateUrl": "https://give.example.org/pageandchapter",
  "donatePrompt": "$10 buys a learner's first three books.",
  "volunteerEmail": "volunteer@example.org"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` on one line, or `key:` followed by indented `- item` lines for a list (posts' `tags`). No nesting, no multi-line values. Never leave a key with nothing after the colon — leave the key out. Put a value that is only a number, or only `true` or `false`, in double quotes if it is meant as text.
- Dates (posts only) are `YYYY-MM-DD`. Programs have no dates; write "Tuesdays at seven" in the body.
- Images are optional everywhere. Write the site so that it is complete with none: no `cover`, no `heroImage`.
- Contact is `tel:` and `mailto:` links, never a form. A `tel:` href is the number with a leading `+` and digits only; the link text is the number as the organisation prints it.
- Every program, page and post needs a `description`.
- One figure only, in `stat`. Never invent it, and never invent a price, a charity number or a giving address — leave the key blank instead.
- Interface words ("Donate", "Get involved", "All programs") are the theme's. Do not repeat them in content, and do not rely on their exact wording.
- `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract. `data/navigation.json` is written from the preset above.

## Rules for the theme builder

A theme ships the templates `base`, `page`, `post`, `list`, `404` and `program`; the three content templates; a `starter.json` whose `collections` and `navigation` equal the block above, with no `plugins`; no `layouts` in `theme.json`; and a `sample/data/impact.json` with every key.

**Every theme renders**

- **The Donate link**, wherever it appears: `href` is `data.impact.donateUrl` when set, else `/donate/`. Its word comes from `strings`. `donatePrompt` is printed beside it when set.
- **`base.html`**, on every page: `site.title` linking to `/`; the menu from `nav`, with `aria-current` on the current entry; a footer with `site.title`, `site.description` and `data.footer.html` when set.
- **`page.html` with `page.hero`**: the impact figure — `stat.number`, `stat.unit`, `stat.verb`, in that order — only when `data.impact.stat.number` is set (test the number, not the `stat` object); `page.title` as the `h1`; `page.description`; the Donate link with `donatePrompt`; `page.heroImage` with `page.heroAlt` as its alt text, only when `heroImage` is set; then `page.content`. A theme may follow the body with the program list from `collections.programs` — the same cards as the list, and nothing at all when the collection is empty.
- **`page.html` without `hero`**: `page.title` as the `h1`; `page.description` as a lede; when `page.donateCta` **and** `donateUrl` are set, a button to `donateUrl` with `donatePrompt`; then `page.content`.
- **`program.html`**: `page.title`, `page.description`, `page.cover` when set (`alt=""`), `page.content`; a get-involved block holding `volunteerEmail` as a `mailto:` link — or, when it is blank, a link to `/about/` — and the Donate link with `donatePrompt`; a link back to `/programs/`.
- **`list.html`** draws every list on the site: the programs index, the blog index and tag pages. The template cannot tell which one it is; only posts have `item.date`. Each item shows its title linked to `item.url`, its description when set, and its date when it has one. Show the pagination links when `pagination.multiple`, and a line from `strings` when the list is empty.
- **`post.html`** and **`404.html`** as in every family. The 404 links home, to `/programs/` and to the Donate link.
- **In page text:** `a[href^="tel:"]` and `a[href^="mailto:"]`; tables whose first column is a short figure; a blockquote with one paragraph or several.
- Every interface word comes from `strings`, including any text drawn by CSS. No theme emits a `<form>`.

A theme may also list `collections.programs` in its own chrome (the footer, the 404 page). It must not depend on any frontmatter key or data key that is not in this file.

**Every theme tolerates**, with no sideways scroll at 320px and no lost text:

- no `impact.json`; any key blank; `stat` missing, or present with a blank `number` (no figure, no empty box, no stray unit); a `number` with no `unit` or no `verb`. An ornament that carries the figure may stay without it only if it is complete with nothing in it (a rosette with a plain centre); a frame that exists to hold the figure (a scoreboard, a box, a header line) goes with it, and `unit` and `verb` are never printed without `number`;
- a `stat.number` of 10 characters (it may wrap or shrink), a `unit` of 30, a `verb` of 110, a `donatePrompt` of 110, a `volunteerEmail` of 44, a `donateUrl` of 120 with a query string;
- `hero` on a page other than the home page; a hero with no figure, no photograph and no description; `heroImage: ""`; `heroAlt` without a photograph; `donateCta` with a blank `donateUrl` (no button) and on a hero page (ignored);
- a program with a title and description and nothing else, not even a body; a description of 300 characters; no description;
- a title of 3 characters and one of 80, on a program and as the hero headline; an unbreakable word of 40 letters in a title, a table cell or a list;
- one program or forty, ten to a list page, so the last page may hold a single card and position effects (`:nth-child`, CSS counters) restart on each page. Templates cannot count, group, or find the first or last item;
- alphabetical order by character code: position means nothing, so no card is styled as first, last or featured;
- posts with past and future dates, with or without tags or a body. The build does not know today's date; never call anything "upcoming" or "latest";
- body Markdown of any kind: `h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, a long bare URL;
- a site title of 30 characters with an ampersand; four menu entries, or six;
- no image anywhere. Never reserve space for one.

## Deliberately not in the contract

- Declaring `pages` with typed `hero`, `heroImage`, `heroAlt`, `donateCta`: a starter that declares `pages` replaces the site's own definition on apply; the bare keys already work and the editor keeps them.
- A general `email` or `phone` in `impact.json`: `volunteerEmail` is the `mailto:` key, the fallbacks are the `/about/` and `/donate/` pages, and those pages carry the contact links.
- A `volunteerPrompt`: the get-involved wording is the theme's, like every interface word.
- An `order` field on programs: sorting by it would change `sortBy`, which is not an additive change.
- `coverAlt`: a cover is decoration; a picture that says something goes in the body with its own alt text.
- A `when` or `where` field on programs: it belongs in the description or the body.
- "Programmes" for "Programs": a rename. A site changes the label in its own `site.config.json` and `data/navigation.json`.
- A registration-number key and a sample `footer.json`: the trust line goes in the site's `data/footer.json` and on the about page.
- A `layouts` entry for the mission page: `hero: true` already works; a layout would be a second way to say the same thing.
- A short form of the figure (`stat.numberShort`): the seven-character rule above does the job with no new key.
