# Family contract: shop

The content contract every theme in the `shop` family shares. It is new: no shipped theme uses it yet.

```json
{
  "family": "shop",
  "title": "Shop window",
  "collections": {
    "products": {
      "path": "content/products",
      "urlPattern": "/products/:slug/",
      "template": "product",
      "listUrl": "/products/",
      "listTemplate": "products",
      "label": "Shop",
      "sortBy": "category",
      "sortOrder": "asc",
      "pageSize": 100,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "category", "type": "text", "required": true },
        { "name": "price", "type": "text" },
        { "name": "unit", "type": "text" },
        { "name": "status", "type": "select", "options": ["In stock", "To order", "Seasonal", "Sold out"] },
        { "name": "description", "type": "text" },
        { "name": "details", "type": "list" },
        { "name": "cover", "type": "image" },
        { "name": "featured", "type": "boolean", "default": false },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Shop", "url": "/products/" },
    { "label": "About", "url": "/about/" },
    { "label": "Visit", "url": "/visit/" }
  ],
  "plugins": [],
  "data": {
    "shop.json": {
      "phone": "",
      "email": "",
      "address": "",
      "hours": [
        { "days": "", "time": "" }
      ],
      "orderNote": ""
    }
  },
  "templates": ["products", "product", "home"],
  "layouts": ["page", "home"],
  "contentTemplates": ["page.md", "product.md"],
  "contentClasses": []
}
```

## What the family is for

Independent shops and makers who want their goods and prices seen online but sell over the counter, by phone or by e-mail: butcher, greengrocer, bookshop, record shop, ironmonger, yarn shop, nursery, potter, jeweller, toy shop. There is no cart and no checkout; every page ends with how to order, a phone link and an e-mail link.

## Collection `products`

One item is one thing a customer can ask for by name: a cut of meat, a book, a ball of wool. One file each, in `content/products/<slug>.md`. The file name is the address: `free-range-eggs.md` is served at `/products/free-range-eggs/`. Never name a product file `index.md`.

A service the shop sells over the counter (a repair, a commission, key cutting, sharpening) is a product too: its own `category` (`Repairs`), a `price` such as `from £25`, `status: To order`, and how long it takes in the body.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The name on the shelf label. Aim for 2 to 60 characters. | `Free-range eggs` |
| `category` | text | yes | The shelf the product sits on. Free text, but use two to eight categories for the whole shop and spell each one identically every time (`Bread` and `bread` are two categories). Aim for under 25 characters. | `Dairy and eggs` |
| `price` | text | no | The figure with its currency, kept short because themes set it large. `from £4` and `POA` are fine. Conditions go in `unit` or the body. | `£2.40` |
| `unit` | text | no | What the price buys. Printed small beside the price, and only when there is a price: no `price`, no `unit`. | `per half dozen` |
| `status` | select | no | Whether a customer can have it today. See below. Leave the line out rather than leaving it blank. | `Seasonal` |
| `description` | text | always write one | One sentence of 60 to 160 characters: the line on the product card, under the title on the product page, and in search results. The build warns when it is missing. | `Laid by our own hens on the hill pasture and collected every morning.` |
| `details` | list | no | Up to eight short facts, one per entry, each under 60 characters. Put the label first where a fact has one. A theme prints each entry as written; it cannot split label from value. | `Weight: 250 g` |
| `cover` | image | no | The path of one photograph under `/media/`. Leave the line out when there is no photograph. | `/media/2026/05/eggs.jpg` |
| `featured` | boolean | no, default `false` | `true` shows the product on the home page. Mark three to six. | `true` |
| `draft` | boolean | no, default `false` | `true` keeps the file out of the built site. | `false` |

`status` options:

- `In stock`: on the shelf today. Leaving `status` out means the same; themes show little or nothing for it.
- `To order`: not kept on the shelf; made, cut or ordered when a customer asks. Say how long it takes in the body.
- `Seasonal`: sold for part of the year only. Keep this status all year and name the months in the description (`May to mid-June`): the site cannot know today's date, so the description is what tells a customer. To take the product off the site out of season, set `draft: true`.
- `Sold out`: gone for now and expected back, whatever it was before. Themes dim the product. Delete the file if it will not return (a one-off piece, a second-hand copy).

When two apply, choose the one that tells the customer what to do: `Sold out` over the others, `To order` over `Seasonal`.

A theme shows the status in the site's language, so write the option exactly as above, in English.

Order: the list at `/products/` is sorted by `category`, A to Z, and inside a category by file name, A to Z. The comparison is by character code: capitals come before lower case, and accented capitals (Ä, Ö, É) come after Z. The author cannot set any other order; to push a product forward, mark it `featured`. Featured products appear on the home page in the same order. Every product carries its category on its own card and no theme prints category headings, so a category with one product is fine. The list holds 100 products per page; the next page is `/products/page/2/`.

Several sizes at several prices: write `price: from £4` and list the sizes in `details` (`9 cm pot: £4`, `2 litre pot: £9`).

A book's author, a record's artist, a kit's maker: when customers ask for the product by that name, put it in the `title`, in the order they say it (`Middlemarch, George Eliot`; `Kind of Blue, Miles Davis`), because the title is the only text certain to be on every card. Name the file surname first (`eliot-middlemarch.md`) and the shelf is in author order inside each category. Edition, pressing, grading and condition go in `details` (`Grading: VG+`, `Pressing: 1969 UK first`).

The body is optional. Leave it empty when the description says it all; otherwise write one to four short paragraphs, with `##` headings if needed, on how the product is made, kept or used and what to ask for. Do not repeat the price, status or details. Same rules as page bodies: plain Markdown, no raw HTML.

## Data file `data/shop.json`

The shop's standing facts. Themes print them on every page, so they are written once, here. A page body may repeat the phone inside a sentence as a `tel:` link (see Rules for the author); it never repeats the hours or the address.

| Key | Format | Meaning | Example |
| --- | --- | --- | --- |
| `phone` | string | The number as a customer should read and dial it: digits, an optional leading `+`, spaces or hyphens. No words, brackets or slashes; the theme puts the same string after `tel:`. | `01632 960142` |
| `email` | string | One address. The theme makes it a `mailto:` link. | `shop@hollinfarm.example` |
| `address` | string | The full postal address on one line, parts separated by commas. | `Hollin Farm, Moor Lane, Calderbrook HX7 4AB` |
| `hours` | list of `{ "days", "time" }` | Opening hours, one row per line of the sign on the door, in the order to show them. Both values are free text. A closed day is a row whose `time` says so. A holiday closure is one more row; remove it afterwards. | `{ "days": "Monday", "time": "Closed" }` |
| `orderNote` | string | How to buy, in one or two sentences: reserve by phone, collect in the shop, delivery or none. It is printed on every page, so never write "this page", "this product" or "above". | see the example below |

Blank values: a blank `phone`, `email`, `address` or `orderNote`, or an empty `hours` list (`[]`), is left out with no gap and no heading. With neither `phone` nor `email`, a theme links to `/visit/` instead. A site with no `shop.json` at all still builds and looks finished.

## Pages

The shop's name is the site title (`site.title` in `site.config.json`); aim for under 30 characters. Every theme prints it in the masthead of every page. It is not a key of `shop.json`.

`pages` and `posts` are the universal collections, unchanged. A site in this family has three pages, each with a `title` and a `description`:

- `content/pages/index.md`, the home page at `/`. Set `template: home` in its frontmatter. `title` is the shop's headline, not the shop's name (the site title already shows it) and not the word "Home". `description` is printed under the headline: one sentence saying what the shop sells and where. The body is one to three short sections: what the shop sells, what is special about it, what is new this season. The theme adds the featured products and the shop card; it may place the products before or after the body, so do not write "above" or "below".
- `content/pages/about.md` at `/about/`: who runs the shop, since when, where the goods come from.
- `content/pages/visit.md` at `/visit/`: how to find the shop, parking, steps and access, how to pay, and the detail of delivery and collection that `orderNote` has no room for. Do not retype the hours, address or phone as a list or table; the shop card on the same page shows them.

Page bodies are plain Markdown: headings from `##` down, lists, tables, quotes, links. This family has no content classes. Do not write raw HTML with class names in a body; no theme styles it.

News (new stock, market days) goes in `posts`: `content/posts/<slug>.md` with `title`, `date` (`YYYY-MM-DD`) and `description`, listed at `/blog/`.

The menu is `data/navigation.json`, a list of `{ "label", "url" }` in the order of the block above. The starter writes it; rewrite it only to translate the labels or, if the shop posts, to add `{ "label": "News", "url": "/blog/" }` after Shop. Never change the four URLs.

## Examples

`content/products/free-range-eggs.md`:

```markdown
---
title: Free-range eggs
category: Dairy and eggs
price: £2.40
unit: per half dozen
status: In stock
description: Laid by our own hens on the hill pasture and collected every morning.
details:
  - Size: mixed, medium to large
  - Laid: within the last three days
  - Box: bring it back and we refill it
featured: true
---

Two hundred hens have the run of the hill field behind the shop. We collect at seven and the eggs are on the counter by nine.

## Trays for bakers

A tray of thirty is £10.50. Ring the day before and we will put one aside.
```

`content/pages/index.md`:

```markdown
---
title: Grown on the hill, sold at the gate
description: Hollin Farm Shop sells its own eggs, lamb and vegetables, and bread and cheese from neighbours within ten miles.
template: home
---

## What is in the shop

Everything on the shelves was grown, reared or baked within ten miles. If it is not in season, we do not have it.

## This month

The first new potatoes are in, and asparagus runs until the middle of June.
```

`data/shop.json`:

```json
{
  "phone": "01632 960142",
  "email": "shop@hollinfarm.example",
  "address": "Hollin Farm, Moor Lane, Calderbrook HX7 4AB",
  "hours": [
    { "days": "Tuesday to Saturday", "time": "9:00 to 17:00" },
    { "days": "Sunday", "time": "10:00 to 14:00" },
    { "days": "Monday", "time": "Closed" }
  ],
  "orderNote": "Ring or e-mail to reserve anything in the shop and collect it at the counter. We keep orders until closing time the next day. We do not post."
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` followed by indented `- item` lines). No nesting, no multi-line values, no comments.
- A value made only of digits and a decimal point is read as a number: `price: 12.50` becomes `12.5` and `title: 007` becomes `7`. Put the currency in the value (`£12.50`) or quote it (`price: "12.50"`, `title: "007"`). The same holds for `details` entries. Do not start a value with a quotation mark unless the whole value is quoted.
- An optional field with no value is left out altogether. Never write a key with nothing after it (`price:`, `status:`, `unit:`) and never `status: ""`: the first is read as an empty list and stops the build, the second is not one of the options. Only `details:` may be followed by nothing, and then by its `- ` lines.
- Dates, where a collection has them (`posts`), are `YYYY-MM-DD`. Products have no date.
- Images are optional everywhere. Write the site so that it is complete with none: no "see the photo", no empty `cover:` line.
- Contact is the `tel:` and `mailto:` links the theme builds from `shop.json`, plus any you write in a body as `[01632 960142](tel:01632960142)`. Never a form.
- Every product, page and post has a `description`.
- Do not invent products, prices or hours. A product without a price is allowed: leave the `price` and `unit` lines out.
- File names use only a to z, digits and hyphens: no accents, no ß, no spaces, no capitals (`oefen.md` or `ofen.md`, never `öfen.md`). The three pages are `index.md`, `about.md` and `visit.md` in every language, because the menu links `/about/` and `/visit/`; translate their titles, not their file names.
- The menu labels and the list heading ("Shop", the collection's `label` in `site.config.json`) belong to the site, not the theme: on a site in another language, translate them in `data/navigation.json` and in the `label`. The `status` values stay in English; the theme translates them.

## Rules for the theme builder

Ship `templates/products.html`, `product.html` and `home.html` beside the universal five; `"layouts": ["page", "home"]` in `theme.json`; `content-templates/page.md` and `product.md` (every key in them has a value: an empty `price:` stops the build); the collections, navigation and `sample/data/shop.json` shape exactly as in the block above.

Every theme must render:

- **`base`**, on every page: `site.title` linked to `/`, the menu from `nav`, `data.footer.html` when the site has it.
- **The shop card** at the end of the main content of every page (the 404 may skip it): `orderNote`, `phone` as a `tel:` link, `email` as a `mailto:` link, each `hours` row, `address`. It is the order button, so on a product page it follows the product directly. A theme may repeat the phone or hours elsewhere.
- **`products`** (the list): the heading from `page.title`; for every item its `title` linked to `item.url`, `price`, `unit`, `category` and `status`. `description`, `details` and `cover` are optional on a card. Pagination when `pagination.multiple`; a line from `strings.json` when the list is empty.
- **`product`**: `title` as the `h1`, `category`, `price` with `unit`, `status`, `description`, the body, `details` as a list, `cover` when set (its `alt` is the title), and a link back to `/products/`.
- **`home`**: `page.title` as the `h1`, `page.description`, the body, the products whose `featured` is true (`{{#each collections.products as item}}{{#if item.featured}}…`) as the same cards as the list, and a link to `/products/`. Templates cannot tell whether any product is featured. Either print no heading over the featured products, or put the heading and the list in one wrapper and hide the wrapper with `.featured:not(:has(li))`; write the `<ul>` with no whitespace between its tags and the `{{#each}}`/`{{#if}}`, so that `ul:empty { display: none }` also holds. Never a heading outside that wrapper.
- **Status** as `data-status="{{ item.status }}"` for styling, and in words in the site's language: print the theme's four labels (`statusInStock`, `statusToOrder`, `statusSeasonal`, `statusSoldOut` in `strings.json`) and reveal the one that matches with CSS. `Sold out` must look different without relying on colour alone. A product with no status and one that is `In stock` may show nothing. A value the theme has no label for is printed as written, in the plain style.
- **Interface words**: every one (the status labels, the words on the shop card such as "Call", "E-mail" and "Opening hours", the link to all products, the back link, the empty-list line) comes from the theme's `strings.json`: English keys flat at the top level, one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. The words must be true of a butcher, a bookshop and a jeweller alike, and never make a claim for the shop: no "fresh", "new", "this week", "bestseller", "buy", "basket". Do not draw words with CSS `content:`; they cannot be translated.

Every theme must tolerate:

- Missing `price`, `unit`, `status`, `description`, `details` and `cover`, and an empty body. A missing price leaves no empty star, sticker, ticket or punch. A `unit` with no `price` prints nothing. No image placeholder, ever.
- One product or forty; more than a hundred (pagination); every product in one category; a category with one product; a category of 45 characters.
- No featured product (no empty box and no orphan heading on the home page) and every product featured.
- A title of 80 characters and a title of two; a word of 45 characters with no break in a title, category or body; a price of 35 characters (it wraps, it is never clipped); a unit of 50 characters; eight details of 60 characters each.
- A phone number of 25 characters, an e-mail address of 40, an address of 100, one `hours` row or eight, an `orderNote` of 300 characters.
- No sideways scroll at 320 px with any of the above, in both colour schemes.
- Do not print group headings, a number of products, "first" or "last" markers, or totals: templates cannot compute them. A running number drawn by a CSS counter is allowed as decoration only (`aria-hidden` or generated content): it restarts on every list page and on the home page, so it must never read as a stock number or a count.
- Do not use `cover` as the base of the design; the signature must be drawn from text and CSS.

## Not in the contract

No cart, checkout, stock count, variants, product dates, second image or gallery, category pages, map, or order form. Authors put such things in the body as text or leave them out; themes do not ask for them.
