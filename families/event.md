# Family contract: event

The content contract every theme in the `event` family shares. It is new: no shipped theme uses it yet. Planned themes: `vows`, `tombola`, `lanyard`, `advent`, `eulogy`, `wristband`.

```json
{
  "family": "event",
  "title": "Event",
  "collections": {},
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Programme", "url": "/programme/" },
    { "label": "Getting there", "url": "/getting-there/" },
    { "label": "Join us", "url": "/join/" }
  ],
  "plugins": [],
  "data": {
    "event.json": {
      "dateLabel": "",
      "date": "",
      "time": "",
      "venue": "",
      "address": "",
      "entry": "",
      "replyBy": "",
      "replyEmail": "",
      "ticketsUrl": "",
      "peopleLabel": "",
      "programme": [
        {
          "day": "",
          "items": [
            { "time": "", "title": "", "place": "", "note": "" }
          ]
        }
      ],
      "people": [
        { "name": "", "role": "", "note": "" }
      ]
    }
  },
  "templates": ["home"],
  "layouts": ["page", "home"],
  "contentTemplates": ["page.md", "update.md"],
  "contentClasses": []
}
```

Not in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family adds no collection and changes neither universal one. It reads three extra keys in a page's frontmatter: `template`, `showProgramme` and `showPeople` (see Pages).

## What the family is for

One occasion with a date and a place: a wedding, a village fête, a conference, a Christmas market, a memorial service, a small festival. The site is the invitation, the programme, how to get there and how to say you are coming.

One site is one event. **The event's name is the site title** (`site.title` in `site.config.json`): `Anna & Ben`, `Calderbrook Summer Fair`, `Calderbrook Christmas Market`, `Northern Roofing Conference 2026`, `Margaret Holt 1941–2026` (a memorial is named for the person). Keep it under 40 characters; themes print it large.

## Collections

The family has none of its own. The programme and the people are lists in `data/event.json`, written in the order they are shown, so there is nothing to sort and no file per entry.

### `pages` (universal)

One item is one page. `content/pages/<slug>.md` is served at `/<slug>/`; `index.md` is the home page at `/`. Pages are not listed or sorted anywhere.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The page heading. On `index.md` it is the invitation line (see Pages), not the event's name and not "Home". | `Getting there` |
| `description` | text | always write one | One plain sentence, 60 to 160 characters: the intro under the heading and the text in search results. On `index.md` it is used for search results only; name the event, the date and the place in it. The build warns when it is missing. | `By train, by car and on foot, with parking and places to stay.` |
| `template` | extra key | `index.md` only | `home` on `index.md`. Leave it out everywhere else. | `home` |
| `showProgramme` | extra key | no | `true` prints the programme from `event.json` on this page. | `true` |
| `showPeople` | extra key | no | `true` prints the people from `event.json` on this page. | `true` |
| `draft` | boolean | no, default `false` | `true` keeps the page out of the built site. | `false` |

### `posts` (universal)

One item is one update about the event: the programme is complete, the car park has moved, thank you for coming. `content/posts/<slug>.md` is served at `/blog/<slug>/`. All posts are listed at `/blog/`, newest `date` first, ten to a page (`/blog/page/2/`), with a feed at `/blog/rss.xml`. Posts are optional. The menu preset does not link them and the author adds no menu entry: the theme links `/blog/` from every page once a post exists. The heading of `/blog/` is the `label` of `posts` in the site's own config; `Updates` or `News` suits an event better than `Blog`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The headline. | `The coach from the station` |
| `date` | date | yes | The day the update was written, `YYYY-MM-DD` — not the day of the event. A post dated in the future is published at once. | `2026-05-20` |
| `description` | text | always write one | One sentence, 60 to 160 characters: the summary in the list. | `A coach meets the 12:40 train and brings everyone back at midnight.` |
| `cover` | image | no | Leave the line out. | |
| `tags` | list | no | One or two plain words. Each tag gets a list at `/blog/tag/<tag>/`. | `- travel` |
| `draft` | boolean | no, default `false` | `true` keeps the post out of the built site. | `false` |

There are no select fields in this family.

## Data file `data/event.json`

The event's standing facts, the programme and the people. Themes print them on the home page and repeat the date and place on every page, so they are written once, here.

| Key | Meaning and format | Example | When blank |
| --- | --- | --- | --- |
| `dateLabel` | The date as it should be read, written out in the site's language. A range or a phrase for several days. Up to 60 characters. | `Saturday 13 June 2026`, `12–14 June 2026`, `The four Advent weekends` | No date is printed anywhere. Only for an event whose date is not fixed. |
| `date` | The day `dateLabel` names, or the first day of the range it names, `YYYY-MM-DD`, even when the programme has an earlier part such as a welcome evening. Never printed: it is the machine-readable date behind `dateLabel` and feeds an optional countdown. | `2026-06-13` | Nothing changes on the page. |
| `time` | When it starts, or the opening hours. Free text, up to 40 characters. | `2 pm`, `Doors 6 pm, music from 7`, `11 am – 5 pm` | Left out. |
| `venue` | The name of the place. Up to 60 characters. | `Hollin Barn`, `The Green, Calderbrook` | Left out. |
| `address` | The postal address on one line, parts separated by commas. | `Hollin Farm, Moor Lane, Calderbrook HX7 4AB` | Left out. |
| `entry` | What it costs, or what is expected of a guest. One short sentence, up to 120 characters. | `Free entry`, `£12 on the gate, under-12s free`, `Black tie` | Left out. |
| `replyBy` | The day by which to reply or book, as it should be read. The theme puts its own words for "Reply by" in front. | `1 May 2026` | No deadline is printed. |
| `replyEmail` | The one address a guest writes to to say they are coming. The theme makes it a `mailto:` link. Set it only when guests are asked to reply. An organiser's general address is not a reply address: leave this blank and write that address in the body of `/join/`. | `wedding@annaandben.example` | No reply link. Right for a fête, a market or a memorial that needs no reply. |
| `ticketsUrl` | The full `https://` address of an outside ticket or registration page. Set it only when everyone who comes must book there. When tickets are for one part of the event, leave it blank and link the ticket page from the body of `/join/`. | `https://tickets.example.com/calderfest` | The usual case. Calls to action lead to `/join/`. |
| `peopleLabel` | The heading above the people. Up to 40 characters. | `Speakers`, `Line-up`, `Wedding party` | The theme's own neutral words. |
| `programme` | A list of parts, shown in the order written. Each part is `{ "day", "items" }`. | see below | `[]`: no programme is printed, even on a page that asks for it. |
| `programme[].day` | The heading of the part: normally the day, or a part of a day. Up to 40 characters. | `Saturday`, `Day 1 — Thursday 4 June`, `Ceremony`, `Every Saturday` | The part has no heading. Use `""` when the programme is one part. |
| `programme[].items` | What happens in that part, in the order written — write it in start-time order. Never leave it empty; drop the part instead. | | |
| `items[].time` | The start time as the audience writes it, one style for the whole file. Up to 25 characters. | `14:00`, `2 pm`, `from 8 pm` | No time shown; right for an order of service. |
| `items[].title` | What happens. Always filled. 2 to 80 characters. | `Ceremony`, `Dog show`, `Keynote: slate in a wet climate` | — |
| `items[].place` | Where inside the venue: the stage, room, tent or field. Up to 50 characters. | `Main stage`, `Room 2` | Left out. |
| `items[].note` | One or two plain sentences: who is speaking, what to bring. Up to 200 characters. | `Read by Ruth Holt.` | Left out. |
| `people` | The people a visitor should know about, shown in the order written: speakers, acts, the wedding party, readers. Stallholders and exhibitors may be listed the same way (`peopleLabel`: `Stalls`), with the stall as `name` and what it sells as `role`. Sponsors are not people: name them in a body. Each is `{ "name", "role", "note" }`. | see below | `[]`: no people are printed. |
| `people[].name` | The person, band or group. Always filled. | `Dr. Maya Lindqvist`, `The Calder Valley Stompers` | — |
| `people[].role` | What they do at this event, in a few words. Up to 60 characters. | `Keynote`, `Best man`, `Saturday headliner` | Left out. |
| `people[].note` | One or two plain sentences about them. Up to 200 characters. | `Has re-roofed four cathedrals.` | Left out. |

Write every key every time, with `""` for a blank string and `[]` for an empty list. Every value is plain text: no HTML, no Markdown, no links. The file holds at most 60 programme items and 25 people; the platform rejects a data file with more than 500 values. When there is more, keep the main items and the main names in `event.json`, and write the full running order as one Markdown table per day, and the full list of names as a Markdown list, in the body of `programme.md`.

Two words used below:

- **The join link** is `ticketsUrl` when it is set, otherwise `/join/`.
- **The reply block** is the theme's call to action: `entry`, `replyBy`, a `mailto:` link to `replyEmail` and a link to `ticketsUrl`, each only when set. On `home` the invitation already carries `entry`, so the reply block there leaves it out and is absent when the other three are blank. With all four blank there is no reply block anywhere.

## Pages

A site has four pages in `content/pages/`. The slugs are fixed, whatever the site's language: themes and the menu link `/programme/` and `/join/` directly. Translate titles and menu labels, never slugs.

| File | URL | Frontmatter | Body |
| --- | --- | --- | --- |
| `index.md` | `/` | `template: home`; `showProgramme: true` when the programme is short (about 15 items or fewer); `showPeople: true` only when the people are the draw (speakers, a line-up) | `title` is the invitation line: `Together with their families, Anna and Ben invite you to their wedding`; `A service of thanksgiving for the life of Margaret Holt`; `Stalls, teas, a dog show and a raffle drawn at four`. For a public event it is one line saying what there is to come for; it never repeats `site.title` alone. Body: one to three short paragraphs of welcome. The theme prints the event's name, date, time, place, entry and the reply block itself; do not retype them as a list. |
| `programme.md` | `/programme/` | `showProgramme: true`; `showPeople: true` when there are people | What the list cannot say: what happens if it rains, when doors open, that times may change. If there is no programme yet, say when it will be published. |
| `getting-there.md` | `/getting-there/` | — | Train, bus, car, parking, the last ride home, step-free access, places to stay. The theme prints the venue and address on every page; describe the way to the door in words. |
| `join.md` | `/join/` | — | How to reply, book or take part: who is invited, what to tell the hosts, prices as a table, a phone number as a `tel:` link. When `replyEmail` is blank, give the organiser's e-mail address and phone number here. The theme ends the page with the reply block, so do not retype the reply address. |

Anything else the customer mentions is a `##` section on the nearest of the four pages: sponsors and an FAQ on `programme.md`, a gift list, a livestream link and stallholder terms on `join.md`. Write a fifth page only when the customer asks for one; give it any slug and link it from a body, not from the menu.

The theme chooses where the programme and the people sit on a page (before or after the body), so never write "above" or "below".

Page and post bodies are plain Markdown: headings from `##` down, lists, tables, quotes, links. **Content classes: none.** Do not write raw HTML with class names; no theme in this family styles any.

## Examples

`content/pages/index.md`

```markdown
---
title: Together with their families, Anna and Ben invite you to their wedding
description: Anna Holt and Ben Okafor are getting married on Saturday 13 June 2026 at Hollin Barn in Calderbrook.
template: home
showProgramme: true
---

We would love you to be there. The barn is ten minutes from Calderbrook station and there is room to camp in the orchard.

Children are welcome all day. [How to get there](/getting-there/) has the trains and the coach.
```

`content/pages/join.md`

```markdown
---
title: Reply
description: Tell us by 1 May whether you can come, who is coming with you and what you cannot eat.
---

Please tell us three things: who is coming, whether you would like the coach from the station, and anything you cannot eat.

Rather talk? Ring Ruth, Anna's mother, on [01632 960142](tel:+441632960142).

## Presents

Your company is enough. If you insist, there is a fund for the honeymoon; ask Ruth.
```

`content/posts/coach-from-the-station.md`

```markdown
---
title: The coach from the station
date: 2026-05-20
description: A coach meets the 12:40 train at Calderbrook and brings everyone back to the station at midnight.
tags:
  - travel
---

The coach waits outside the ticket office until 12:55. Tell us if you want a seat when you reply.
```

`data/event.json`

```json
{
  "dateLabel": "Saturday 13 June 2026",
  "date": "2026-06-13",
  "time": "2 pm",
  "venue": "Hollin Barn",
  "address": "Hollin Farm, Moor Lane, Calderbrook HX7 4AB",
  "entry": "Dress for a barn: flat shoes and something warm for the evening",
  "replyBy": "1 May 2026",
  "replyEmail": "wedding@annaandben.example",
  "ticketsUrl": "",
  "peopleLabel": "Wedding party",
  "programme": [
    {
      "day": "Friday",
      "items": [
        { "time": "7 pm", "title": "Welcome drinks", "place": "The Fleece, Calderbrook", "note": "For everyone who arrives the night before." }
      ]
    },
    {
      "day": "Saturday",
      "items": [
        { "time": "2 pm", "title": "Ceremony", "place": "The orchard", "note": "In the barn if it rains." },
        { "time": "3 pm", "title": "Tea and cake", "place": "", "note": "" },
        { "time": "6 pm", "title": "Dinner", "place": "The barn", "note": "" },
        { "time": "8 pm", "title": "Ceilidh", "place": "The barn", "note": "The Calder Valley Stompers call every dance." },
        { "time": "Midnight", "title": "Coach back to the station", "place": "", "note": "" }
      ]
    }
  ],
  "people": [
    { "name": "Ruth Holt", "role": "Mother of the bride", "note": "Ask Ruth about lifts, rooms and anything else." },
    { "name": "Sam Okafor", "role": "Best man", "note": "" },
    { "name": "The Calder Valley Stompers", "role": "Ceilidh band", "note": "" }
  ]
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` then indented `- item` lines). No nesting, no multi-line values. A value made only of digits is read as a number and `true` or `false` as a boolean; quote it if it is meant as text (`title: "1926"`). Do not start a value with a quotation mark unless the whole value is quoted. No comments. Leave a blank key out: a key with nothing after it (`cover:`) stops the build. This is the opposite of `event.json`, where every key is always written.
- Dates are `YYYY-MM-DD`: `date` on a post and `date` in `event.json`. Everything a visitor reads (`dateLabel`, `replyBy`, `day`, `time`) is written out as text.
- Images are optional everywhere and the contract has no image a theme needs. Write a site that is complete without one: no `cover`, no pictures in bodies, no "see the photo".
- Contact is `tel:` and `mailto:` links, never a form. The theme builds the `mailto:` link from `replyEmail`; in a body, write any other address as `[fair@calderbrook.example](mailto:fair@calderbrook.example)` and a phone number as `[01632 960142](tel:+441632960142)`.
- Every page and every post has a `description`.
- Write all four pages with exactly the slugs `index`, `programme`, `getting-there` and `join`. File names are lowercase letters, digits and hyphens.
- Do not invent a date, a time, a price or a deadline. Leave the key blank.
- The build does not know today's date. Do not write "next Saturday" or "in three weeks"; write the date. After the event, the site stays as it is until someone edits it.
- `data/navigation.json` is the `navigation` list from the block, a JSON array of `{ "label", "url" }`. The URLs and their order are fixed. Translate the labels, and reword `Join us` to fit the occasion (`Reply`, `Tickets`, `Book a place`, `Attending`). Add no entry for posts. `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract.
- On a site with more than one language, `event.json` is written once, in the site's default language, and the theme prints its date, place and reply lines in that language on every page. In a translated page (`programme.fr.md`, `index.fr.md`) leave out `showProgramme` and `showPeople` and write the programme in that language as a Markdown list in the body.

## Rules for the theme builder

`starter.json` carries no `collections`, and `navigation` and `plugins` exactly as in the block; `theme.json` has `"layouts": ["page", "home"]`; `templates/home.html` ships beside the universal five; `content-templates/` holds `page.md` (with `showProgramme: false` and `showPeople: false` written out, so an editor sees they exist) and `update.md` (a post); `sample/data/` holds `event.json` in the shape above and `navigation.json` (the preset, unchanged), nothing else. The sample is the four pages and two or three posts.

Every theme must render, without JavaScript:

- **`base`**, on every page: `site.title` linked to `/`; the menu from `nav`; `dateLabel` and `venue` when set, in the masthead or the footer; `address` when set, the footer is enough; a link to `/blog/` with a word from `strings` when `collections.posts` is not empty, the footer is enough; `data.footer.html` (raw) when the site has it. A call to action in the masthead is optional; if there is one, it is the join link.
- **`home`**: the invitation — `site.title` as the event's name, `page.title` as the line with it (one of the two is the only `h1`), `dateLabel` (inside `<time datetime="…">` when `date` is set), `time`, `venue`, `address`, `entry` — then the reply block without `entry`, `page.content`, the programme when `page.showProgramme`, the people when `page.showPeople`. `page.description` is not printed on `home`; it stays the meta description.
- **`page`**: `page.title` as the `h1`, `page.description` as the intro, `page.content`, the programme when `page.showProgramme`, the people when `page.showPeople`, and the reply block at the end.
- **The programme**, only when `data.event.programme` is not empty: a heading from `strings`; every part in written order with `day` as a sub-heading when set; every item in written order with `time`, `title`, `place` and `note`, each only when set. Mark it up as lists, not as a table that needs width.
- **The people**, only when `data.event.people` is not empty: the heading `peopleLabel`, or a neutral one from `strings` when it is blank; every person in written order with `name`, then `role` and `note` when set. The programme comes before the people.
- **The reply block**: `entry` (on `page`; on `home` it is printed once, in the invitation); `replyBy` after the theme's words for "Reply by"; at least one `mailto:` link when `replyEmail` is set; a link to `ticketsUrl` when it is set. A `mailto:` link may carry a fixed subject from `strings`, written already URL-encoded; never put `site.title` or any content value in a link's query.
- **`post`**: `page.title`, `page.dateFormatted`, `page.content`, tag links, a link to `/blog/`. **`list`** serves `/blog/` and its tag pages: per item the title linked to `item.url`, `item.dateFormatted` and `item.description`; pagination when `pagination.multiple`; a line from `strings` when empty. **`404`** links to `/` and `/programme/`. The reply block is optional on `post`, `list` and `404`; a theme that shows it there shows it whole, by the same rules.
- Every interface word ("Programme", "Reply by", "Tickets", "Taking part", "Updates") comes from `strings.json` (English keys at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks), in words that fit a wedding and a trade conference alike.

Every theme must tolerate:

- No `data/event.json`; any key missing or blank; an empty `programme`; an empty `people`. Each part of the page is left out with no empty box, label, rule or stray punctuation. With no reply block and no programme the home page is the name, the invitation line and the body, and still looks finished.
- `date` blank, malformed or in the past. The build does not know today's date: a theme never writes "upcoming", "next", "today", a number of days or "has taken place" into the page. A countdown, or a mark on what is over, is optional progressive enhancement driven by `date` alone; with a past, blank or unreadable `date` it does nothing wrong.
- One programme item or sixty; one part or eight; a part with a single item; a part with a blank `day` beside parts that have one; an item with only a `title`; every item without a `time`. Anything drawn across the list (a colour cycle, a width sequence) must look right for any count and may restart in each part.
- `site.title` of 60 characters containing `&`; a `title` or `name` of 2 characters and one of 80; an unbreakable word of 40 characters in a title, a name, a place or a body; an item `time` of 35 characters (`11:00–13:00 und 14:30–16:00 Uhr`), a `day` of 60, a `place` of 60, a `role` of 100, a `note` of 250.
- A `dateLabel` of 60 characters, an event `time` of 70, a `venue` of 60, an `address` of 160, an `entry` of 120, a `peopleLabel` of 40, a 45-character e-mail address, a 120-character `ticketsUrl`.
- No people; one person; twenty-five; a person with only a `name`.
- A menu the owner has edited: five entries with long translated labels (`Anfahrt und Unterkunft`, `Anmeldung und Karten`).
- Posts with past and future dates, with and without tags, and a post with no body.
- Body Markdown of any kind: `h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, a long bare URL.
- No images anywhere. Never reserve space for one.
- All of the above at 320px wide with no sideways scroll, in both colour schemes, and in print.

## Not in the contract

- No `programme` or `people` collection. Data-only collections sort a text `order` field as text (10 before 2) and templates cannot group items under a day; a list in one file keeps the written order and gives every day its heading. The price: the programme has no form in the admin and one wording for every language of a multilingual site.
- No organiser phone, map, coordinates, end date, countdown text, ticket prices, sponsor list, gallery, guest list or reply form. Phone numbers and prices are written in the body of `/join/`.
- No heading key for the programme: the theme's word heads it, and the programme page's own `title` can say "Order of the day" or "Order of service".
- No news block on the home page and no menu entry for posts. Posts live at `/blog/`, which the theme links from every page once there is one.
