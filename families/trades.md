# Trades and local services — family contract

For sole traders and small firms who do a job for a price — plumbers, roofers, barbers, garages, driving instructors — whether they come to the customer or the customer comes to them. The site says what they do and what it costs, and exists to make the phone ring.

Every theme in this family reads exactly the content described here, so a site can change theme without changing a content file. The block below is the contract in machine-readable form; the test suite and the theme harness compare every theme of the family against it.

```json
{
  "family": "trades",
  "title": "Trades and local services",
  "collections": {
    "services": {
      "path": "content/services",
      "urlPattern": "/services/:slug/",
      "template": "service",
      "listUrl": "/services/",
      "listTemplate": "list",
      "label": "Services",
      "sortBy": "title",
      "sortOrder": "asc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "description", "type": "text" },
        { "name": "priceFrom", "type": "text" },
        { "name": "included", "type": "list" },
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
    "business.json": {
      "phone": "",
      "hours": "",
      "area": "",
      "email": ""
    }
  },
  "templates": ["service"],
  "layouts": [],
  "contentTemplates": ["service.md", "page.md"],
  "contentClasses": []
}
```

This is the contract of the shipped theme `toolbox`, unchanged, plus one optional key appended to `data/business.json`: `email`, a `mailto:` link for a business with no phone line or a customer who would rather write. A site without it builds and looks as it did.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/services/<slug>.md` | one service at `/services/<slug>/`, and a card on `/services/` |
| `content/pages/index.md` | the home page `/` |
| `content/pages/about.md` | `/about/` |
| `content/pages/contact.md` | `/contact/` |
| `data/business.json` | the phone number, hours, area and e-mail address printed on every page |
| `data/navigation.json` | the menu: write it only to translate the four labels |

The menu is Home, Services, About, Contact. Its four URLs are fixed, so the three page file names are fixed too. A site in another language keeps file names, URLs and field names and translates only the labels: the menu in its own `data/navigation.json` (the four entries of the block above, same URLs, same order, new `label`s), and the heading of `/services/`, which is the `label` of `services` in its own `site.config.json` (`Leistungen`). Nothing else in the collection may be edited. The engine builds `/services/` itself: do not write a page for it.

`pages` and `posts` are the engine's standard collections and are not changed here. A page has `title` (required), `description` and `draft`. `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract.

A site may add more pages (areas covered, a legal notice, terms); they are ordinary pages at `/<file-name>/`, linked from a page body or from a menu entry the site adds after Contact. Posts (`content/posts/<slug>.md`, listed at `/blog/`) are optional: `title` (required), `date` (required, `YYYY-MM-DD`), `description`. The menu does not link `/blog/`; a site that posts links it from the home page or adds a menu entry of its own. Write a post only when the customer gives dated news.

## Collection `services`

One item is one job a customer would ask for by name: "Boiler service", "Gutter clearing", "Skin fade", "MOT test". Six to twelve is usual; one is allowed, and so are forty.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The job, in the customer's words: two to five words. Shown as the card heading and the page heading. | `Boiler service & repair` |
| `description` | text | in practice, yes | One or two plain sentences, about 160 characters at most. Shown under the title on the card and on the page, and used by search engines. The build warns when it is missing. | `An annual service keeps the warranty alive and the heating on.` |
| `priceFrom` | text | no | The lowest price for the job, written as it should appear, with its currency and unit. The theme puts its own word for "from" before it, so do not write "from". A fixed price goes here too (a haircut, an MOT, a lesson): the site then reads "from £18", which is still true. If it matters that the price never rises, say "Fixed price" in the first line of the body. A job priced only by quote has no `priceFrom`: leave the line out. | `£80`, `£38 an hour`, `89 € zzgl. MwSt.` |
| `included` | list | no | What the price covers: three to six short lines, plain text, no Markdown, no full stops. Shown as a checklist on the service page under the theme's own heading. | see the example file |
| `draft` | boolean | no | `true` keeps the item off the site. Default `false`. | `false` |

The body is Markdown: what happens on the visit and what decides the price, under `##` headings. The title and the description are already printed above it, so do not repeat them.

**Order.** Items are sorted by `title`, ascending, by character code: digits first, then A–Z, then a–z, then accented letters (Ä, Ö, Ü, É), so "Ölheizung" comes after "Zähler". There is no other way to order them, and the first item is not more important than the last. To put the jobs in an order of your own, list them in the price table on the home page.

**URLs.** An item's file name is its address: `boiler-service.md` is `/services/boiler-service/`. The list is `/services/`, ten items to a page; an eleventh item starts `/services/page/2/`.

## Data file `data/business.json`

All four keys are strings and all are optional. Keep every key in the file and leave a value `""` when there is nothing to say.

| Key | Meaning | Format | Example | When blank |
| --- | --- | --- | --- | --- |
| `phone` | The number customers ring. It is shown as written **and** used as the `tel:` link as written, so write it dialable. | Digits, an optional leading `+`, hyphens between groups. No spaces, brackets, slashes or words. After a `+` and country code, drop the national number's leading 0; if the country is not certain, write the national number as the customer gave it. | `01632-960142`, `+44-1632-960142` | No call button. The theme offers the e-mail address instead, and with no e-mail either, a link to `/contact/`. |
| `hours` | When the phone is answered or the door is open. | One line of text, under about 60 characters. The full week goes in the opening-hours table on the contact page. | `Mon–Sat 7am–6pm` | Left out. |
| `area` | Where the business works, or where to find it. If customers come to you (a shop, a garage), the street address; if you go to them, the district you cover. The other one goes on the contact page. | One line of text, under about 60 characters. | `Calderbrook & 15 miles around`, or `14 Mill Lane, Calderbrook` | Left out. |
| `email` | The address customers write to. | One e-mail address. | `hello@hartleyandson.example` | No `mailto:` link. |

## Pages

All three are plain Markdown. This family has **no content classes**: page text contains no raw HTML and no class names, and a theme must not ask for any. Four Markdown conventions carry the meaning instead, and every theme styles them:

- **A phone number** is a link whose text and target are the number as written in `business.json`: `[01632-960142](tel:01632-960142)`. On the contact page put it on a line of its own. A theme styles every `tel:` link the same way wherever it sits, so a number inside a sentence stays the size of the sentence.
- **An e-mail address** is a link: `[hello@hartleyandson.example](mailto:hello@hartleyandson.example)`.
- **A customer's words** are a blockquote whose last paragraph is who said it. A quotation with no name is one paragraph. Never write a blockquote of several paragraphs without the attribution as its last one, and use a blockquote for nothing but a customer's words.

  ```markdown
  > They found the leak in twenty minutes and gave me the price before touching a spanner.
  >
  > Maria D., Elm Road
  ```

- **Prices and opening hours** are tables. `--:` under a heading right-aligns that column, which is where a price belongs.

`index.md` — the home page. `title` is the headline, a promise rather than the firm's name (the name is already in the header): "Honest plumbing, fixed prices". `description` says who, what and where in one or two sentences. The body: who turns up; a price table of three to six jobs, each linked to its service, then a link to `/services/`; one customer quote; where you work; a closing line with the phone link. See the example below.

`about.md` — who the people are and how long they have been at it, what they promise (firm prices, turning up on time, tidy work, a guarantee), and their qualifications, registrations and insurance.

`contact.md` — the phone link on a line of its own; the e-mail link; an opening-hours table; what to have ready before ringing; the area covered and the address, if customers may visit. Leave out the phone link or the e-mail link when the business has none; the page then opens with the one it has, or with the address and hours. Never a form.

Phone, e-mail, hours and area on these pages repeat `data/business.json`. Keep the two the same.

## Examples

`content/services/gutter-clearing-and-repair.md`

```markdown
---
title: Gutter clearing & repair
description: Blocked or leaking gutters cleared, re-sealed and re-hung, with photos of the roofline before and after.
priceFrom: £95
included:
  - Gutters and downpipes cleared by hand and flushed through
  - Loose brackets re-fixed and leaking joints re-sealed
  - Photos of anything on the roof that needs watching
  - All the debris taken away
---

A gutter that overflows sends water down the wall instead of down the pipe. Most houses need clearing once a year, after the leaves have dropped.

## How the visit goes

We work from ladders with a stand-off, so nothing leans on the gutter itself. A terraced house takes about an hour, a detached one about two.

## What it costs

The from-price covers a two-storey terraced house, front and back. Three storeys, conservatory roofs and replacement lengths are priced before we start.

> Two hours, no mess, and he showed me photos of a slipped slate I'd never have seen.
>
> Asha P., Holme Cross
```

`content/pages/index.md`

```markdown
---
title: Honest plumbing, fixed prices
description: Hartley & Son are family-run plumbers and heating engineers in Calderbrook. A firm price before we start, tidy work, and a real person on the phone.
---

## Who turns up

Two vans, three plumbers, and one phone number that a real person answers. Gas Safe registered, insured, and tidy.

## What it costs

You hear the price before we pick up a tool, and the number we quote is the number you pay.

| The job | From |
|:--|--:|
| [Gutter clearing & repair](/services/gutter-clearing-and-repair/) | £95 |
| [Boiler service & repair](/services/boiler-service-and-repair/) | £80 |
| [Tap & toilet repairs](/services/tap-and-toilet-repairs/) | £60 |

[See every service and price](/services/)

> They found the leak in twenty minutes and gave me the price before touching a spanner.
>
> Maria D., Elm Road

## Where we work

Calderbrook and everywhere within about fifteen miles of it.

Something dripping right now? Call [01632-960142](tel:01632-960142), Monday to Saturday, 7am to 6pm.
```

Each row links a service that exists; its address is the file name. The figure in a cell is written bare. The word for "from" (or "Price" when the prices are fixed) is the column heading, in the site's language: here it is page text, so the author writes it.

`content/pages/contact.md`

```markdown
---
title: Contact
description: One number, answered by a person. When we're in, where we work, and what to tell us when you ring.
---

## Call us

[01632-960142](tel:01632-960142)

If we're up a ladder we'll ring you back within the hour.

## Write to us

[hello@hartleyandson.example](mailto:hello@hartleyandson.example)

## Opening hours

| Day | Hours |
|:--|:--|
| Monday to Saturday | 7am to 6pm |
| Sunday | Emergencies only |

## Where we work

Calderbrook and about fifteen miles around it.
```

`data/business.json`

```json
{
  "phone": "01632-960142",
  "hours": "Mon–Sat 7am–6pm",
  "area": "Calderbrook & 15 miles around",
  "email": "hello@hartleyandson.example"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` on one line, or `key:` followed by indented `- item` lines for a list. No nesting and no multi-line values. Put a value in double quotes only if it is the bare word `true` or `false`. An optional field with nothing to say is left out altogether. Never write a key with nothing after it: `priceFrom:` on its own stops the build.
- File names are lowercase letters, digits and hyphens. Write `ae`, `oe`, `ue`, `ss` for umlauts in file names; titles keep their real spelling.
- Every service and every page has a `description`.
- There are no dates in this family. A post, if the site keeps a blog, has a `date` written `YYYY-MM-DD`.
- Images are optional everywhere. Write the site so that it is complete with none. A photo the customer supplied goes in a body as `![what it shows](/media/2026/11/van.jpg)`, a root-relative path under `/media/`, with alt text that describes it. Never point at a picture that does not exist.
- Contact is the phone link and the e-mail link. Do not write a form or promise one.
- Write the phone number the same way everywhere, in the format given for `phone`: in `business.json`, and as both the text and the target of every `tel:` link.
- Do not write "from" in `priceFrom`, and do not put a sentence there: a price that needs explaining goes in the body.
- Interface words (the label on the call button, "from", "Every visit includes") belong to the theme. Do not repeat them in content. The one exception is the column heading of a price table you write yourself.

## Rules for the theme builder

A theme ships the templates `base`, `page`, `post`, `list`, `404` and `service`; `content-templates/service.md` and `content-templates/page.md`; a `starter.json` whose `collections` and `navigation` equal the block above, with no `plugins`; no `layouts` in `theme.json`; and a `sample/data/business.json` with all four keys. Partials are the theme's own business.

What every theme renders:

- **On every page:** the site title, the menu, one call block, and `data.footer.html`, printed raw, when the site has it. The call block holds `phone` as a `tel:` link, then `hours` and `area` when set. With `phone` blank its main link is `mailto:` `email`; with both blank it links to `/contact/`. When both are set, `email` is still printed as a `mailto:` link in the call block or the footer. The number must be reachable with JavaScript off.
- **The `tel:` link:** the href is `tel:{{ data.business.phone }}`, the value as written; the link text is the theme's.
- **`area`** is printed as written. It may be a district or a street address, so the words around it must suit both.
- **`priceFrom`:** the only words a theme sets beside it are its word for "from". The figure may be a fixed price, so nothing near it says "typical", "estimate" or "call for a price".
- **`list`:** each item's `title` as a link to the item, its `description` and its `priceFrom` after the theme's word for "from"; the pagination links when `pagination.multiple`. The same template lists posts if the site keeps a blog, so a card must also work for an item with a date and no price.
- **`service`:** `title`, `description`, `priceFrom`, the body, `included` as a list under a heading, a link back to `/services/`, and the call block.
- **`page`:** `title`, `description` as a standfirst, the body.
- **In page text:** `a[href^="tel:"]` and `a[href^="mailto:"]`, styled inline, never as a block or at display size, because CSS cannot tell a link alone in a paragraph from one inside a sentence; a blockquote with one paragraph, and with several, the last one set as the attribution; tables with left- and right-aligned columns; a paragraph of two images, which must at least stack.

A theme may also list `collections.services` in its own chrome (the footer, the 404 page). It must not depend on any frontmatter key or data key that is not in this file, other than the engine's own (`site.*`, `nav`, `strings`, `data.footer.html`).

What every theme tolerates, with no sideways scroll at 320px and no lost text:

- no `business.json` at all, and any mix of blank keys;
- a `phone` of 24 characters, an `email` of 40, an `hours` or `area` of 120: they wrap, and a fixed-height bar never clips them;
- a `title` of 2 characters and one of 80, and a single unbreakable word of 34 letters as the whole title;
- a `priceFrom` of 40 characters, or with no digits in it, or absent: never a fixed-size box;
- `included` absent, one line, or ten long lines;
- a service with a title and description and nothing else, not even a body;
- one item or forty, ten to a list page, so the last page may hold a single card and any grid may end on a short row;
- alphabetical order: position means nothing, so no card gets more emphasis for being first or last. A card left alone on the last row may stretch to fill the row, at the same type sizes as the others;
- ordinary Markdown in any body: `h2` to `h4`, nested lists, a three-column table with a long cell, a code block, a rule, a long bare URL;
- no image anywhere.

Interface words come from the theme's `strings.json`: English keys at the top level, and one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. Text drawn by CSS (`content:`) counts as an interface word, so it reaches the stylesheet through an attribute filled from `strings`. No theme emits a `<form>`.

## Left out on purpose

- A `home` template or a "show services" switch on the home page: the home page's own price table links the services, and a theme is free to list them in its chrome.
- An `order` field on services: sorting by it would change `sortBy`, which is not an additive change.
- `phoneHref`: the one `phone` value is written dialable, so there is no second value to drift from it.
- A separate `address` key: `area` holds the address or the district, and the other goes on the contact page.
- A `testimonials` collection: a blockquote with an attribution line does the job.
- A "recent jobs" collection: `posts` already exists for a site that wants news.
- Declaring `pages` in the starter: it is a standard collection every site has.
- An intro line on the services list, the menu marking "Services" on a service page, ordering a list by anything but one field: these are engine features, not content.
