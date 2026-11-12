# music — Musician and performer

For acts that play dates: bands, soloists, choirs, orchestras, DJs, comedians and other performers. The site answers three questions — where are you playing, what do you sound like, how do I book you — so the list of shows is the main object and the only collection.

Contract source: `themes/encore`. Themes: `encore` (shipped); `bandstand`, `backpatch`, `squeezebox`, `mixtape`, `drawstop` (planned). Every theme in the family carries exactly the contract below, so a site switches between them with no content change.

```json
{
  "family": "music",
  "title": "Musician and performer",
  "collections": {
    "shows": {
      "path": "content/shows",
      "urlPattern": "/shows/:slug/",
      "template": "show",
      "listUrl": "/shows/",
      "listTemplate": "tour",
      "label": "Shows",
      "sortBy": "date",
      "sortOrder": "desc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "city", "type": "text" },
        { "name": "venue", "type": "text" },
        { "name": "ticketsUrl", "type": "text" },
        { "name": "status", "type": "select", "options": ["On sale", "Sold out", "Free entry"] },
        { "name": "support", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Shows", "url": "/shows/" },
    { "label": "Music", "url": "/music/" },
    { "label": "Press kit", "url": "/press/" }
  ],
  "plugins": [],
  "data": {
    "band.json": {
      "tagline": "",
      "bookingEmail": "",
      "pressEmail": ""
    }
  },
  "templates": ["show", "tour"],
  "layouts": [],
  "contentTemplates": ["press-kit.md", "release.md", "show.md"],
  "contentClasses": []
}
```

Not repeated in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection. Partials are each theme's own business.

## Site settings

The act's name is the site title (`site.title` in `site.config.json`): `The Low Bridge`. Themes print it on every page, so never repeat it as a page or show title. `site.description` is one plain sentence saying what the act is and where it is from; a theme may print it in the footer, and it may be the same sentence as `tagline`. The heading of `/shows/` is `collections.shows.label` in `site.config.json` (`Shows`; `Auftritte` on a German site) — the only thing in the collection a site may change. The menu is `data/navigation.json`, the `navigation` list in the block above.

## Collection `shows`

One item is one date: one performance, in one place, on one day. File `content/shows/<slug>.md`; the file name is the URL: `kellers-basement.md` → `/shows/kellers-basement/`. All shows are listed at `/shows/`, ten to a page (`/shows/page/2/` …). A second night in the same room is a second file.

A regular night (every Thursday at the Plough) is not a show: say it in words on the home page, and add a file only for a night that is special. A date that is not fixed yet cannot be a show, because `date` is required: announce it in words on the home page or in a post, and never invent a day.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | What the night is called: the venue, the event or the occasion — not the act's name and not the date. It is the heading of the show's page. In the list it is the row's headline only when there is no `city`. | `Crane Yard Festival — main stage` |
| `date` | date | yes | The day of the show, `YYYY-MM-DD`. Printed in the site's language. There is no time field: door and stage times go in the body. | `2027-06-12` |
| `city` | text | no | The town, as a fan would say it. It is the row's headline in the list, often in large capitals — keep it to the place name. Left out: the title takes its place. Leave it out for home-town shows of a local act — see the rules below. | `Docklands` |
| `venue` | text | no | The room or site. A street address or the town may follow after a comma. Left out: no venue line. | `The Jericho Rooms` |
| `ticketsUrl` | text | no | Full `https://` address of the page that sells tickets for this show. Left out: no ticket link. | `https://tickets.example.com/jericho` |
| `status` | select | no | One of the three values below, written exactly, in English on every site. Leaving the line out is allowed and common. | `On sale` |
| `support` | text | no | Who else is on the bill, names only. The theme adds its own word for "with". Separate several with commas. Because the word is "with", it also holds the headliner when this act is the support (`support: Dry County` reads "with Dry County"); say who headlines in the body. For a festival or all-dayer, name at most four acts or leave the line out and name the event in `title`. | `Dry County` |
| `description` | text | yes, by rule | One sentence about the night. It is the search and share text and is not printed on the show's page, so the body must stand on its own (it may open with the same sentence). A missing one is a build warning. | `Ninety capacity, ceiling you can touch — doors 19:30.` |
| `draft` | boolean | no | `true` keeps the show off the site. Default `false`. | `false` |

Body: one or two short paragraphs — door and stage times, age limits, the price if tickets are sold on the door, how to get there. The body may be empty.

`status` values:

| Value | Use it when | Themes |
| --- | --- | --- |
| `On sale` | Tickets can be bought in advance now. Set `ticketsUrl` when they are sold online; when they are sold only by phone, at a shop or from the act, leave `ticketsUrl` out and say where to buy in the first line of the body. | The ticket link is the row's main action; the label may be left out when the link is shown, and is printed when there is no `ticketsUrl`. |
| `Sold out` | No tickets are left. `ticketsUrl` may stay; it is ignored. | Mark the show clearly and never offer a ticket link. |
| `Free entry` | Nobody pays. Leave `ticketsUrl` out — unless a free place must be reserved, then set it to the reservation page. | Print the label; show the ticket link if `ticketsUrl` is set. |
| *(left out)* | Everything else: tickets not yet on sale, pay on the door, a private function, a show already played. | No label is printed or marked; show the ticket link if `ticketsUrl` is set. |

There is no "cancelled" or "postponed" value. For a cancelled show, leave out `status` and `ticketsUrl` and say so in the title (`The Crown Rooms — cancelled`) and the body, or delete the file.

Sorting: by `date`, latest first. The build does not know today's date, so the list holds every show in the folder, past and future, and a theme never calls any of them "upcoming". What that means for the author:

- The show furthest in the future is at the top. With more than ten shows, the earliest dates move to `/shows/page/2/` — so an act with more than ten dates ahead has its soonest ones on the second page. Say the next date in words on the home page when that happens.
- Each time the site is updated, delete played shows the act does not want to keep, and remove the `status` and `ticketsUrl` lines from the ones it keeps (a played `Sold out` may stay as a boast).
- An empty folder is fine: the list shows the theme's "no shows" line.

## Data file `data/band.json`

| Key | Format | Meaning | Example | Blank |
| --- | --- | --- | --- | --- |
| `tagline` | string, plain text | One line saying what the act is. Printed under the heading of the shows list; a theme may print it elsewhere too. No HTML, no Markdown. | `Four-piece soul from the wrong end of the river.` | Printed nowhere. |
| `bookingEmail` | string | The address promoters write to. A bare address, no `mailto:`. Printed on every page as a `mailto:` link beside the theme's word for "Bookings". | `bookings@example.com` | The line is left out. |
| `pressEmail` | string | The address for interviews and photo requests, same format. Printed beside the theme's word for "Press". | `press@example.com` | The line is left out. |

Always write all three keys, using `""` for a blank. An act with one address puts it in `bookingEmail`. There is no phone key: a phone number goes on the press page as a `tel:` link.

## Pages

Every site has these three pages; the slugs are fixed, because the menu links `/music/` and `/press/`. A site may add ordinary pages with any other slug (`join.md`, `hire.md`, `impressum.md`): same frontmatter, plain Markdown. Link each from the home page body, or add a menu entry after `Press kit`; keep the menu to six entries.

Page frontmatter: `title` (required), `description` (required by rule; printed as the intro line under the title), `draft`.

| File | URL | Contains |
| --- | --- | --- |
| `content/pages/index.md` | `/` | `title` is the home headline — the news, not "Home" (`Small Hours is out. The spring tour is on sale.`). With nothing new to announce, the title says what the act does and where (`Brass for bandstands, parades and Christmas in Calder Vale`) — never the act's name alone, `Home` or `Welcome`. `description` is a one- or two-sentence pitch. Body: who the act is, what is new, with links to `/shows/`, `/music/` and `/press/`. The home page does not list shows itself. |
| `content/pages/music.md` | `/music/` | One `##` section per release, newest first: the name and year as the heading, a sentence or two, then a list of links to where it can be heard or bought. Links only — no embedded players. An act with no recordings writes its repertoire or set lists here instead. The slug is fixed; the page `title` and the menu label are not. An act with no recordings titles it for what is there (`Repertoire`, `Programmes`, `Watch`) and changes the label in `data/navigation.json` to match. The same holds for `press.md`: the label may be `Book us` or `For promoters` when the act has no press to speak of. |
| `content/pages/press.md` | `/press/` | What a promoter or journalist needs, under `##` headings: the biography in up to three lengths (one line, about fifty words, about two hundred words) — write only the lengths the customer's facts fill, and never invent members, years, awards or quotes; photos — say how to get them (`sent by e-mail on request`), embed none unless the customer supplied files; technical needs, if known; and, last on every site, a contact section with the same addresses as `band.json` as `mailto:` links, plus a `tel:` link if there is a phone. With one address, write one link. |

`/shows/` is generated from the collection; there is no page file for it.

Content classes: none. Page and show bodies are plain Markdown — headings from `##`, lists, tables, blockquotes, links. Do not write raw HTML with class names; no theme in this family styles any. Keep `##` headings to a few words: some themes set them in a narrow column beside the text.

Posts are universal and optional: news such as a release or a new run of dates. File `content/posts/<slug>.md` → `/blog/<slug>/`, listed at `/blog/`, newest first, ten to a page. Frontmatter: `title` (required), `date` (required, `YYYY-MM-DD`), `description` (one sentence, required by rule), `tags` (optional `- item` list), `cover` (optional image path — leave the line out), `draft`. The preset menu does not link the blog: a site with at least one post appends `{ "label": "News", "url": "/blog/" }` to `data/navigation.json`; a site with none leaves the menu alone and writes no post.

## Examples

`content/shows/kellers-basement.md`

```markdown
---
title: Keller's Basement
date: 2027-05-21
city: Northgate
venue: Keller's
ticketsUrl: https://tickets.example.com/kellers
status: On sale
support: Dry County
description: Ninety capacity, ceiling you can touch, the kind of room the songs were built in.
---

Doors at 19:30, Dry County at 20:15, and we play at 21:00 sharp. Over-18s
only. Earplugs are free at the bar.

Keller's is five minutes' walk from Northgate station, down the stairs
beside the bakery. The last train back leaves at 23:40.
```

`content/pages/music.md`

```markdown
---
title: Music
description: Two records and an EP — where to hear them and which one to start with.
---

## Small Hours (2026)

Ten songs recorded in six nights in a disused chapel. Start with *Riverside*.

- [Bandcamp](https://example.bandcamp.com) — buying here pays the band most
- [Spotify](https://open.spotify.com) · [Apple Music](https://music.apple.com)
- Vinyl and CDs at every show
```

`content/pages/press.md` (short: the customer gave facts for one line only)

```markdown
---
title: Press kit
description: Biography, photos and who to write to about The Low Bridge.
---

## In one line

The Low Bridge are a four-piece soul band from Northgate.

## Photos

Press photos are sent by e-mail on request.

## Bookings and press

Dates: [bookings@example.com](mailto:bookings@example.com). Interviews and
photos: [press@example.com](mailto:press@example.com). Or call Ada on
[+44 20 7946 0142](tel:+442079460142).
```

`content/posts/small-hours-is-out.md` (only on a site that posts)

```markdown
---
title: Small Hours is out
date: 2026-10-02
description: The second record is out today, with nine spring dates to follow.
tags:
  - releases
---

Ten songs, six nights, one chapel. Hear it on the [music page](/music/);
the dates are on the [shows page](/shows/).
```

`data/band.json`

```json
{
  "tagline": "Four-piece soul from the wrong end of the river.",
  "bookingEmail": "bookings@example.com",
  "pressEmail": "press@example.com"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` scalars and simple `- item` lists. No nesting, no multi-line values.
- Leave a blank field out: delete the whole line. A key with nothing after it (`city:`) or an empty select (`status: ""`) stops the build. Only `data/band.json` uses `""` for a blank.
- Dates are `YYYY-MM-DD`.
- File names are lowercase a–z, digits and hyphens only; write `ae`, `oe`, `ue`, `ss` for umlauts (`fruehjahrskonzert.md`, not `Frühjahrskonzert.md`). Name a show after its venue or occasion; when the act plays the same room or the same yearly occasion again, add the year (`christmas-concert-2027.md`). Renaming a file changes its URL.
- Images are optional everywhere. The site must be complete with none: no photos of the act, no record sleeves, no posters.
- Contact is `mailto:` and `tel:` links, never a form. Write the `tel:` target as digits with a leading `+`; the visible number may have spaces.
- Every page, every show and every post has a `description`.
- Write `index.md`, `music.md` and `press.md` with exactly those slugs, whatever the site's language. Translate, or reword to fit the act, the titles and the menu labels (in `data/navigation.json`); translate the `Shows` label (`collections.shows.label`). Never change the slugs.
- `status` values stay in English, exactly as listed; the theme prints them in the site's language.
- In the list a row is read as date, headline, venue, and the headline is `city` when it is set, otherwise `title`. An act that travels fills `city` and `venue` so the row makes sense without the title. An act that plays mostly in one town leaves `city` out on its home-town shows, so the occasion (the title) heads the row, and writes the town after the venue (`venue: St Mary's Church, Calder Vale`); it sets `city` only on away dates.
- The menu is the preset above, plus the News entry when the site posts, unless the customer asks for another. `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample.

## Rules for the theme builder

`starter.json` carries `collections`, `navigation` and `plugins` exactly as in the block (key for key, in order); `theme.json` has no `layouts`; `content-templates/` holds `press-kit.md`, `release.md` and `show.md`; `sample/data/` holds `band.json` and `navigation.json` only.

Every theme must render:

- **`tour`** (the list at `/shows/`) — `page.title` as the h1; `data.band.tagline` when set; then every item of `items` in the order given. Per row: the date in a `<time datetime>` holding `item.dateFormatted`; a headline linked to `item.url` — `city` when set, otherwise `title`; a theme may also print `title` as a smaller second line when `city` is set, never in place of it; `venue`, and `support` after the theme's word for "with", each only when set; the status; a ticket link to `ticketsUrl` when it is set and the status is not `Sold out`, whose accessible name includes the title. Templates cannot compare values: emit the link whenever `ticketsUrl` is set and remove it with `display: none` under `[data-status="Sold out"]`, so it is neither visible nor reachable by keyboard or screen reader; where the link is the status mark itself, emit an unlinked twin and show that instead. An empty state from `strings`; pagination when `pagination.multiple`.
- **`show`** — `page.title` as the h1; the date; `venue` and `city`; `support`; the status and the ticket link by the same rules; `page.content`; a link back to `/shows/`. Not `page.description`.
- **Status** — as `data-status="{{ item.status }}"` for styling, and in words in the site's language: print the theme's three labels (`statusOnSale`, `statusSoldOut`, `statusFreeEntry` in `strings.json`) and reveal the one that matches with CSS. `Sold out` must look different without relying on colour alone. A blank status shows nothing. `On sale` beside a visible ticket link may show nothing. A theme may instead print all three labels on every row and mark the matching one with CSS; then a blank status marks none, and `Sold out` carries a second sign besides which box is marked (a struck line, a stamp). A screen reader would read all three, so that set is `aria-hidden` and the matching label is also revealed in a visually hidden element. A value the theme has no label for is printed as written, in the plain style.
- **`page`** — `page.title` as the h1; `page.description` as an intro line when set; `page.content`.
- **`post`** and **`list`** — for sites that post: the blog, tag pages and single posts. Per list item: `title` linked to `url`; `dateFormatted` and `description` each only when set; an empty state; pagination.
- **`404`** — links to `/` and `/shows/`.
- **`base`** — `site.title`; the menu; `bookingEmail` and `pressEmail` as `mailto:` links, each when set, whether or not the other is; `data.footer.html` when the site has it.

Every theme must tolerate:

- a show with only `title`, `date` and `description`; an empty body; any mix of blank `city`, `venue`, `support`, `status` and `ticketsUrl` — a ticket link with no status, a status with no link (`On sale` included), `Free entry` with a link, `Sold out` with a link still set;
- no shows, one show or forty (the list paginates at ten, so a page of the list holds one to ten rows); every show sold out; every show in the past; a list where no show has a `city`, and one where every show has the same `city`;
- an 80-character title, a three-character title, a title that repeats the city or the venue word for word, a 35-character unbreakable word as the title, a 26-character one as the city, a venue that is a full street address, a `support` line naming four acts, a 100-character `ticketsUrl`;
- a 140-character `tagline`, a 60-character e-mail address, `band.json` missing or with all three values blank;
- a menu of two to six entries with reworded or translated labels;
- no image anywhere;
- plain Markdown of any shape in a body: h2–h4, a long `##` heading, nested lists, a wide table, a blockquote, a code block with a long line, a long bare URL.

Past dates: a theme never writes "upcoming", "next", "tonight" or "past" into the built page, and never draws the list in a way that is wrong when half of it has been played. Moving the coming shows to the top, dimming played ones or labelling them is optional progressive enhancement in `enhance.js`; without JavaScript the page is the full list, latest date first, and must read correctly.

Interface words ("Tickets", "with", "Bookings", "Press", the status labels, the empty-list line) come from the theme's `strings.json` — English keys at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks. Text drawn by CSS `content:` counts as an interface word and reaches the stylesheet through an attribute filled from `strings`. No theme emits a `<form>`.

## Changes from `themes/encore`

One additive change:

- `shows` gains `{ "name": "description", "type": "text" }` after `support`. The rules require a description on every show and the sample, the content template and the build warning already expect it, but without the field the editor offers no place to type it. Optional; existing content already sets it.

Declined:

- A `home` template or layout that lists the next shows — templates cannot take "the next few", the build cannot know which are next, and it would add a template to every theme.
- Sorting shows by date ascending, or a `pageSize` on the collection — both change how an existing site's list is ordered or paged; not additive. The cost is known: past ten dates ahead, the soonest are on page 2.
- `Cancelled` and `Postponed` status options — every option costs every theme a rule; the title and body say it.
- `doors` and `price` fields — times and prices are free text that belongs in the body.
- A repeat rule for regular nights, or a show with no date — every theme sorts and prints by `date`; the home page says it in words.
- A `headliner` field, or a field for the occasion — `support` reads "with" either way, and leaving `city` out lets the title head the row.
- `phone` and a `links` list in `band.json` — contact already has two `mailto:` keys; a phone and the listen links live on the press and music pages.
- `tourLine` in `band.json` — `tagline` already fills that line.
- A `soldOut` boolean or a per-option label lookup — the three labels in `strings.json`, revealed by CSS, translate the status with no contract change.
- Declaring `pages` and `posts` in the starter — universal, defined by the site.
- Engine requests (weekday and month parts of a date, marking a menu entry current on child pages, filtering the content-template picker by collection, shooting `/shows/` for the screenshot) — not a content contract's business.
