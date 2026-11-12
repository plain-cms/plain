# Family contract: club

The content contract every theme in the `club` family shares. It is new: no shipped theme uses it yet. Planned themes: `vestry`, `quorum`, `bookbag`, `switchback`, `hydrant`, `jamboree`, `bygones`, `dugout`.

```json
{
  "family": "club",
  "title": "Club and community group",
  "collections": {
    "events": {
      "path": "content/events",
      "urlPattern": "/events/:slug/",
      "template": "event",
      "listUrl": "/events/",
      "listTemplate": "events",
      "label": "What's on",
      "sortBy": "date",
      "sortOrder": "asc",
      "pageSize": 100,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "time", "type": "text" },
        { "name": "place", "type": "text" },
        { "name": "status", "type": "select", "options": ["Open to all", "Members only", "Cancelled"] },
        { "name": "description", "type": "text" },
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
        { "name": "email", "type": "text" },
        { "name": "phone", "type": "text" },
        { "name": "order", "type": "text", "default": "50" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "What's on", "url": "/events/" },
    { "label": "News", "url": "/blog/" },
    { "label": "About", "url": "/about/" },
    { "label": "Join", "url": "/join/" }
  ],
  "plugins": [],
  "data": {
    "club.json": {
      "founded": "",
      "meets": [
        { "day": "", "time": "", "what": "", "place": "" }
      ],
      "joinNote": "",
      "email": "",
      "phone": "",
      "address": ""
    }
  },
  "templates": ["events", "event"],
  "layouts": [],
  "contentTemplates": ["event.md", "person.md", "page.md"],
  "contentClasses": []
}
```

Not in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection. It adds three page frontmatter keys, `showMeets`, `showEvents` and `showPeople` (see Pages). `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample or to this contract.

## What the family is for

Membership and community bodies run by volunteers or a small office: sports clubs, societies, congregations, schools, councils, scout groups, fire brigades. The site answers three questions — what is on, who do I ask, how do I join or take part — from dated events, a list of people and one file of standing facts.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/events/<slug>.md` | one event at `/events/<slug>/`, and a row on `/events/` |
| `content/people/<slug>.md` | one person in the people list; no page of its own |
| `content/posts/<slug>.md` | one news item at `/blog/<slug>/`, listed on `/blog/` |
| `content/pages/index.md` | the home page `/` |
| `content/pages/about.md` | `/about/` |
| `content/pages/join.md` | `/join/` |
| `data/club.json` | the regular week, and the contact details printed on every page |
| `site.config.json` | `site.title` is the body's name, printed on every page; `site.language` is the site's language; the `label` of `events` and of `posts` is the heading of `/events/` and of `/blog/` |

The menu is Home, What's on, News, About, Join. Its URLs are fixed, so the three page file names are fixed too, in every language. The engine builds `/events/` and `/blog/` itself: do not write pages for them.

## Collection `events`

One item is one dated occasion: a match, a service, a meeting, a talk, a camp, an open day. One file per occasion in `content/events/`. The file name is the address: `agm-2027.md` → `/events/agm-2027/`. Put the year in the file name of anything that happens every year. Never name an event `index.md`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | What the event is called on a poster. Say which team or section in the title; there is no field for it. Aim for 2 to 80 characters. | `Under-12s v Oakfield Rovers` |
| `date` | date | yes | The day it happens, `YYYY-MM-DD`. For an event of several days, the first day. | `2027-03-12` |
| `time` | text | no | When it starts, as the club writes it. Free text: it may hold the end, or the span of a weekend. One style for the whole site; best under 25 characters. A time written with a dot and nothing else (`19.30`) must be quoted: `time: "19.30"`. | `7.30 pm`, `10:00–16:00`, `Fri 18:00 to Sun 15:00` |
| `place` | text | no | Where, in a few words. Directions go in the body. | `Clubhouse, Mill Lane` |
| `status` | select | no | Who may come, or that it is off. See below. | `Members only` |
| `description` | text | always write one | One sentence of 60 to 160 characters: what happens and who it is for. Shown on the event page and in search results; themes may show it in the list. The build warns when it is missing. | `Reports from the chair and treasurer, then the election of next year's committee.` |
| `draft` | boolean | no, default `false` | `true` keeps the event off the site. | `false` |

`status` options, written exactly so, in English (themes print them in the site's language):

- `Open to all` — anyone may turn up: the public, guests, people thinking of joining.
- `Members only` — for the body's own people: members, pupils and parents, the congregation, councillors.
- `Cancelled` — called off. Keep the file, so that people who saw the event learn it is off; say why in the description. For a new date, change `date` instead.
- No `status` line — nothing is said. Right for a fixture, a service, a term date.

In the site editor the Status box cannot be left empty: an event saved there gets `Open to all` unless another option is chosen. Check the box at every save; to say nothing again, delete the `status` line in the file.

A site may reword what a theme prints by adding a key to its own `data/strings.<lang>.json` (`<lang>` is `site.language`): `statusMembers` for a school (`Parents and pupils`), `joinLink` for a body nobody joins (`Get involved`). The value in the event file stays `Members only`.

The body is optional: what to bring, how to get there, who to tell that you are coming (a `mailto:` or `tel:` link). An agenda goes in the body as a list; minutes and other papers are a post, or a link in the body to a file under `/media/`.

**Order.** `/events/` lists every event in the folder by `date`, earliest first, like a printed programme; two events on one day follow in file-name order (`time` is text and is not sorted). Up to 100 events are one page, then `/events/page/2/`. The build does not know today's date: a past event stays in the list, above the coming ones, until its file is deleted or set to `draft: true`. Clear out last season when you add the next.

## Collection `people`

One item is one person a visitor may need to find: committee, clergy, staff, coaches, councillors. One file each in `content/people/`. A person has no page and no URL; the list appears on every page that sets `showPeople: true`. Leave the body empty: themes do not print it.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The person's name as it should be read. | `Priya Nair` |
| `role` | text | no | What they do for the body, in a few words. | `Club secretary` |
| `email` | text | no | One address. Themes make it a `mailto:` link. Publish only what the person agreed to. | `secretary@thornburycc.example` |
| `phone` | text | no | Same format as `phone` in `club.json`. Themes make it a `tel:` link. | `01632 960155` |
| `order` | text | no, default `50` | Position in the list: a two-digit number from `10` to `99`, lowest first. Leave gaps (`10`, `20`, `30`). People with the same number, or none, follow in file-name order. One-digit and three-digit numbers sort wrongly. | `20` |
| `draft` | boolean | no, default `false` | `true` leaves the person out. | `false` |

## Collection `posts` (universal, unchanged)

One item is one notice or piece of news: a result, a letter to parents, a change of hall. `content/posts/<slug>.md` is served at `/blog/<slug>/`; `/blog/` lists them newest `date` first, ten to a page (`/blog/page/2/`), with a feed at `/blog/rss.xml`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The headline. | `Winter nets move to the sports hall` |
| `date` | date | yes | The day it was written, `YYYY-MM-DD` — not the day of the event it reports. A post dated in the future is published at once. | `2026-10-28` |
| `description` | text | always write one | One sentence of 60 to 160 characters: the summary in the list. | see the example |
| `tags` | list | no | One or two plain words. Each tag gets a list at `/blog/tag/<tag>/`. | `- nets` |
| `cover` | image | no | A path under `/media/`. Leave the line out when there is no picture. | `/media/2026/10/sports-hall.jpg` |
| `draft` | boolean | no, default `false` | `true` keeps the post off the site. | `false` |

## Data file `data/club.json`

The standing facts. Themes print the contact details on every page, so they are written once, here.

| Key | Format | Meaning | Example |
| --- | --- | --- | --- |
| `founded` | string | One short line printed as written beside the name (`site.title`): include the word, the theme adds none. | `Founded 1887` |
| `meets` | list of `{ "day", "time", "what", "place" }` | The regular week: training nights, service times, office hours, meetings that repeat. One row per line of the notice, in the order to show them. It holds no dates. Shown on pages that set `showMeets: true`. | |
| `meets[].day` | string | When it repeats, in full, in the site's language. Free text. | `Tuesday`, `First Monday of the month` |
| `meets[].time` | string | Start time or span, as in an event's `time`. | `6.30 pm` |
| `meets[].what` | string | What happens and for whom. Every row has one. | `Junior coaching, ages 8 to 15` |
| `meets[].place` | string | Where, in a few words. | `Mill Lane ground` |
| `joinNote` | string, plain text | How to join or take part, in one or two sentences. No HTML, Markdown or links. | see the example |
| `email` | string | The body's one public address. Themes make it a `mailto:` link. | `secretary@thornburycc.example` |
| `phone` | string | The number as a caller reads and dials it: digits, an optional leading `+`, spaces or hyphens. No words, brackets or slashes; themes put the same string after `tel:`. | `01632 960155` |
| `address` | string | Where the body meets or receives post, on one line, parts separated by commas. Do not start it with the body's name: `site.title` is already on every page. | `Mill Lane, Thornbury TH4 2QP` |

Blank values: a blank `founded`, `joinNote`, `email`, `phone` or `address`, a blank `day`, `time` or `place` in a row, or an empty `meets` list (`[]`) is left out with no gap, label or heading. With neither `phone` nor `email`, themes link to `/join/` instead. A site with no `club.json` still builds and looks finished.

## Pages

Three pages are fixed, each with a `title` and a `description`. Three optional frontmatter keys switch on the family's blocks; any page may set any of them:

| Key | The theme adds to the page |
| --- | --- |
| `showMeets: true` | the regular week from `club.json` |
| `showEvents: true` | every event, in the same rows and order as `/events/`, on one page however many there are |
| `showPeople: true` | everyone in `people` |

The theme gives each block its own heading and decides whether it sits before or after the body, so do not write a heading for it, or "above" or "below". A block with nothing in it is not shown.

- `index.md` → `/`. `title` is the body's headline, not the word "Home". Set `showMeets: true`, and `showEvents: true` when the folder holds up to about forty events. The block is not paged and shows them all, so with a longer programme leave it off: the menu already links What's on. Body: one to three short paragraphs on who you are and who is welcome.
- `about.md` → `/about/`. History, what the body does, the ground, hall or building. Set `showPeople: true`.
- `join.md` → `/join/`. Who may join, what it costs (a table), how to start. `showMeets: true` suits it. Do not retype the address, phone or e-mail as a list: every page already shows them.

For a body nobody joins, `/join/` is the page for how to take part, and its menu label is reworded in `data/navigation.json` (the URL stays `/join/`): a school writes Admissions; a church, New here? or Visit us; a council, Get involved (speaking at a meeting, standing for election, writing to the clerk). `joinNote` follows suit: one or two sentences on how to take part. Never describe a membership that does not exist.

Other pages (hall hire, safeguarding, policies, a legal notice) are ordinary pages at `/<file-name>/`. The menu preset does not list them: link them from the body of `about.md` or `index.md`, and add a menu entry only if the customer asks. They may set the three `show…` keys too.

Notices and news are `posts`, listed at `/blog/`. The heading of `/blog/` and of `/events/` is each collection's `label` in `site.config.json`: set the `posts` label to `News` (or its translation), so that the heading matches the menu. The menu labels are in the site's `data/navigation.json`. Translate or reword them there.

Page bodies are plain Markdown: headings from `##` down, lists, tables, quotes, links. This family has no content classes: do not write raw HTML with class names in a body; no theme styles it.

## Examples

`content/events/agm-2027.md`:

```markdown
---
title: Annual general meeting
date: 2027-03-12
time: 7.30 pm
place: Clubhouse, Mill Lane
status: Members only
description: Reports from the chair and treasurer, the election of next year's committee and the vote on subscriptions.
---

The agenda and last year's minutes are pinned up in the clubhouse from 1 March.

Motions reach the secretary by 26 February: [secretary@thornburycc.example](mailto:secretary@thornburycc.example).
```

`content/people/priya-nair.md`:

```markdown
---
title: Priya Nair
role: Club secretary
email: secretary@thornburycc.example
phone: 01632 960155
order: 20
---
```

`content/posts/winter-nets-2026.md`:

```markdown
---
title: Winter nets move to the sports hall
date: 2026-10-28
description: From 3 November senior nets are on Tuesdays at 7 pm in the Thornbury School sports hall, until the ground reopens in April.
tags:
  - nets
---

Bring indoor shoes. The hall charges £3 a head, paid on the night. Junior coaching starts again in January.
```

`content/pages/index.md`:

```markdown
---
title: Village cricket on Mill Lane since 1887
description: Thornbury Cricket Club runs two Saturday sides, a Sunday friendly eleven and junior coaching for ages 8 to 15.
showMeets: true
showEvents: true
---

We play in the County League from April to September and net indoors all winter. New players of any standard are welcome, and so is anyone who would rather score, umpire or make the teas.
```

`data/club.json`:

```json
{
  "founded": "Founded 1887",
  "meets": [
    { "day": "Tuesday", "time": "6.30 pm", "what": "Senior nets", "place": "Mill Lane ground" },
    { "day": "Friday", "time": "5.30 pm", "what": "Junior coaching, ages 8 to 15", "place": "Mill Lane ground" },
    { "day": "Saturday", "time": "1 pm", "what": "League matches, April to September", "place": "" }
  ],
  "joinNote": "Come to any Tuesday net session or write to the secretary. The first month is free.",
  "email": "secretary@thornburycc.example",
  "phone": "01632 960155",
  "address": "Mill Lane, Thornbury TH4 2QP"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists. No nesting, no multi-line values, no comments.
- Leave a blank field out. A key with nothing after it (`time:`) or an empty select (`status: ""`) stops the build.
- A value that is only a number — digits, with at most one dot — is read as a number: `phone: 01632960155` loses its leading zero and `time: 19.30` is printed as 19.3. Put such a value in quotes (`time: "19.30"`, `phone: "01632960155"`) or write it so that it is not a bare number (`19:30`, `19.30 Uhr`, `7.30 pm`, `01632 960155`). Do not start a value with a quotation mark unless the whole value is quoted.
- Dates are `YYYY-MM-DD`. Never write "next", "upcoming" or "this week" about a dated event: the page is not rebuilt when the day passes.
- Images are optional everywhere. The site must be complete with none.
- Contact is `tel:` and `mailto:` links — the ones the theme builds from `club.json` and `people`, and any you write in a body as `[01632 960155](tel:01632960155)`. Never a form.
- Every page, post and event has a `description`.
- File names use only `a`–`z`, digits and hyphens: no accents, no spaces, no capitals. Write `ä` as `ae` or `a`, `é` as `e`, `ß` as `ss` (`petra-mueller.md`). The name with its accents goes in `title`.
- Do not invent events, times, names or contact details. A person with only a name and a role is complete.

## Rules for the theme builder

`starter.json` carries `collections`, `navigation` and `plugins` exactly as in the block; `theme.json` has no `layouts`; `templates/` adds `events.html` and `event.html` to the universal five; `content-templates/` holds `event.md`, `person.md` and `page.md` (the last with `showMeets: false`, `showEvents: false` and `showPeople: false` written out after `title` and `description`, so whoever edits the file by hand or by agent sees they exist; the site editor keeps these keys but does not show them); `sample/data/` holds `club.json` and `navigation.json` only. Partials are the theme's own business.

Every theme must render:

- **`base`** — `site.title` linking to `/`; the menu; `data.footer.html` when the site has it; and on every page (the 404 may skip it) the club card from `data.club`: `founded`, `joinNote`, `email` as a `mailto:` link, `phone` as a `tel:` link, `address`. Where each part sits is the theme's choice. A join link, if the theme has one, goes to `/join/` and takes its words from the `joinLink` key of `strings.json`, so a site can reword it.
- **An event row** (one partial, used by the list and the block) — `title` linked to `item.url`; the date as `<time datetime="{{ item.date }}">{{ item.dateFormatted }}</time>`; `time`, `place` and `status`, each only when set. `description` is optional in a row.
- **`events`** (the list) — `page.title` as the `h1`; a row for every item in `items`, in the order given; pagination when `pagination.multiple`; a line from `strings.json` when the list is empty.
- **`event`** — `title` as the `h1`, the date, `time`, `place`, `status`, `description`, the body, and a link back to `/events/`.
- **`page`** — `page.title` as the `h1`; `page.description` as an intro line when set; the body; and, when the key is true and there is something to show, the blocks in this order: the regular week (`data.club.meets`: `day`, `time`, `what`, `place` per row, in the written order), the events (`collections.events`, every item, same rows as the list, with a link to `/events/`), the people (`collections.people`: `title`, `role`, `email` as `mailto:`, `phone` as `tel:`).
- **`list`** — serves `/blog/` and tag pages: `title` linked to `url`, `dateFormatted`, `description`, and `cover` only when set; an empty state; pagination.
- **`404`** — links to `/` and `/events/`.
- **Status** — as `data-status="{{ item.status }}"` for styling, and in words in the site's language: print the theme's three labels (`statusOpen`, `statusMembers`, `statusCancelled` in `strings.json`) and reveal the matching one with CSS. `Cancelled` must look different without relying on colour alone, and the title stays readable. A blank status shows nothing. A value the theme has no label for is printed as written, in the plain style.

Every theme must tolerate:

- Blank `time`, `place`, `status`; an event with an empty body; an event with only `title`, `date` and `description`.
- One event or forty in the list, more than a hundred (the list pages; the events block on a page does not, and may hold more than a hundred rows), none; every event in the past, every event on one day; dates years apart.
- No person, one or thirty; a person with only a name; a 90-character `role`; a 40-character e-mail address.
- No `club.json`, any key blank, one `meets` row or twelve; a `day` of 35 characters that is not a weekday; a `time` of 40 characters in an event or a row (it wraps, it is never clipped); a `place` of 100.
- A `founded` line of 80 characters, a `joinNote` of 300, a phone number of 25, an `address` of 150.
- A title of 80 characters and one of two; a `description` of 260; a word of 40 characters with no break in a title, `what`, `role` or body.
- All three blocks on one page, and a key set to true with nothing to show (no empty box, no orphan heading).
- Five menu entries with long translated labels; plain Markdown of any shape in a body (`h2`–`h4`, nested lists, a wide table, a blockquote, a code block with a long line, a long bare URL); posts with and without `cover` and `tags`.
- No sideways scroll at 320px with any of the above, in both colour schemes. No images anywhere; never reserve space for one.

The build does not know today's date. A theme never writes "upcoming", "next", "today" or "this week" into the page; the headings of the event and regular-week blocks are neutral words from `strings.json` ("Dates", "Programme", "Regular times"). A design drawn across the whole list — a path, a card, a drawer — must hold for one row or a hundred, past or future, and may restart on page 2. Do not hide rows with CSS, and print no counts, group headings or "first" and "last" markers: templates cannot compute them. Dimming or hiding past rows is optional progressive enhancement in `assets/enhance.js`, read from the `datetime` attribute. `date` is only the first day of an event that may run for several, so a script may dim a row from the day after its date but may hide it only once the date is more than seven days past; with JavaScript off every row shows.

Interface words come from the theme's `strings.json` — English keys at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks — never from the contract's data.

## Not in the contract

- No end date: `time` is free text and holds the span. No team, section or category field: it goes in the title.
- No further statuses (postponed, fully booked), no booking or ticket link, no results or scores, no map, no member login, no fees data: these are body text or are left out.
- No pages, photos or biographies for people.
- No home-page layout: `index.md` is an ordinary page with two keys set.
- No opening hours beside `meets`: office hours are rows of the regular week.
- No content classes and no second data file.
