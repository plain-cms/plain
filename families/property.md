# Family contract: property

The content contract every theme in the `property` family shares, so a site can change theme with no content change. Source: `themes/keys`, reused verbatim, with two additive changes: `status` gains four options after the original three, and `listings` gains an optional `description` field. A site written for the old contract builds and looks the same.

```json
{
  "family": "property",
  "title": "Property, accommodation and rental",
  "collections": {
    "listings": {
      "path": "content/listings",
      "urlPattern": "/listings/:slug/",
      "template": "listing",
      "listUrl": "/listings/",
      "listTemplate": "listings",
      "label": "Listings",
      "sortBy": "date",
      "sortOrder": "desc",
      "pageSize": 9,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "price", "type": "text" },
        { "name": "status", "type": "select", "options": ["For sale", "Under offer", "Sold", "To let", "Let agreed", "Available", "Booked"] },
        { "name": "beds", "type": "text" },
        { "name": "baths", "type": "text" },
        { "name": "area", "type": "text" },
        { "name": "address", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "cover", "type": "image" },
        { "name": "photos", "type": "list" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Listings", "url": "/listings/" },
    { "label": "About", "url": "/about/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {
    "agency.json": {
      "name": "",
      "phone": "",
      "email": "",
      "hours": ""
    }
  },
  "templates": ["listing", "listings"],
  "layouts": [],
  "contentTemplates": ["listing.md", "page.md"],
  "contentClasses": []
}
```

## What the family is for

Anyone with a handful of places to sell, let or stay in: estate agents, letting agents, landlords, housebuilders, land agents, guest houses, holiday cottages and campsites. Each place is one listing with a price, a few facts and a way to ask about it by phone or e-mail; there is no booking system and no availability calendar.

## Files the author writes

- `content/pages/index.md`, `about.md` and `contact.md`
- `content/listings/<slug>.md`, one per place
- `data/agency.json`
- `data/navigation.json`: the four entries of the preset in the block above, same URLs, same order, with the labels in the site's language, e.g. `[{ "label": "Start", "url": "/" }, { "label": "Angebote", "url": "/listings/" }, { "label": "Über uns", "url": "/about/" }, { "label": "Kontakt", "url": "/contact/" }]`. A label may be another word that fits better (a guest house's "Rooms").

The heading of the list is the `label` of the `listings` collection in the site's `site.config.json`, "Listings" by default. Set it to the same word as the menu label; it is the only key of the collection a site may change. This contract does not cover `data/footer.json` or `data/strings.*.json`: do not write them. The site title and language are set in `site.config.json` by whoever creates the site.

## Collection `listings`

One item is one place a visitor can buy, rent or stay in: a house, a flat, a plot, a room, a cottage, a pitch.

- The file `content/listings/<slug>.md` becomes the page `/listings/<slug>/`. The file name is the URL: lowercase a–z, digits and hyphens only (`ferienwohnung-elbblick.md`). Never name a listing `index.md`.
- All listings are shown at `/listings/` under the collection's label, "Listings" by default, nine to a page (`/listings/page/2/` and so on).

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | What the place is and where, as a visitor would say it. 2 to 80 characters. | `Two-bed garden flat on Brewery Lane` |
| `date` | date | yes | The day the place went on offer, `YYYY-MM-DD`; when the owner does not give it, the day the site is written. It sets the order of the list, and a theme may print it ("Listed 19 June 2026"). | `2026-06-19` |
| `price` | text | no | Shown exactly as written, and set large, so keep it under about 35 characters. Include the currency and, for a let or a stay, the period. Always in double quotes. Leave the line out when there is no price to give. | `"€289,000"`, `"€950 per month"`, `"€85 per night"`, `"from €620 a week"`, `"Price on application"` |
| `status` | select | no | Where the listing stands: one of the seven values below, spelled exactly. Leave the line out when none applies. | `To let` |
| `beds` | text | no | The number of bedrooms: digits only, in double quotes. The theme adds its own word ("2 bed"). It is not the number of people a place sleeps; say that in the description or the body. Leave it out for land, a shop, a garage. Leave it out for a listing that is itself one room (a guest room, a room in a shared house) and say "double", "twin" or "sleeps 3" in the title or description. Leave it out for a studio and say "studio" there. Where homes are counted in rooms (Zimmer, pièces, locali), keep the room count in the title or description and give `beds` only when the number of bedrooms is known. | `"2"` |
| `baths` | text | no | The number of bathrooms, written the same way. Count only bathrooms that belong to this listing; for a shared bathroom leave the line out and say so in the body. | `"1"` |
| `area` | text | no | The size with its unit, shown as written. Keep it under about 20 characters. | `"78 m²"`, `"2.4 ha"`, `"1,250 sq ft"` |
| `address` | text | no | Where it is, on one line, parts separated by commas. Shown as text. A district is enough when the owner does not want the door number published. | `3a Brewery Lane, riverside` |
| `description` | text | always write one | One plain-text sentence of 80 to 160 characters. It is the search and link-preview text, and a theme may print it on the card or under the title. The build warns when it is missing. | `Ground-floor flat with its own front door and a private walled garden, five minutes from the river path.` |
| `cover` | image | no | The path of one photograph under `/media/`: the picture on the card and in link previews. Leave the line out when there is none. | `/media/2026/06/brewery-lane.jpg` |
| `photos` | list | no | Paths of photographs under `/media/`, shown in this order on the listing's page. When `photos` is set, the page shows these and not `cover`, so repeat the cover as the first entry. | `- /media/2026/06/brewery-lane.jpg` |
| `draft` | boolean | no | `true` keeps the listing off the site entirely. Default `false`. | `false` |

**`status` options.** The seven values fall into three states, and a theme styles the state: open, pending, closed.

| Value | State | Use it when |
| --- | --- | --- |
| `For sale` | open | The place can be bought. |
| `Under offer` | pending | An offer has been accepted and the sale is not complete; also a new-build plot that is reserved, or a sale agreed subject to contract. |
| `Sold` | closed | The sale is done. Keep the listing a while as a record, or delete the file. |
| `To let` | open | The place can be rented on a tenancy or lease of months or longer, however the rent is quoted (per month; per week for a student room). |
| `Let agreed` | pending | A tenant has been accepted and has not yet moved in. There is no value for a finished let: once the tenant is in, delete the file or set `draft: true`. Never use `Sold` or `Booked` for a let. |
| `Available` | open | A room, cottage or pitch for a short stay by guests, by the night or week, is taking bookings. It does not promise any particular date is free; say in the body how to ask. |
| `Booked` | closed | It is taking no more bookings for the season or the period the body names. |

Use the sale values only for a sale, the let values only for a tenancy and the stay values only for short stays; the kind of agreement decides, not how the price is quoted. A stay has no pending value: a room on provisional hold stays `Available`. A place not yet on offer, or offered both for sale and to let, has no `status` line.

The values are fixed keys: write them in English exactly as above on a site in any language. The theme shows the word in the site's language. With no `status` a theme shows no flag at all.

**Body.** Markdown. For a sale or a let: the facts (rooms, heating, tenure, deposit, when it is free), the area, and any drawback the owner mentioned. For a stay: how many it sleeps, what is included, arrival and departure, the minimum stay, a price table if prices change with the season, and how to ask about dates. There is no field for any of these. The body may be empty.

**Order.** Newest `date` first; listings with the same date follow in file-name order, A to Z. Nothing drops off the list when its date is old, and a listing dated in the future is shown like any other: the build does not know today's date. When the owner gives no date, use the day the site is written, which is the day the place went on offer here. Places that went on offer on one day (the rooms of a guest house) follow in file-name order. Do not shift a date to reorder the list, and never use a future date to push a listing up: a theme may print the date. To put a place forward, link it from the home page.

## Data file `data/agency.json`

The business's contact details. Themes print them on every page and in the inquiry box under every listing.

| Key | Meaning and format | Example | When blank |
| --- | --- | --- | --- |
| `name` | The business name as on its letterhead. Shown in the footer. | `Harber & Voss` | The site title is used. |
| `phone` | The number to call. It is shown as written **and** used as the `tel:` link as written, so write it dialable: digits, an optional leading `+`, hyphens between groups. No spaces, brackets, slashes or words. | `+353-1-555-0170` | No call link; the inquiry box offers the e-mail link. |
| `email` | One e-mail address. The theme makes it a `mailto:` link. | `hello@harbervoss.example` | No e-mail link. With no phone either, the inquiry box links to `/contact/`. |
| `hours` | When the phone is answered or the office is open: one line of free text, under about 100 characters. | `Mon–Fri 9:00–17:30, Sat 10:00–14:00` | Left out. |

All four keys are strings. A site with no `agency.json` still builds: every inquiry box then links to `/contact/`.

## Pages

Every site has these three pages in `content/pages/`, each with a `title` and a `description`. The navigation preset links them and themes link `/listings/` and `/contact/` directly, so the four URLs must stay. The `title` is the page's `h1` and its browser-tab title. A theme may print the `description` under the title, so write it as a one-sentence standfirst and do not open the body with the same sentence.

- **`index.md` → `/`** The `title` is the home page's headline, a sentence about the business, not "Home". Body: what they offer and how they work, in two or three sentences that do not repeat the description; a link to `/listings/`, which is required because a theme does not print listings on the home page; optionally a hand-written list of links to three or four listings; how to get in touch, with the phone as a `tel:` link and the e-mail as a `mailto:` link.
- **`about.md` → `/about/`** Who runs the business and how they work: the people, the fees or terms, what a viewing or a stay is like.
- **`contact.md` → `/contact/`** Required: the inquiry box leads here when `agency.json` has neither phone nor e-mail. The phone as a `tel:` link and the e-mail as a `mailto:` link; then, each only where the business has one, the office address and how to find the door, and opening hours as a table. Always: how viewings or bookings are arranged. An owner with no office writes when the phone is answered and how to ask about dates.

Phone, e-mail and hours on these pages repeat `data/agency.json`; keep them the same. A site may add more pages (terms, house rules, a legal notice).

A site that wants news adds posts: `content/posts/<slug>.md` becomes `/blog/<slug>/`, with `title` (required), `date` (required, `YYYY-MM-DD`), `description`, and optionally `tags` (a list) and `cover`. Write none unless the owner asks for news. The menu does not link `/blog/`: link it from the home page, or append one entry for it after Contact in `data/navigation.json`. Extra entries are allowed; the four preset URLs must stay.

**Content classes: none.** Pages and listings are plain Markdown: headings, paragraphs, lists, tables, blockquotes, links. Do not write raw HTML with class names; no theme in this family styles any.

## Examples

`content/listings/garden-flat-brewery-lane.md`

```markdown
---
title: Two-bed garden flat on Brewery Lane
date: 2026-06-19
price: "€289,000"
status: For sale
beds: "2"
baths: "1"
area: "78 m²"
address: 3a Brewery Lane, riverside
description: Ground-floor flat with its own front door and a private walled garden, five minutes from the river path.
---

The ground floor of a converted cooperage, with its own front door off the lane and a walled garden that belongs to this flat alone.

**The facts:** two bedrooms, one double and one single; a kitchen-living room with the original beam; 40 m² of garden facing west. Share of freehold, service charge €90 a month.

**The drawback:** the second bedroom takes a single bed and a desk, no more.
```

The same fields for a monthly let and for a room by the night:

```markdown
---
title: One-bed flat over the bakery
date: 2026-09-01
price: "€950 per month"
status: Let agreed
beds: "1"
baths: "1"
area: "51 m²"
address: 27b Chandler Street
description: First-floor flat on Chandler Street with a separate kitchen and a bike store in the yard, free from October.
---
```

```markdown
---
title: The Harbour Room
date: 2026-03-14
price: "€85 per night"
status: Available
baths: "1"
description: A double room on the first floor with its own bathroom and a window over the harbour, breakfast included.
---
```

`content/pages/contact.md`

```markdown
---
title: Contact
description: Call, write or walk in, Monday to Saturday. Viewings are arranged within a day and valuations are free.
---

## Talk to a person

Call [+353-1-555-0170](tel:+353-1-555-0170), Monday to Friday 9:00–17:30 and Saturday 10:00–14:00, or write to [hello@harbervoss.example](mailto:hello@harbervoss.example).

## The office

27 Chandler Street, the green shopfront between the bakery and the bookshop.

| Day | Open |
| --- | --- |
| Monday–Friday | 9:00–17:30 |
| Saturday | 10:00–14:00 |
| Sunday | Closed |
```

`data/agency.json`

```json
{
  "name": "Harber & Voss",
  "phone": "+353-1-555-0170",
  "email": "hello@harbervoss.example",
  "hours": "Mon–Fri 9:00–17:30, Sat 10:00–14:00"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` then indented `- item` lines). No nesting, no multi-line values, no comments. Never leave a key with nothing after the colon; delete the line.
- A value made only of digits is read as a number, so quote `price`, `beds`, `baths` and `area`. Do not use a double quote inside a quoted value.
- Dates are `YYYY-MM-DD`.
- Images are optional everywhere. Write the site so it is complete with none: no `cover:` or `photos:` line, no "see the photos" in the text.
- Contact is `tel:` and `mailto:` links, never a form. Write the phone number the same way everywhere, in the format given for `phone`.
- Every listing, page and post has a `description`.
- `status` values are written in English; everything else is in the site's language.
- Do not invent a price, a size, a status or an availability. Leave the field out instead. `date` is required and cannot be left out: see Order for what to write when the owner gives none.
- Write only the files listed under "Files the author writes", plus posts when the owner asks for news.

## Rules for the theme builder

Ship `templates/listings.html` and `listing.html` beside the universal five, `content-templates/listing.md` and `page.md`, `sample/data/agency.json` with the four keys, no `layouts`, and the collections and navigation exactly as in the block above.

**Every theme renders**

- **`base.html`**, on every page, without JavaScript: `site.title` linking to `/`; the menu from `nav`; `agency.phone` as a `tel:` link; and in the footer `agency.name` (the site title when blank), `hours`, the phone and `agency.email` as a `mailto:` link, each on its own condition.
- **`listings.html`**: the heading from `page.title`; for every item of `items` its `title` linked to `item.url`, `price`, `status`, `beds`, `baths` and `area`. `address`, `description` and `cover` are optional on a card. Pagination when `pagination.multiple`; a line from `strings` when the list is empty.
- **`listing.html`**: `title` as the `h1`, `status`, `price`, `address`, `beds`, `baths`, `area`, the body, `photos` as a gallery or else `cover` (the `alt` is the title), and a link back to `/listings/`. `description` and the date are optional; the date is led by a word from `strings` ("Listed").
- **The inquiry box** on every listing (`listing.html`), on the listings page (`listings.html`) and on every item of `pages` (`page.html`); a theme may also show it on the 404, on posts and on the blog list. In it: `agency.phone` as a `tel:` link and `agency.email` as a `mailto:` link, `hours` when set; with neither phone nor e-mail, one link to `/contact/`. Never a `<form>`. The `tel:` and `mailto:` hrefs use the values as written.
- **Status** as `data-status="{{ item.status }}"` for styling, and in words in the site's language: carry seven labels in `strings.json` (`statusForSale`, `statusUnderOffer`, `statusSold`, `statusToLet`, `statusLetAgreed`, `statusAvailable`, `statusBooked`), print all seven beside the stored value and show the one that matches with CSS:

  ```html
  <p class="status" data-status="{{ item.status }}"><span class="status-raw">{{ item.status }}</span><span data-for="For sale">{{ strings.statusForSale }}</span> … </p>
  ```

  ```css
  .status [data-for], [data-status="For sale"] .status-raw, … { display: none; }
  [data-status="For sale"] [data-for="For sale"], … { display: inline; }
  ```

  Style the three states, not seven values: open (`For sale`, `To let`, `Available`), pending (`Under offer`, `Let agreed`), closed (`Sold`, `Booked`). The word is always printed, so colour only repeats it. A value the theme has no rule for is printed as written, in the open style. A blank status leaves no flag or sticker and no label without a value.
- **`beds` and `baths`** as the value followed by the theme's own word from `strings`; `price` and `area` as written.
- **`list.html`** draws the blog index and tag pages; `page.html`, `post.html` and `404.html` as in every family. The 404 links home and to `/listings/`.
- Every interface word comes from `strings.json`: English keys flat at the top level, one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. The words must be true of a house for sale, a flat to let and a room by the night alike ("Ask about this place", "All listings"), and never make a claim for the business: no "new", "just listed", "on the market", "last one".

**Every theme tolerates**

- `data/agency.json` missing, or any key in it blank: that part is left out, with no empty box, label or stray punctuation.
- A listing with only `title`, `date` and `description`: no price, status, facts, address or body, and no label, unit word, rule or separator left without its value. A design with a fixed slot for each fact (a table row, a window of panes) may keep the slot, empty or holding a dash.
- One listing or forty, nine to a page, so anything drawn across the list (a cycle of shapes or colours, a numbered row) must look right for any count and may restart on the next page. Every listing in one state, a state held by a single listing, no status anywhere.
- Past and future dates, and several listings on one date. Never call a listing new, recent or upcoming.
- A title of 2 characters and one of 85; an unbreakable word of 33 characters in a title; a price of 37 characters (it wraps, it is never clipped); an `area` of 47 characters; an address of 96; a `description` of 260 characters wherever the theme prints one; `beds` written `2–3`.
- A phone number of 21 characters, an e-mail address of 41, `hours` of 100 characters, a `name` of 61, a site title of 29 with `&` in it. The four menu entries relabelled in any language, and a fifth after them.
- Body Markdown of any kind: `h2`–`h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, an `hr`, a long bare URL.
- No images anywhere: the design without photographs is the main design, and no space is ever reserved for one. When there are images, a `cover` of any shape and one to twenty `photos`.
- All of it at 320px wide with no sideways scroll, at WCAG AA contrast in both colour schemes.

## Changes from `themes/keys`

Additive, both optional:

- `status` gains `To let`, `Let agreed`, `Available`, `Booked` after `For sale`, `Under offer`, `Sold`, so letting agents, holiday lets and guest houses share the listing contract.
- `listings` gains `{ "name": "description", "type": "text" }` after `address`. Every listing must have a description and existing content already sets one, but without the field the editor offers no place to type it.

Declined, from the audit of `keys`:

- A `home` layout or a `showListings` switch that prints listings on the home page: a new template and layout for every theme; the home page links to `/listings/` in its own Markdown.
- `coverAlt`: the cover sits beside the title, which is its `alt` on the listing's page; a picture that needs describing goes in the body.
- An `address` key in `agency.json`: the office address is on the contact page, and a cottage owner has no office.
- `phoneHref`: the one `phone` value is written dialable, so there is no second value to drift from it.
- `hours` as a list of rows: that retypes an existing key.
- Declaring `pages` in `starter.json`: it is a universal collection and this family does not change it.
- `data-cta` hooks on the phone and e-mail links: a plugin hook, not content; a theme may add them.
- A `kind` field to tell a listing from a page: a template already knows which one it is.
- A count, equality or "latest" helper in templates, and a choice of screenshot page: engine and tooling, not content.
- An availability calendar, a "sleeps" or amenities field, rates by season: they stay in the body text.
