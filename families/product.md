# Family contract: product

The content contract every theme in the `product` family shares, so a site can change theme with no content change. Source: `themes/launch`, reused verbatim, with no changes. `launch` is the only theme in the family and no sibling is planned; the contract is written down so that an agent writing a site, or a second theme one day, has one place to look.

```json
{
  "family": "product",
  "title": "Product and software",
  "collections": {
    "pages": {
      "path": "content/pages",
      "urlPattern": "/:slug/",
      "template": "page",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "description", "type": "text" },
        { "name": "heroTagline", "type": "textarea", "showFor": "landing" },
        { "name": "heroCtaLabel", "type": "text", "showFor": "landing" },
        { "name": "heroCtaUrl", "type": "text", "showFor": "landing" },
        { "name": "heroSecondaryLabel", "type": "text", "showFor": "landing" },
        { "name": "heroSecondaryUrl", "type": "text", "showFor": "landing" },
        { "name": "heroImage", "type": "image", "showFor": "landing" },
        { "name": "heroAlt", "type": "text", "showFor": "landing" },
        { "name": "featuresHeading", "type": "text", "showFor": "landing" },
        { "name": "pricingHeading", "type": "text", "showFor": "landing" },
        { "name": "testimonialsHeading", "type": "text", "showFor": "landing" },
        { "name": "faqHeading", "type": "text", "showFor": "landing" },
        { "name": "ctaHeading", "type": "text", "showFor": "landing" },
        { "name": "ctaLabel", "type": "text", "showFor": "landing" },
        { "name": "ctaUrl", "type": "text", "showFor": "landing" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    },
    "changelog": {
      "path": "content/changelog",
      "urlPattern": "/changelog/:slug/",
      "template": "release",
      "listUrl": "/changelog/",
      "listTemplate": "changelog",
      "label": "Changelog",
      "sortBy": "date",
      "sortOrder": "desc",
      "rss": true,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "version", "type": "text" },
        { "name": "tag", "type": "select", "options": ["New", "Improved", "Fixed"] },
        { "name": "description", "type": "text" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    },
    "features": {
      "path": "content/features",
      "render": false,
      "sortBy": "order",
      "sortOrder": "asc",
      "label": "Features",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "order", "type": "text" }
      ]
    },
    "testimonials": {
      "path": "content/testimonials",
      "render": false,
      "sortBy": "order",
      "sortOrder": "asc",
      "label": "Testimonials",
      "fields": [
        { "name": "author", "type": "text" },
        { "name": "role", "type": "text" },
        { "name": "order", "type": "text" }
      ]
    },
    "faq": {
      "path": "content/faq",
      "render": false,
      "sortBy": "order",
      "sortOrder": "asc",
      "label": "FAQ",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "order", "type": "text" }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Pricing", "url": "/pricing/" },
    { "label": "Changelog", "url": "/changelog/" },
    { "label": "About", "url": "/about/" }
  ],
  "plugins": [],
  "data": {
    "pricing.json": {
      "plans": [
        {
          "name": "",
          "price": "",
          "period": "",
          "tagline": "",
          "features": [""],
          "cta": "",
          "url": "",
          "featured": false
        }
      ]
    }
  },
  "templates": ["changelog", "landing", "release"],
  "layouts": ["page", "landing"],
  "contentTemplates": ["faq.md", "feature.md", "landing.md", "page.md", "release.md", "testimonial.md"],
  "contentClasses": []
}
```

Not in the block because they are universal: the `posts` collection (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. `pages` is in the block because this family changes it: it adds the fourteen landing fields. Two more keys are read from a page's frontmatter without being declared as fields: `template` and `showPricing` (see Pages). `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample or to this contract.

## What the family is for

One product with its own site: a web app, a mobile app, a developer tool, an online service, or a small firm's one packaged offer. The home page is a sales page — headline, features, prices, customer quotes, questions, one call to action — and a dated list of releases shows that the product is alive.

## Collection `pages`

One item is one page. File `content/pages/<slug>.md` becomes `/<slug>/`; `index.md` becomes `/`. The file name is the URL: lowercase a–z, digits and hyphens only. Pages have no list and no order.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The page's only `h1`. On the home page it is the sales headline, a sentence, not "Home". | `Know it's down before your users do` |
| `description` | text | yes, by rule | One plain sentence, 80–160 characters. Shown under the title on ordinary pages and in search results on all. The schema allows leaving it out, but the build then warns. | `Three plans, no surprises — free for a side project, $29 for a team.` |
| `heroTagline` | textarea | no | One or two sentences under the headline: what the product is and for whom. One line, plain text. | `Uptime monitoring for small teams — 30-second checks and alerts that reach a human.` |
| `heroCtaLabel` | text | no | Words on the main button, two to four. Blank: the theme's own "Get started". | `Start free` |
| `heroCtaUrl` | text | no | Where the main button goes (see "Link values"). Blank: no main button. | `/pricing/` |
| `heroSecondaryLabel` | text | no | Words on the quieter second button. Blank: the theme's own "Learn more". | `See how it works` |
| `heroSecondaryUrl` | text | no | Where the second button goes. Blank: no second button. | `/about/` |
| `heroImage` | image | no | One product screenshot, a path under `/media/`. Blank is the normal case: the theme shows nothing in its place. | `/media/2026/05/dashboard.png` |
| `heroAlt` | text | no | What the screenshot shows, for people who cannot see it. Only with `heroImage`. | `The dashboard with six green checks` |
| `featuresHeading` | text | no | Heading over the features. Blank: the theme's own word. | `Everything you need to sleep through the night` |
| `pricingHeading` | text | no | Heading over the plans. | `Simple, honest pricing` |
| `testimonialsHeading` | text | no | Heading over the customer quotes. | `Teams that switched` |
| `faqHeading` | text | no | Heading over the questions. | `Questions, answered` |
| `ctaHeading` | text | no | The closing line above the last button. Blank: the button alone. | `Start monitoring in five minutes.` |
| `ctaLabel` | text | no | Words on the last button. Blank: the theme's own "Get started". | `Create your free account` |
| `ctaUrl` | text | no | Where the last button goes. Blank: no closing block at all. | `https://app.example.com/signup` |
| `draft` | boolean | no | `true` keeps the page off the site. Default `false`. | `false` |

The fourteen fields from `heroTagline` to `ctaUrl` belong to a landing page. One exception is kept for older sites: a page with `heroTagline` set and no `template` key is drawn with the hero (title, tagline, buttons, image) above its body, and then shows neither its `description` nor the plans. Never set `heroTagline` on a page that is not a sales page. There are no select fields.

Two undeclared frontmatter keys:

| Key | Value | Effect |
| --- | --- | --- |
| `template` | `landing` | Makes the page a sales page: hero, then the sections below. Leave the key out for an ordinary page. |
| `showPricing` | `true` | On an ordinary page with no `heroTagline`, prints the plans from `data/pricing.json` between the page heading and the body. A landing page prints the plans by itself and ignores the key. |

**Link values** (`heroCtaUrl`, `heroSecondaryUrl`, `ctaUrl`, and `url` in a plan): a path on the site starting and ending with `/` (`/pricing/`), a full `https://` address (a sign-up page), `mailto:` plus an e-mail address, or `tel:` plus a dialable number (digits and a leading `+`, nothing else: `tel:+14155550134`).

**Body.** Markdown, starting at `##`. On a landing page the body is optional: at most a short paragraph, printed between the hero and the sections.

## Collection `changelog`

One item is one release or one dated notice about the product: what changed and why it matters to a user.

- File `content/changelog/<slug>.md` becomes `/changelog/<slug>/`.
- All items are listed at `/changelog/` under the heading "Changelog", ten to a page (`/changelog/page/2/` and so on), and feed `/changelog/rss.xml`.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | What changed, as a plain statement. Aim for under 70 characters. | `Assertions now run in every region` |
| `date` | date | yes | The day it shipped, `YYYY-MM-DD`. | `2026-06-26` |
| `version` | text | no | The version label, shown as written on a small chip; keep it under 15 characters. Start it with a letter or put it in double quotes: a bare `2.10` is read as a number and loses its zero. | `v2.4.0` |
| `tag` | select | no | The kind of change. One of the three values below, spelled exactly, or left out. | `Improved` |
| `description` | text | yes, by rule | One or two plain sentences, 80–200 characters. Shown under the title in the list, in the feed and in search results. The schema allows leaving it out; the release then shows its title alone. | `Response assertions now evaluate per region, so stale content in one geography finally pages you.` |
| `draft` | boolean | no | `true` keeps the item off the site. Default `false`. | `false` |

`tag` values:

| Value | Use it when |
| --- | --- |
| `New` | Users can do something they could not do before. |
| `Improved` | Something that existed works better, faster or more clearly. |
| `Fixed` | A fault was put right. |
| *(left out)* | Anything else: a notice, a maintenance window, a release that mixes all three. |

The value is printed as written, in English, on every site; themes colour by it. On a site in another language either accept the English word or leave `tag` out. Never write a translation: the build rejects any other value.

**Body.** Markdown, starting at `##`: what changed, why it matters, what the user must do (usually nothing). May be empty.

**Sorting.** Newest `date` first; two items with the same date keep file-name order. The build does not know today's date, so an item dated in the future is listed first like any other: do not publish a release before it ships — set `draft: true` until then.

## Collections `features`, `testimonials`, `faq`

Three lists that fill the landing page. One file is one entry; an entry has **no page and no URL**, and its file name is never shown (it must still be a lowercase slug). A section whose collection is empty is left out of the page.

| Collection | Folder | One item is | `title` | Body |
| --- | --- | --- | --- | --- |
| `features` | `content/features/` | One thing the product does for the user. Three to six entries. | Required. The benefit in a few words, under 50 characters: `Alerts that respect the on-call`. | One short paragraph, one to three sentences. May be empty. |
| `testimonials` | `content/testimonials/` | One real customer's words. | None. Use `author` (the person's name: `Imani Blake`) and `role` (job and company: `CTO, Harbourline`). Both are optional in the schema; always give at least one. | The quote itself, without quotation marks. One to three sentences. |
| `faq` | `content/faq/` | One question a buyer asks before paying. | Required. The question, as the buyer would ask it: `Can I cancel anytime?` | The answer: one short paragraph, or a short list. |

`order` (text, optional by schema, always set it) places the entry in its list, lowest first. It is compared **as text, not as a number**: write `1` to `9` in a list of up to nine; in a list that may reach ten, write every entry with two digits in double quotes (`order: "01"` … `order: "12"`), or `10` sorts before `2`. Entries with the same `order`, or none, land in no dependable place.

Bodies are Markdown without headings. Links are fine. `draft: true` hides an entry.

## Data file `data/pricing.json`

The plans. Shown on the landing page and on every page that sets `showPricing: true`. Every value is plain text shown as written; nothing is calculated.

| Key | Meaning and format | Example | When blank |
| --- | --- | --- | --- |
| `plans` | The list of plans, in the order to show them, cheapest first. One to four. | | `[]`, or no file: no plans anywhere, and the landing page has no pricing section. |
| `plans[].name` | The plan's name, one or two words. | `Team` | Do not leave blank. |
| `plans[].price` | The price as it should be read, with its currency. Free text: `$0`, `49 €`, `from £120`, `On request`. | `$29` | Do not leave blank. |
| `plans[].period` | What the price is per, one or two words. The theme prints it after a slash: `$29/month`. | `month` | Price alone (right for "On request" or a one-off price). |
| `plans[].tagline` | Who the plan is for, one sentence. | `For a product with users who notice.` | Left out. |
| `plans[].features` | What the plan includes: three to six short plain-text lines, no Markdown. | `["50 monitors", "Slack alerts"]` | `[]`: no list. |
| `plans[].cta` | Words on the plan's button. | `Start a 14-day trial` | The theme's own "Choose" plus the plan name. |
| `plans[].url` | Where the button goes (see "Link values"). | `https://app.example.com/signup?plan=team` | No button on that plan. |
| `plans[].featured` | `true` on the one plan to recommend; the theme marks it. `false` on the others. | `true` | `false`: no plan is marked. |

## Pages

Every site has these three pages in `content/pages/`, each with `title` and `description`. The navigation preset links them and `/changelog/`; menu labels may be translated in `data/navigation.json`, but the four URLs must stay.

- **`index.md` → `/`** Set `template: landing`. `title` is the headline; fill `heroTagline`, `heroCtaLabel` and `heroCtaUrl`, the four section headings, and `ctaHeading`, `ctaLabel`, `ctaUrl`. The theme builds the page from the hero fields, the body, the three section collections and `pricing.json`; it may also list the newest releases. Do not retype features, prices or questions in the body, and do not write "above" or "below": a theme may order the sections its own way.
- **`pricing.md` → `/pricing/`** Set `showPricing: true`. The body is what the plan cards cannot say: what every plan includes, tax, how billing and cancelling work, discounts, who to ask.
- **`about.md` → `/about/`** Who makes the product and how they run it, and how to reach them: the e-mail address as a `mailto:` link, the phone number as a `tel:` link, the postal address as text. This is the site's contact page unless the site adds one.

Further pages (how it works, security, privacy, terms, contact) are ordinary pages; link them from page bodies. Longer writing that is not a release goes in the universal `posts` collection (`content/posts/`, listed at `/blog/`), which the menu does not link.

**Content classes: none.** Pages and items are plain Markdown — headings, paragraphs, lists, tables, blockquotes, code, links. Do not write raw HTML with class names; no theme in this family styles any.

## Examples

`content/pages/index.md`

```markdown
---
title: Know it's down before your users do
description: Pulse watches your endpoints from six regions, pages the right person, and keeps a status page your customers actually believe.
template: landing
heroTagline: Uptime monitoring for small teams — 30-second checks, honest status pages, and alerts that reach a human, not a channel nobody reads.
heroCtaLabel: Start free
heroCtaUrl: /pricing/
heroSecondaryLabel: Who we are
heroSecondaryUrl: /about/
featuresHeading: Everything you need to sleep through the night
pricingHeading: Simple, honest pricing
testimonialsHeading: Teams that switched to Pulse
faqHeading: Questions, answered
ctaHeading: Start monitoring in five minutes.
ctaLabel: Write to us
ctaUrl: mailto:hello@pulsemonitor.example
---
```

`content/pages/pricing.md`

```markdown
---
title: Pricing
description: Three plans, no surprises — free for a side project, $29 for a team, $99 for a fleet. Every plan includes every region.
showPricing: true
---

**Every plan includes every region.** The free plan checks from the same six regions as Scale.

**Annual pays for two months.** Any plan, cancel whenever, refunded to the day.

**Not sure which plan fits?** Write to [hello@pulsemonitor.example](mailto:hello@pulsemonitor.example) or ring [+1 415 555 0134](tel:+14155550134), weekdays 9am–5pm Pacific.
```

`content/changelog/multi-region-assertions.md`

```markdown
---
title: Assertions now run in every region
date: 2026-06-26
version: v2.4.0
tag: New
description: Response assertions — status, headers, body contains — now evaluate per region, so a CDN serving stale content in one geography finally pages you.
---

Assertions used to run only from your primary region. Now every check in every region evaluates the full set, and the alert names the regions that failed.

## What you need to do

Nothing. Existing checks got per-region assertions automatically, using your current rules.
```

`content/features/alerts.md`

```markdown
---
title: Alerts that respect the on-call
order: 2
---
One page per incident, not one per region. Escalation follows your rotation, and every alert carries the diff of what changed.
```

`content/testimonials/imani.md`

```markdown
---
author: Imani Blake
role: CTO, Harbourline
order: 1
---
We switched from a tool that paged the whole team for a single flaky region. Pulse pages one person, with the diff.
```

`content/faq/cancel.md`

```markdown
---
title: Can I cancel anytime?
order: 3
---
Yes — monthly, no contract. Your incident history exports to JSON so you keep your own record.
```

`data/pricing.json`

```json
{
  "plans": [
    {
      "name": "Solo",
      "price": "$0",
      "period": "month",
      "tagline": "For one person and a side project.",
      "features": ["5 monitors, 5-minute checks", "1 status page", "Email alerts"],
      "cta": "Start free",
      "url": "https://app.pulsemonitor.example/signup",
      "featured": false
    },
    {
      "name": "Team",
      "price": "$29",
      "period": "month",
      "tagline": "For a product with users who notice.",
      "features": ["50 monitors, 30-second checks", "Unlimited status pages", "Slack, SMS & webhook alerts", "On-call rotations"],
      "cta": "Start a 14-day trial",
      "url": "https://app.pulsemonitor.example/signup?plan=team",
      "featured": true
    },
    {
      "name": "Scale",
      "price": "On request",
      "period": "",
      "tagline": "For fleets, agencies, and audits.",
      "features": ["500 monitors", "SSO & audit log", "Priority support from an engineer"],
      "cta": "Talk to us",
      "url": "mailto:hello@pulsemonitor.example",
      "featured": false
    }
  ]
}
```

## Rules for the author

- Frontmatter is flat: `key: value` lines and simple lists (`key:` then indented `- item` lines). No nesting, no multi-line values. Put a value that is only a number, or only `true` or `false`, in double quotes if it is meant as text.
- Leave an unused key out altogether. `key:` with nothing after it is read as an empty list and fails the build on a text or select field; so does `tag: ""`.
- Dates are `YYYY-MM-DD`.
- Images are optional everywhere. The only image field is `heroImage`; a site must be complete without a single picture.
- Contact is `tel:` and `mailto:` links, never a form. With no sign-up page to send people to, point the buttons at a `mailto:` address or at `/about/`.
- Every page, release and post needs a `description`. Features, testimonials and questions have none.
- Give every button a real destination. A plan with no `url` has no button; a landing page with no `ctaUrl` has no closing block.
- Never invent a price, a plan, a version number, a release, a customer or a quote. With no real quotes, leave `content/testimonials/` empty; with no fixed prices, write one plan with `price` "On request", or leave `plans` empty and explain on the pricing page.
- `data/navigation.json` is written from the preset above.

## Rules for the theme builder

**Every theme renders**

- `base.html`, on every page, without JavaScript: `site.title` linking to `/`, the menu from `nav`, and `data.footer.html` when the site has one. A link to `/changelog/` outside the menu only when `collections.changelog` has items.
- `landing.html`: `page.title` as the `h1`; `page.heroTagline`; a main button when `page.heroCtaUrl` is set (label `heroCtaLabel`, else from `strings`) and a second one when `page.heroSecondaryUrl` is set; `page.heroImage` with `page.heroAlt` only when set; `page.content` when not empty. Then, each only when it has entries and each under its `page.…Heading` or, when that is blank, a heading from `strings`: `collections.features` (title and content), `data.pricing.plans`, `collections.testimonials` (content as a quotation, then `author` and `role`, either of which may be missing), `collections.faq` (title as the question, content as the answer, readable without JavaScript). Last, when `page.ctaUrl` is set: `page.ctaHeading` if set and a button (label `ctaLabel`, else from `strings`). The newest releases on this page are the theme's choice.
- `page.html`: `page.title` as the `h1`, `page.description` as the intro, the plans when `page.showPricing` is true, then `page.content`. A page with `heroTagline` set but no `template` key is an older home page: give it the hero (title, tagline, buttons, image) above its body, in place of the heading, the intro and the plans.
- A plan, wherever plans are printed: `name`; `price` with `/` and `period` when `period` is set; `tagline`; `features` as a list; a button to `url` (label `cta`, else from `strings` plus the name) only when `url` is set; a mark with a word from `strings` when `featured`.
- `changelog.html` (the list at `/changelog/`): per item its date in `<time datetime>`, `version` and `tag` when set, the title linked to `item.url`, the description when set; pagination when `pagination.multiple`; a line from `strings` when the list is empty.
- `release.html`: date, `version` and `tag` when set, `page.title` as the `h1`, `page.description` when set, `page.content`, a link back to `/changelog/`.
- `list.html`, `post.html`, `404.html` as in every family. `list.html` draws the blog index and tag pages, never the changelog.
- Buttons keep their `data-cta` hooks for the `sales-analytics` plugin: `hero`, `hero-secondary`, `footer`, `plan-<name>`.
- Tag colour is keyed on the option value: `Improved` and `Fixed` each have their own rule, and `New` is the theme's default release colour. A release with no tag gets no chip and that same default colour (in `launch`, `--color-new`).
- Every interface word comes from `strings`. Link values are used as written.

**Every theme tolerates**

- A landing page with nothing but `title`: no tagline, no buttons, no body, every collection empty, no `pricing.json`. Each missing part is left out with no empty box, heading or stray punctuation.
- One feature or twelve; a feature with no body; one testimonial or eight, with `author` only, `role` only or neither; one question or twenty; an answer holding a list, a link and code.
- One plan or six; a plan with only `name` and `price`; a 35-character `price`; a 25-character `period`; a 24-character one-word `name`; eight `features` of two lines each; no plan `featured`, or two.
- One release or two hundred, ten to a list page. Anything drawn across the list (a rail, numbering) must look right for any count and may restart on the next page.
- A release with only `title` and `date` (no description, no version, no tag, no body); a 30-character `version`; a title of 2 characters and one of 90; an unbreakable word of 40 characters in a title, a plan, a feature or a table cell; a long bare URL in body text — at 320px wide with no sideways scroll.
- Past and future dates. Never write "upcoming", "today", "this week" or an age ("3 days ago") into the page; calling the first items of the list the latest is fine.
- `mailto:` and `tel:` in every link value.
- Body Markdown of any kind: `h2`–`h4`, nested lists, three-column tables, blockquotes, code blocks, `hr`.
- No images anywhere. Never reserve space for one.

## Changes from `themes/launch`

None. The block above is `launch`'s `starter.json`, `theme.json` layouts, templates, content templates and `sample/data/pricing.json` shape as shipped.

Declined:

- Declaring `showPricing` as a typed field of `pages` — the bare key already works and the editor keeps it, as with the `show…` keys of every other family; no rule needs the field.
- A `data/contact.json` with `email` and `phone` as a fallback for buttons — every link value already takes `mailto:` and `tel:`, and the address lives on the about page.
- A "Contact" entry in the navigation preset, or replacing "Home" — the second is a removal; the first is not needed, since `/about/` carries the contact details.
- Lower-case `tag` keys with labels from `strings` — renames the three options and needs an engine lookup the template language does not have.
- Making `author` required on `testimonials` — tightening a field breaks sites that left it out.
- A number type for `order` — an engine change; the two-digit rule above covers it.
- A loop limit or "newest item" in templates, and named feed objects — engine features, not content.
- `data/footer.json` in the sample set — it belongs to the site.
- A site-level call to action for the masthead — a new key no rule needs; the hero and the closing block carry the buttons.
