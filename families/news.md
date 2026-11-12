# Family contract: news

For anything that publishes dated reports under its own name: a local paper, a community newsletter, a parish or school magazine, a club or company bulletin. The site is a front page that ranks the newest stories by type alone, a page per story, and two standing pages — who we are, how to reach us.

Contract source: `themes/gazette`, the family's one shipped theme. No sibling is planned; any theme that joins the family carries exactly the contract below, so a site switches with no content change.

```json
{
  "family": "news",
  "title": "News and magazine",
  "collections": {
    "stories": {
      "path": "content/stories",
      "urlPattern": "/stories/:slug/",
      "template": "story",
      "listUrl": "/news/",
      "listTemplate": "front",
      "label": "News",
      "sortBy": "date",
      "sortOrder": "desc",
      "pageSize": 12,
      "rss": true,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "section", "type": "select", "options": ["News", "Business", "Culture", "Sport", "Opinion"] },
        { "name": "standfirst", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "byline", "type": "text" },
        { "name": "cover", "type": "image" },
        { "name": "featured", "type": "boolean", "default": false },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Front page", "url": "/news/" },
    { "label": "About", "url": "/about/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {},
  "templates": ["story", "front"],
  "layouts": [],
  "contentTemplates": ["page.md", "story.md"],
  "contentClasses": []
}
```

Not in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection. It uses one page frontmatter key, `template: front`, on the home page (see Pages). There is no data file and no content class. `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample or to this contract.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/stories/<slug>.md` | one story at `/stories/<slug>/`, a card on `/news/` and on the home page, an entry in `/news/rss.xml` |
| `content/pages/index.md` | the home page `/`: the newest stories, then the page's own words |
| `content/pages/about.md` | `/about/` |
| `content/pages/contact.md` | `/contact/` |

The menu is Front page, About, Contact. Its URLs are fixed, so the page file names are fixed too, in every language. The engine builds `/news/` itself: do not write a page for it. The paper's name is `site.title` and its motto is `site.description`, both in the site's config; themes print them in the masthead of every page. `posts` exist on every site but nothing links to `/blog/`: in this family everything dated is a story.

## Collection `stories`

One item is one report, notice, feature or comment piece: something that happened or will happen, with a date. One file per story in `content/stories/`. The file name is the address, for good: `harbour-car-park-stays-free.md` → `/stories/harbour-car-park-stays-free/`. Use a few words of the headline; never rename a published story and never name one `index.md`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The headline: a sentence with a verb that says what happened. 30 to 90 characters reads best; the newest story's headline is the largest type on the site. | `Harbour car park stays free on Sundays after councillors drop the £2 charge` |
| `date` | date | yes | The day the story is published, `YYYY-MM-DD`. It is printed on the story and decides the order. | `2026-01-12` |
| `section` | select | no | One of the five values below, written exactly, in English on every site. Leave the line out for a paper with no sections. | `News` |
| `standfirst` | text | no | The line printed under the headline: one or two sentences that add to it, never repeat it. Up to about 200 characters. Leave it out and the theme prints `description` there instead; write it only when the printed line should say more than the description does. | `The council voted 7–4 to abandon the Sunday charge after quay traders warned it would empty the market.` |
| `description` | text | always write one | One plain sentence of 60 to 160 characters saying what the story reports, for search results, link previews and the RSS feed. Also the printed line under the headline when there is no `standfirst`. The build warns when it is missing. | `Westhaven council has dropped a planned £2 Sunday parking charge at the harbour by 7 votes to 4.` |
| `byline` | text | no | Who wrote it, as printed: a name, or a desk such as `The Editor`. Names only — the theme adds its own word for "By". Leave out for an unsigned notice. | `Rosa Imrie` |
| `cover` | image | no | Root-relative path of one photograph under `/media/`. Leave the line out when there is no photo — never point at a placeholder. | `/media/2026/01/harbour.jpg` |
| `featured` | boolean | no, default `false` | `true` marks an editor's pick: the theme gives the story more weight than its neighbours. It does not move the story — order is by date alone. Use it on one or two stories at a time. | `true` |
| `draft` | boolean | no, default `false` | `true` keeps the story off the site, the feed and the API. | `false` |

Two more keys work with `cover` and are written by hand (the schema does not declare them, so the editor has no box for them): `coverAlt` — what the photo shows, in a sentence, for readers who cannot see it; `coverCaption` — the caption and credit printed under the photo on the story page.

`section` values. They are fixed keys: themes print them in the site's language, so write them in English exactly as below.

| Value | Use it for |
| --- | --- |
| `News` | What happened or was decided: reports, announcements, notices, minutes, appointments. The default for a report. |
| `Business` | Firms, shops, jobs, money, trade, the organisation's own finances. |
| `Culture` | Arts, music, books, history, events to go to, portraits of people and places. |
| `Sport` | Matches, results, clubs, races. |
| `Opinion` | Signed comment: an editorial, a column, a reader's letter. Anything that argues rather than reports — give it a `byline`. |
| *(none)* | Nothing is printed. Right for a small bulletin that has no sections; then leave it out of every story. |

The body is the story in plain Markdown: short paragraphs, `##` crossheads in a long piece, a `>` quote for one short quotation worth lifting out (themes set it large). No raw HTML. A body may be empty for a one-line notice whose description says it all.

**Order and addresses.** `/news/` lists every story by `date`, newest first; stories with the same date follow in file-name order. Twelve stories make a page, then `/news/page/2/`. The first story on a page is the lead and gets the most room; the author steers that only through dates. The build does not know today's date: a story dated in the future is published at once and leads the page. Every story is also in the feed at `/news/rss.xml`. The heading of `/news/` is the collection's `label` in the site's own config; translate it there.

## Data files

None. `data/navigation.json` is created from the navigation preset. Contact details are written in the Contact page (and the home page) as links.

## Pages

Each page has a `title` and a `description`. On `about.md`, `contact.md` and any other ordinary page the theme prints the title as the heading and the description as the line under it, so do not repeat either in the body. On the home page the description is not printed — it is only for search results and link previews — so what the paper covers must be said in the body.

- **`index.md`** → `/`. It must set `template: front`: the theme then prints the `title` as a small label over the stories, the newest stories (twelve at most, with a link to `/news/` when there are more), and the body under them as a short note. `title` is a label such as `Latest`, not the paper's name. Body: one or two short paragraphs — what the paper covers and who writes it, how to send a tip (a `tel:` and a `mailto:` link), links to `/about/` and `/contact/`. Without `template: front` the home page shows no stories.
- **`about.md`** → `/about/`. Who publishes and writes the paper, who pays for it, how often it appears, the rules it reports under (corrections, anonymity, advertising).
- **`contact.md`** → `/contact/`. One `##` section per reason to write: news tips, letters, corrections, advertising, the postal address and office hours. Every phone number is a `tel:` link and every address a `mailto:` link.

Other pages (advertise with us, subscribe, imprint) are ordinary pages; add them to the menu only if the customer asks.

Page bodies are plain Markdown: headings from `##` down, lists, tables, quotes, links. This family has no content classes: do not write raw HTML with class names in a body; no theme styles it.

## Examples

`content/stories/harbour-car-park-stays-free.md`:

```markdown
---
title: Harbour car park stays free on Sundays after councillors drop the £2 charge
date: 2026-01-12
section: News
standfirst: The council voted 7–4 to abandon the Sunday charge after quay traders warned it would empty the market. The quay road will be resurfaced from the reserve instead.
description: Westhaven council has dropped a planned £2 Sunday parking charge at the harbour by 7 votes to 4.
byline: Rosa Imrie
featured: true
---

WESTHAVEN — Parking at the harbour will stay free on Sundays. Councillors voted 7–4 on Thursday night to drop a proposed £2 charge, three weeks before it was due to begin.

The charge was expected to raise £38,000 a year towards resurfacing the quay road. A survey by the traders’ association found that one Sunday visitor in three would have gone elsewhere.

> Sunday is the day people come down without a reason. Give them a reason to stay away and they will take it.

So said Ted Halloran, who chairs the association. The road closes for the work on 2 March and is due to reopen before Easter.
```

`content/pages/index.md`:

```markdown
---
title: Latest
description: Independent news for Westhaven and the coast around it, reported by people you will meet in the queue at the quay market.
template: front
---

The Westhaven Gazette covers one town and covers it properly: the harbour board and the school gates, the market and the lifeboat station.

Seen something we should know about? Ring the newsdesk on [01632 960123](tel:+441632960123) or write to [newsdesk@example.com](mailto:newsdesk@example.com). Who we are is on the [About](/about/) page; corrections and letters go through [Contact](/contact/).
```

`content/pages/contact.md`:

```markdown
---
title: Contact the newsroom
description: Tips, letters, corrections and advertising — how to reach the four people who make this paper.
---

## News tips

Ring the newsdesk on [01632 960123](tel:+441632960123) or write to [newsdesk@example.com](mailto:newsdesk@example.com). A reporter reads everything, usually the same day.

## Corrections

We publish corrections at the same prominence as the error: [corrections@example.com](mailto:corrections@example.com).

## Find us

14 Chandler Street, Westhaven. The office is open Monday to Friday, 9am to 5pm.
```

## Rules for the author

- Frontmatter is flat: `key: value` lines only in this family. No nesting, no multi-line values, no comments.
- Leave a blank field out. A key with nothing after it (`byline:`) or an empty select (`section: ""`) stops the build. Put a value in double quotes only when it is a bare number or the word `true` or `false` and must stay text.
- Dates are `YYYY-MM-DD`. In a story write the weekday or the date ("on Thursday", "on 2 March"), never "today", "yesterday" or "next week": a story stays at its address for years.
- Images are optional everywhere and most sites have none. The site must be complete without one; never invent an image path.
- Contact is `tel:` and `mailto:` links in page Markdown, never a form. Write the number as people read it and link it in international form: `[01632 960123](tel:+441632960123)`.
- Every story and every page has a `description`.
- `section` values stay in English; everything else is in the site's language.
- File names are lowercase letters, digits and hyphens.
- Report only what the customer told you: no invented quotations, names, numbers or dates. Three real stories are a paper; themes look right with one.

## Rules for the theme builder

`starter.json` carries `collections`, `navigation` and no `plugins`, exactly as in the block (key for key, in order); `theme.json` has no `layouts`; `templates/` adds `story.html` and `front.html` to the universal five; `content-templates/` holds `story.md` and `page.md`; `sample/data/` holds `navigation.json` only. Partials are the theme's own business.

Every theme must render:

- **`base`** — `site.title` linked to `/`; `site.description` when set; the menu; a `<link rel="alternate">` and a visible link for each of `feeds`; `data.footer.html` when the site has it. The meta description is `page.description`, else `page.standfirst`, else `site.description`. No contact block: there is no data to fill it.
- **A story card** (one partial, used by `front` and `list`) — `title` linked to `item.url`; the section; the deck, which is `standfirst`, else `description`, else nothing — no empty element and no gap (a theme may drop the deck from the smaller cards); `byline` when set; the date as `<time datetime="{{ item.date }}">{{ item.dateFormatted }}</time>`; a visible difference when `featured` is true. `cover` is optional on a card, and only when set.
- **`front`** has two callers; tell them apart with `{{#if page.slug}}`.
  - As the list at `/news/`: `page` is `{title, url}`; `page.title` as the `h1`; a card for every item of `items`, in the order given; pagination when `pagination.multiple`; a line from `strings.json` when the list is empty.
  - As the home page's layout (`template: front` on a pages item): `page.title` as the `h1`; the first twelve of `collections.stories` (templates cannot slice, so print them all and hide the rest with CSS); a link to `/news/` shown only when there are more than twelve; then `page.content`.
- **`story`** — the section; `title` as the `h1`; the deck (`standfirst`, else `description`, else nothing — no empty element and no gap); `byline` after the theme's word for "By"; the date in a `<time datetime>`; when `cover` is set, the photo with `alt="{{ page.coverAlt }}"` and `coverCaption` as its `<figcaption>` when set; `page.content`; a link back to `/news/`.
- **`page`** — `page.title` as the `h1`, `page.description` as an intro line when set, `page.content`.
- **`list`** and **`post`** — the universal templates, for `/blog/` and tag pages: `title` linked to `url`, `dateFormatted`, `description`, `cover` only when set; an empty state; pagination.
- **`404`** — a link to `/`.
- **Section** — as `data-section="{{ item.section }}"` for styling, and in words in the site's language: print the theme's five labels (`sectionNews`, `sectionBusiness`, `sectionCulture`, `sectionSport`, `sectionOpinion` in `strings.json`) and reveal the one that matches with CSS. A blank section prints nothing and leaves no gap. A value the theme has no label for is printed as written. No section needs a colour or style of its own.

Every theme must tolerate:

- A story with only `title` and `date` (stories written before `description` was a field have none — the build warns, the page must still look right); a story with only `title`, `date` and `description`; an empty body; any mix of blank `section`, `standfirst`, `description`, `byline` and `cover`; every section value, and none on any story.
- No story, one, two, twelve on a page, thirteen and more (page 2; the home page's cap and link); every story featured, or none. Position effects (`:first-child`, `:nth-child`) restart on each page; a last row of one or two cards must not leave a hole.
- Future dates, dates years apart, several stories on one date.
- A title of 2 characters and of 90; a word of 40 characters with no break in a title (in the lead's largest type too), a deck, a byline or a body, at 320px; a deck of 300 characters; a byline of 90; a description of 260.
- No photo anywhere — the main design, not a fallback; never reserve space for one. A cover on some stories and not others; `coverAlt` and `coverCaption` blank.
- A site title of 30 characters with `&` in it; `site.description` blank or 160 characters long; three menu entries with long translated labels.
- Page and story bodies with `h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, a long bare URL, a 45-character e-mail address and a long phone number as link text.
- No sideways scroll at 320px with any of the above, in both colour schemes.

The build does not know today's date. A theme never writes "today", "breaking", "new" or "this week" into the page in its own words. Turning a printed date into "today" or "yesterday" is optional progressive enhancement in `assets/enhance.js`, read from the `datetime` attribute; with JavaScript off the full date shows. Templates cannot count, group by section or find "the latest in Sport": rank by position alone.

Interface words ("By", "In brief", "All stories", the section labels, the empty-list line) come from the theme's `strings.json` — English keys flat at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks. Two-letter keys are reserved for those blocks, so the word for "By" needs a longer key than `by`. Text drawn by CSS `content:` counts as an interface word and reaches the stylesheet through an attribute filled from `strings`. No theme emits a `<form>`.

## Changes from `themes/gazette`

One additive change:

- `stories` gains `{ "name": "description", "type": "text" }` after `standfirst`. The rules require a description on every story, and the sample, the content template and the build warning already expect one, but without the field the editor offers no place to type it. Optional; existing content already sets it.

Declined:

- `stories.listUrl` set to `/`, or a `layouts` entry for the home page — the first moves every list address and is not additive; `template: front` already works and the admin keeps it on save.
- Declaring `coverAlt` and `coverCaption` as fields — not needed by any rule, and most sites have no photo; the two keys stay as hand-written frontmatter, which every theme reads.
- More `section` options, or a list that differs per starter — a family has one list, and every option costs every theme a label in eight languages. Notices and events are `News` or `Culture`, letters are `Opinion`, and a bulletin with no sections leaves the field out.
- Sections in the menu, with a `tags` field to build section pages — it changes the navigation preset and adds a second way to file a story.
- `data/contact.json` — Markdown links already give `mailto:` and `tel:`; a data file would make every theme carry a contact block.
- Declaring `pages` in the starter — universal, defined by the site.
- Engine and tooling requests (capping a loop, a `latest` list, the description warning falling back to `standfirst`, the preview honouring a page's `template`, a sample setting `site.description`) — not a content contract's business.
