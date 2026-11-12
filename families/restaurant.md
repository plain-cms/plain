# Restaurant and café — family contract

For anywhere that sells food or drink to eat in or take away and needs its menu, hours and address online: restaurants, cafés, bakeries, bars, pubs, takeaways and counters. Every theme in the family reads exactly the content described here, so a site can change theme with no content change.

```json
{
  "family": "restaurant",
  "title": "Restaurant and café",
  "collections": {
    "menu": {
      "path": "content/menu",
      "urlPattern": "/menu/:slug/",
      "template": "menu-item",
      "listUrl": "/menu/",
      "listTemplate": "menu",
      "label": "Menu",
      "sortBy": "section",
      "sortOrder": "asc",
      "pageSize": 100,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "price", "type": "text" },
        { "name": "section", "type": "select", "options": ["Starters", "Mains", "Desserts", "Drinks", "Breakfast", "Bread", "Pastries", "Sides", "Hot drinks", "Snacks"] },
        { "name": "description", "type": "text" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Menu", "url": "/menu/" },
    { "label": "Visit", "url": "/visit/" }
  ],
  "plugins": [],
  "data": {},
  "templates": ["menu", "menu-item"],
  "layouts": [],
  "contentTemplates": ["menu-item.md", "page.md"],
  "contentClasses": [
    {
      "class": "hours-card",
      "markup": "<div class=\"hours-card\">\n  <dl>\n    <dt>Lunch</dt>\n    <dd>Tue–Fri · 12:00–14:30</dd>\n  </dl>\n  <dl>\n    <dt>Find us</dt>\n    <dd>14 Market Lane</dd>\n  </dl>\n</div>",
      "purpose": "The house card: opening hours, address and phone as label and value pairs, one <dl> per pair. May end with a .reserve paragraph."
    },
    {
      "class": "reserve",
      "markup": "<p class=\"reserve\"><a class=\"btn-reserve\" href=\"tel:+353209123456\">Call to book a table</a></p>",
      "purpose": "The paragraph that holds the booking button, as the last child of an .hours-card or on its own in a page."
    },
    {
      "class": "btn-reserve",
      "markup": "<p class=\"reserve\"><a class=\"btn-reserve\" href=\"mailto:table@example.com\">Email us to book</a></p>",
      "purpose": "The one call-to-action button: a link styled as a button, always written inside a .reserve paragraph. (Themes also style the bare link in a plain paragraph, for pages written before .reserve existed.)"
    }
  ]
}
```

The contract is `themes/bistro`'s, verbatim, with one additive change: `section` gained six options after the original four (Breakfast, Bread, Pastries, Sides, Hot drinks, Snacks). A site written for the old four-option list builds unchanged and looks the same, with one visible difference from bistro as it stood: items with no section, which bistro seated after Drinks, now come first.

There is no data file and no image field in this family, and the only date is a post's. Hours, address, phone and e-mail are written in the Markdown of the home and Visit pages.

## Collection `menu`

One item is one thing a customer can order: a dish, a loaf, a drink, a set menu. One file per item in `content/menu/`. The file name is the slug and the URL: `soup-of-the-day.md` → `/menu/soup-of-the-day/`. The whole menu is one list at `/menu/`.

| Field | Required | Format | Meaning | Example |
| --- | --- | --- | --- | --- |
| `title` | yes | text, one line, up to 80 characters | The item's name as the customer says it. | `Half Roast Chicken & Bread Sauce` |
| `price` | no | text, always in double quotes, up to 35 characters | Shown exactly as written: include the currency. Write the customer's own wording, including for a price that varies. Leave the line out only when the customer gave no price at all — never write a placeholder of your own. | `"€21"`, `"€4.50 a slice"`, `"from €12"`, `"Market price"`, `"€9 small · €13 large"` |
| `section` | no | one of the ten values below, spelled exactly | Which part of the menu the item belongs to. Leave the line out (never `section: ""`) for an item that fits nowhere. | `Mains` |
| `description` | yes in practice | text, one line, about 60–120 characters | What it is and what comes with it. Printed under the name on the menu, at the top of the item's page, and used as the page's search description. A missing one is a build warning. | `Free-range bird, roast potatoes, bread sauce, pan gravy.` |
| `draft` | no | `true` or `false` (default `false`) | `true` takes the item off the site without deleting the file — a seasonal dish, for instance. | `false` |

Diet and heat are written as words at the end of the `description` — `Slow-cooked black lentils, butter, cream. Vegetarian. Mild.` — never as a code in the title (`(v)`, chilli symbols). The full allergen list goes in the body.

The body (Markdown under the frontmatter) is optional and appears only on the item's own page: allergens, where it comes from, how it is served. Most items need none.

### `section` values and their order

The values are fixed keys. Themes print them as the section headings and key their styles on them, so never translate, reword or add to them — not in a content file and not in `site.config.json`. Use only the sections the business has; a section with no items does not appear.

Sections always appear in this order, in every theme, on a menu of up to 100 items. The author cannot change it.

| Order | `section` | File here |
| --- | --- | --- |
| 0 | *(none)* | Anything that stands above the menu or fits nowhere: the dish of the day, a set menu, a meal deal. Shown first, with no heading. |
| 1 | `Breakfast` | Cooked breakfasts, breakfast plates and breakfast rolls, anything served only in the morning. |
| 2 | `Bread` | Loaves, rolls, baguettes — unfilled bread sold over the counter. |
| 3 | `Pastries` | Bakes sold by the piece over a counter, sweet or savoury: croissants, buns, scones, cake by the slice, tarts, biscuits, a pasty, a slice of quiche, a sausage roll. |
| 4 | `Starters` | First courses, soups, small plates, tapas, nibbles before a meal. |
| 5 | `Mains` | The main thing ordered: main courses, pizzas, burgers, curries, bowls, fish and chips, sandwiches, lunch plates. |
| 6 | `Sides` | Ordered with a main: chips, rice, bread with a meal, salads, sauces, extra toppings. |
| 7 | `Desserts` | Puddings, ice cream, cheese — the sweet course at a table. |
| 8 | `Hot drinks` | Coffee, tea, hot chocolate. |
| 9 | `Drinks` | Every other drink: wine, beer, cocktails, spirits, soft drinks, juice. |
| 10 | `Snacks` | Small things eaten with a drink at a bar: crisps, nuts, olives, a pretzel, a pickled egg. |

When an item fits two rows, file it by how it is ordered at this business: eaten as the meal → `Mains` (a main-course salad, soup and bread at a café, a filled roll at lunch); ordered beside a main → `Sides`; before a meal at a table → `Starters`; with a drink at a bar → `Snacks`. Cold coffee and iced tea are `Drinks`. A bake sold by the piece is `Pastries` even when savoury.

Kinds of dish inside a section (Tandoori, Biryani, Balti; Red, White) get no heading of their own: name the kind in the title or the description.

**Keep the menu to 100 published items at most** (drafts do not count). Past 100 the list is cut into pages by section name from a to z, not in service order, so Starters land on page 2 after Mains on page 1. On a long menu, fold variants into one item — one `Biryani` item with `description: Chicken, lamb, prawn or vegetable, with pilau rice.` and `price: "€11.50 – €13.50"` — rather than one file per variant.

Inside a section, items follow their file names from a to z. That order is not guaranteed when some items have no section, so do not write copy that depends on it ("the first three are vegetarian"). When a menu has sections, give every item one where an honest fit exists; leave `section` out only for the few items that truly stand apart, or on every item of a short menu that has no sections at all.

### URLs

- `/menu/` — the whole menu on one page (the engine starts `/menu/page/2/` after 100 items; never let it get there). Its heading is the collection label, "Menu". A site in another language may change `"label"` in its own `site.config.json`; nothing else in the collection may be edited.
- `/menu/<slug>/` — one page per item.

## Data files

None. `data/navigation.json` is created from the navigation preset; `data/footer.json` and `data/strings.<lang>.json` belong to the site, not to this contract.

## Pages

Files in `content/pages/`, each with `title` and `description`. The theme prints `title` as the page's heading, so do not repeat it in the body.

- **`index.md`** (`/`, "Home") — `title` is a welcome line or what the place is, not the business name (the site title already shows it). Body: one sentence about the place; an `.hours-card` with the main hours, the address and a booking button; one or two short paragraphs or `##` sections (what is cooked or baked, what is new this week); links to `/menu/` and `/visit/`.
- **`visit.md`** (`/visit/`, "Visit") — full opening hours (an `.hours-card`), the address with directions, parking and access, and how to book or order: the phone number as a `tel:` link and the e-mail address as a `mailto:` link. A truck or stall with no fixed address writes one `.hours-card` pair per pitch — label the day, value the place and times (`<dt>Thursday</dt><dd>Market Square · 11:30–14:30</dd>`), up to eight — and gives directions to each pitch in the text below. A takeaway adds a `## Delivery` or `## Collection` section in plain text: the area served, the minimum order, the charge, and the hours orders are taken; the button label is then `Order by phone`.
- **Posts** (`content/posts/<slug>.md` → `/blog/<slug>/`, listed at `/blog/`) are the engine's standard collection, unchanged: `title` (required), `date` (required, `YYYY-MM-DD`), `description`; leave `cover` and `tags` out. Write one only when the customer gives news worth a page (holiday closing, a new menu), and link it from the home page body (`[Christmas hours](/blog/christmas-hours/)`) — the navigation does not link `/blog/`.

The three navigation URLs are fixed — `/`, `/menu/`, `/visit/` — so the file names `index.md` and `visit.md` are fixed in every language. A site in another language translates only the labels, in its own `data/navigation.json` (`[{ "label": "Start", "url": "/" }, { "label": "Speisekarte", "url": "/menu/" }, { "label": "Besuch", "url": "/visit/" }]`), and the collection `label`. The engine builds `/menu/` itself: do not write a page for it.

Other pages (private dining, catering, about) are ordinary pages. Add one to the navigation only if the customer asks, as one more `{ "label": "Private dining", "url": "/private-dining/" }` entry after Visit.

### Content classes

Three class names may appear in raw HTML in the Markdown of files under `content/pages/`. Every theme styles all three there, and only there: in a post or in a menu item's body write hours as ordinary Markdown (a list or a table). Write the markup exactly as below, with a blank line before and after each block and none inside it. Inside raw HTML write `&amp;` for `&`, and plain text — Markdown is not read there.

**`.hours-card`** — label and value pairs. One `<dl>` per pair, each holding one `<dt>` (the label, up to 40 characters) and one `<dd>` (the value, up to 60 characters: text, or a single `tel:` or `mailto:` link). A longer address goes in the page text below the card. One to eight pairs. Optionally ends with a `.reserve` paragraph. At most one card per page.

```html
<div class="hours-card">
  <dl>
    <dt>Lunch</dt>
    <dd>Tue–Fri · 12:00–14:30</dd>
  </dl>
  <dl>
    <dt>Dinner</dt>
    <dd>Tue–Sat · 18:00–22:00</dd>
  </dl>
  <dl>
    <dt>Find us</dt>
    <dd>14 Market Lane</dd>
  </dl>
  <dl>
    <dt>Phone</dt>
    <dd><a href="tel:+353209123456">020 912 3456</a></dd>
  </dl>
  <p class="reserve"><a class="btn-reserve" href="tel:+353209123456">Call to book a table</a></p>
</div>
```

**`.reserve`** and **`.btn-reserve`** — the booking button: a paragraph with class `reserve` holding one link with class `btn-reserve`. Always write both — never a bare `<a class="btn-reserve">`. (Themes also style the bare link in a plain paragraph, for pages written before `.reserve` existed.) Inside a card (above) or on its own in the page:

```html
<p class="reserve"><a class="btn-reserve" href="mailto:table@example.com">Email us to book</a></p>
```

The `href` is a `tel:` link, a `mailto:` link, a page of this site (`/visit/`), or the full `https://` address of the customer's own booking or ordering page. The label says what happens, in up to 30 characters ("Call to book a table", "Order by phone"). At most one button per page.

No other class is part of the contract. (`bistro` also styles `.hero` and `.hero-tagline`; do not write them.)

## Examples

`content/menu/flat-white.md`:

```markdown
---
title: Flat White
price: "€3.80"
section: Hot drinks
description: Double shot, steamed whole milk. Oat milk at no extra charge.
---

Beans from the roastery two streets away, changed every month. Contains milk.
```

`content/pages/index.md`:

```markdown
---
title: Come in, sit down
description: A neighbourhood bistro — seasonal plates, an honest wine list, and a table waiting for you.
---

*Twelve tables in the old print works behind the square, and a short menu that changes when the market does.*

<div class="hours-card">
  <dl>
    <dt>Lunch</dt>
    <dd>Tue–Fri · 12:00–14:30</dd>
  </dl>
  <dl>
    <dt>Dinner</dt>
    <dd>Tue–Sat · 18:00–22:00</dd>
  </dl>
  <dl>
    <dt>Find us</dt>
    <dd>14 Market Lane</dd>
  </dl>
  <p class="reserve"><a class="btn-reserve" href="tel:+353209123456">Call to book a table</a></p>
</div>

We cook what the market gives us and pour wine we'd happily drink ourselves. See [the full menu](/menu/), or [find your way to the door](/visit/).

## This week

The first wild mushrooms are in, so the tagliatelle is back.
```

`content/pages/visit.md`:

```markdown
---
title: Visit
description: Opening hours, directions, and how to book a table.
---

## Hours

<div class="hours-card">
  <dl>
    <dt>Lunch</dt>
    <dd>Tuesday to Friday · 12:00–14:30</dd>
  </dl>
  <dl>
    <dt>Dinner</dt>
    <dd>Tuesday to Saturday · 18:00–22:00</dd>
  </dl>
  <dl>
    <dt>Sunday &amp; Monday</dt>
    <dd>Closed</dd>
  </dl>
</div>

## Find us

14 Market Lane, in the old print works behind the square. The nearest car park is on Cooper Street. There is one step at the door and a ramp — just knock.

## Book a table

Call [020 912 3456](tel:+353209123456) between 10:00 and 17:00, or email [table@example.com](mailto:table@example.com).
```

`content/posts/christmas-hours.md`:

```markdown
---
title: Christmas hours
date: 2026-12-01
description: We close after lunch on 24 December and open again for dinner on 2 January.
---

Our last service of the year is lunch on Thursday 24 December. We are back on Saturday 2 January from 18:00.
```

## Rules for the author

- **Frontmatter is flat.** `key: value` lines only — no nesting, no multi-line values, no lists in this family. Quote every `price` (`"€8.50"`; unquoted, `8.50` becomes `8.5`) and any title that is only a number or the word `true` or `false`.
- **File names** are lowercase a–z, digits and hyphens (`kaesespaetzle.md`, not `Käsespätzle.md`). Renaming a file changes its URL.
- **Dates**: every post has a `date`, written `YYYY-MM-DD`. Nothing else in this family has a date.
- **No images are needed.** The family has no image field; a site is complete with none. Add a Markdown image to a page only if the customer supplied the photo: `![The dining room at lunchtime](/media/2026/11/dining-room.jpg)` — a root-relative path under `/media/`, with alt text that says what the picture shows. Never in a menu item's frontmatter.
- **At most 100 published menu items.** Beyond that the menu splits across pages out of service order (see above); fold variants into one item.
- **Contact is links, never a form.** Phone: `[020 912 3456](tel:+353209123456)` — the visible number as the customer writes it, the `tel:` target with `+`, country code and digits only. E-mail: `[table@example.com](mailto:table@example.com)`.
- **Every page, post and menu item has a `description`.**
- **Write only what the customer told you.** No invented prices, hours or dishes; leave `price` out when it was not given.
- **Section names stay in English** on every site (see above); everything else is in the site's language.

## Rules for the theme builder

Ship `starter.json` with the `collections`, `navigation` and `plugins` above, key for key; templates `base`, `page`, `post`, `list`, `404`, `menu`, `menu-item`; content templates `menu-item.md` and `page.md` (the page template shows an `.hours-card` with a `.reserve` button); no `layouts`; no file in `sample/data/` other than `navigation.json`.

**`menu` (the list) must render**, for each item in `items`: `title` linked to `item.url`; `price` if set; `description` if set; and the section name, visible at least on the first item of each section. The page heading is `page.title`; `page.description` is never set on a list page. Also: an empty-menu message from `strings`, and pagination when `pagination.multiple`.

**Sections.** The build sorts items by `section` alphabetically and templates cannot group, so:

- Print the section name with every item (`{{#if item.section}}…{{/if}}`) and put the value on the item as an attribute. A theme that shows the name once per section hides it on every later item of that section with the general sibling combinator (items of one section are not always adjacent in the page); a theme may instead keep the name on every item.
- Make the list a flex or grid container and seat the sections with `order`, 1 to 10 as in the table above. Items with no section keep `order: 0`: first, with no heading.

```css
.item[data-section="Breakfast"] { order: 1; }   /* … one rule per value, to Snacks: 10 */
.item[data-section="Breakfast"] ~ .item[data-section="Breakfast"] .section-name { display: none; }
```

- All ten values get the `order` rule, even those the theme gives no special colour, and the hide rule too if the theme hides repeated names. A value outside the ten (a site may have edited its config) must still render: its name stays on each item, at `order: 0`.
- A script may move the items in the document to match, as progressive enhancement; the page must be right without it.

**`menu-item` (one item) must render** the section name if set, `title` as the `h1`, `price` if set, `description` if set, `page.content` (often empty — no empty box), and a link back to `/menu/`.

**`page` must style** `.hours-card` (one `<dl>` per pair; also sound when one `<dl>` holds several pairs), `.reserve`, and `.btn-reserve` both inside `.reserve` and in a plain paragraph (`<p><a class="btn-reserve" …>`, the form older sites carry), plus ordinary prose: `h2`–`h4`, nested lists, tables, blockquotes, code blocks, `hr`, links. The classes appear only in pages; `post` and `menu-item` need not style them.

**Must tolerate, at 320px and up, with no sideways scroll:**

- no `price`, no `section`, no `description`, an empty body — alone or together; no dangling leader, bracket or label;
- a menu of one item or of a hundred; a section of one item; a menu with no sections at all;
- a title of 80 characters, a title of two, an unbreakable word of 35 characters (in a title, a description, a `<dt>` or a `<dd>`);
- a `price` of 35 characters of free text — never assume a number;
- an `.hours-card` with one pair or eight, a 40-character label, a 60-character value, a link as the value;
- a button label of 30 characters, a long phone number as a link, a long bare URL in page text, a wide code block;
- a site title of 30 characters with `&` in it; any language and its diacritics;
- every `section` value, and none.

**Never** put a claim about the business in the theme's own words (`strings.json`): no "open now", "fresh today", "upcoming". Section names are printed as stored; the theme does not translate them.
