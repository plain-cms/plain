# Personal page and CV — family contract

For one person presenting a career — a job seeker, a freelancer, a chef, a ship's officer, an interim director: a short who-I-am page and a dated record of roles. The record is the CV: it reads as a page on screen and prints on A4.

Every theme in this family reads exactly the content described here, so a site can change theme without changing a content file. The block below is the contract in machine-readable form; the test suite and the theme harness compare every theme of the family against it.

```json
{
  "family": "personal",
  "title": "Personal page and CV",
  "collections": {
    "experience": {
      "path": "content/experience",
      "urlPattern": "/experience/:slug/",
      "template": "role",
      "listUrl": "/experience/",
      "listTemplate": "cv",
      "label": "Experience",
      "sortBy": "date",
      "sortOrder": "desc",
      "pageSize": 50,
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "date", "type": "date", "required": true },
        { "name": "organization", "type": "text" },
        { "name": "period", "type": "text" },
        { "name": "location", "type": "text" },
        { "name": "summary", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "highlights", "type": "list" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "CV", "url": "/experience/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {
    "profile.json": {
      "name": "",
      "role": "",
      "email": "",
      "links": [
        { "label": "", "url": "" }
      ],
      "skills": [""]
    }
  },
  "templates": ["cv", "role"],
  "layouts": [],
  "contentTemplates": ["role.md"],
  "contentClasses": []
}
```

This is the contract of the shipped theme `folio`, unchanged, plus one optional field: `experience` gains `description` after `summary`. Every role gets a page, the build warns about a page with no description, and without the field the editor offers nowhere to type it. Content written before the change builds and looks as it did.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/experience/<slug>.md` | one role: an entry on the CV at `/experience/`, and a page of its own at `/experience/<slug>/` |
| `content/pages/index.md` | the home page `/` |
| `content/pages/contact.md` | `/contact/` |
| `content/posts/<slug>.md` | optional: one dated note at `/blog/<slug>/`, listed newest first at `/blog/` |
| `data/profile.json` | the name, headline, e-mail address, links and skills printed beside every page and at the head of the CV |

The menu is Home, CV, Contact. Its URLs are fixed, so the file name `contact.md` is fixed too. A site in another language keeps file names, URLs and field names and translates only the labels: the menu in its own `data/navigation.json`, the collection's `label` in its `site.config.json`. The engine builds `/experience/` itself: do not write a page for it.

`pages` and `posts` are the engine's standard collections and are not changed here. A page has `title` (required), `description` and `draft`. A post has `title` (required), `date` (required, `YYYY-MM-DD`), `description` (printed under the title on `/blog/`, so write it as a sentence a visitor reads), `tags` (a list of one to three words), `cover` (the path of a picture the customer supplied; otherwise leave it out) and `draft`. Posts are optional; the menu does not link `/blog/`, so a site that posts links it from the home page or adds a menu entry of its own. `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract.

The site title is normally the person's name. There is no image field in `experience`, in `pages` or in `profile.json`: no portrait, no logo.

## Collection `experience`

One item is one line of a CV: a job, a contract, a ship, a production, a course of study, a qualification, a voluntary post, a career break. Five to ten is usual; one is allowed, and so are fifty.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | What the person was or gained: the role, rank, part or qualification — not the employer. The heading of the entry and of its page. | `Head chef`, `BSc Computer Science` |
| `date` | date | yes | The day the role began, or the day a certificate was awarded, `YYYY-MM-DD`. It sorts the CV. It is printed, written out, only when `period` is blank. Where only a month or a year is known, use its first day. A future date is fine for a role not yet started. | `2021-03-01` |
| `organization` | text | no | The employer, client, school, ship or production. Leave out for a career break or self-employment with no trading name. | `The Harbour Kitchen` |
| `period` | text | no, but nearly always | The dates as the CV should print them, in the site's language. "Present" is the author's word: the site does not know today's date, so edit it, and the tense of `summary` and `description`, when the role ends. | `2021–present`, `2016–2019`, `Summer 2014` |
| `location` | text | no | The town and country, or how the work was done. | `Bristol`, `Remote (EU)` |
| `summary` | text | no, but nearly always | One sentence on what the job was — its scope and scale. Printed under the title on the CV and at the top of the role's page. Plain text, no Markdown, up to about 160 characters. | `Run a 60-cover seafood kitchen and a brigade of seven.` |
| `description` | text | no, but always write it | One sentence for search engines and link previews. It is not printed on the page, and it is read with nothing around it, so name the person, the role and the place. The build warns when it is missing — also for a role with no body. | `Dana Whitlock has been head chef at The Harbour Kitchen in Bristol since 2021.` |
| `highlights` | list | no | Up to four things achieved, one line each: plain text, no Markdown, no full stop at the end, a number where the customer gave one. Printed as a list under the summary, on the CV and on the role's page. | see the example file |
| `draft` | boolean | no | `true` keeps the item off the site. Default `false`. | `false` |

There are no select fields.

**Body.** Optional Markdown: the longer story of the role, for a reader who clicked through. The title, summary and highlights are already printed above it, so do not repeat them. A role **with** a body has its title linked from the CV to its page; a role **without** one is plain text on the CV, and its page shows only the fields. Give a body to the two or three roles that matter and leave it off the rest.

**One list.** Jobs, education and voluntary work are all items of the same list. No field tells them apart and the CV cannot group them under headings, so the title must say what the entry is (`BSc Computer Science`, `Volunteer mentor`).

**What goes where.** A theme may set `organization` apart as a label and `location` as a stamp, so file every entry the same way:

| Entry | `title` | `organization` | `location` | `date` |
| --- | --- | --- | --- | --- |
| A job or assignment | the job title | the employer or client; a description (`A listed UK retailer`) when it is confidential | the town | the first day |
| A stage or screen credit | the part played | the production, then the company or broadcaster: `Macbeth, Royal Exchange Theatre` | the venue's town, or `Film`, `Television`, `Radio` | the first performance or release |
| A ship | the rank or capacity | the vessel, then the operator: `MV Northern Wave, Halvard Shipping` | the trade or route: `North Sea` | the day of signing on |
| A degree or course | the award | the school | the town | the first day of the course |
| A certificate or licence | its name | the awarding body | leave out | the day it was awarded |
| A career break | what it was: `Parental leave` | leave out | leave out | the first day |

The director of a production, and the type and size of a ship, go in `summary`.

**Order.** Newest `date` first. Two items with the same date follow file-name order. To move an entry, change its date — there is no other ordering field.

**URLs.** The file name is the address: `head-chef-harbour-kitchen.md` is `/experience/head-chef-harbour-kitchen/`. The CV is `/experience/`, fifty entries to a page; a fifty-first starts `/experience/page/2/`.

**Length.** The CV prints on A4. About eight entries with two highlights each fill one sheet; more runs onto a second.

## Data file `data/profile.json`

Who the site is about. Keep every key in the file; leave a string `""` and a list `[]` when there is nothing to say.

| Key | Meaning | Format | Example | When blank |
| --- | --- | --- | --- | --- |
| `name` | The person's name, as at the head of a CV | one line of text | `Dana Whitlock` | The theme prints the site title in its place. |
| `role` | What they do, as a headline | one line of text, up to about 80 characters | `Head chef — seafood, open fire, small brigades` | Left out. |
| `email` | The address to write to | one e-mail address | `dana@danawhitlock.example` | No `mailto:` link is printed. |
| `links` | Other ways to reach or check the person, printed in the order given | a list of `{ "label", "url" }` objects. `label` is the text shown; `url` begins `tel:`, `https://` or `mailto:` | `{ "label": "07700 900142", "url": "tel:+447700900142" }` | `[]`: nothing is printed. |
| `skills` | What they are good at, including languages and licences | a list of short strings, five to ten, each a few words | `"Whole-fish butchery"` | `[]`: no skills heading is printed. |

A phone number is an entry in `links`: the label is the number as the person writes it, the URL is `tel:` followed by the number in international form with no spaces. Put it first. For a web address the label is the address itself, without `https://` and without a closing slash (`linkedin.com/in/danawhitlock`), never a word such as "LinkedIn" or "Website": the printed CV shows the label and not the URL. Add a word only where the address does not explain itself: `Agent: hartleymanagement.example`. Every entry needs both a label and a URL, so a postal address does not go here — write it on the contact page.

With no `profile.json` at all, a theme shows no profile and heads the CV with the collection's label.

## Pages

Both are plain Markdown. This family has **no content classes**: page text contains no raw HTML and no class names, and a theme must not ask for any. A phone number in page text is a link, `[07700 900142](tel:+447700900142)`, and so is an e-mail address, `[dana@danawhitlock.example](mailto:dana@danawhitlock.example)`.

A page's `title` is its main heading. Its `description` is for search engines and link previews and is **not printed**; the first paragraph of the body is the opening line, and a theme may set it larger — keep it to one or two sentences.

`index.md` — the home page. `title` is the headline: what the person does or offers, as a statement ("Seafood kitchens that run calm"), never "Home" and never just the name, which is already printed beside it. `description` says who, what and where. The body: an opening line with the one fact a visitor needs first (available from when, looking for what), in bold if it is a status; a short paragraph on who the person is; what people hire them for, as a list of up to three; a closing line linking the CV at `/experience/` and `/contact/`.

`contact.md` — as far as the customer told you: the best way to get in touch first, as a `mailto:` link; the phone as a `tel:` link with the hours it is answered; where the person is based and how far they travel; what to put in a first message. Never a form.

## Examples

`content/experience/head-chef-harbour-kitchen.md`

```markdown
---
title: Head chef
date: 2021-03-01
organization: The Harbour Kitchen
period: 2021–present
location: Bristol
summary: Run a 60-cover seafood kitchen and a brigade of seven, with a menu that changes with the day's landing.
description: Dana Whitlock has been head chef at The Harbour Kitchen in Bristol since 2021, running a 60-cover seafood kitchen.
highlights:
  - Cut food waste from 9% to 4% of purchases by buying whole fish and writing the menu daily
  - Kept all seven of the brigade through two years in which the trade lost a third of its cooks
---

The Harbour Kitchen buys from two day boats and writes its menu at ten in the morning, when the fish has been seen.

## How the kitchen runs

Four days on, three off, for everyone including me. Nobody works a double.
```

`content/pages/index.md`

```markdown
---
title: Seafood kitchens that run calm
description: Dana Whitlock is a head chef in Bristol with fifteen years in seafood kitchens, looking for her next kitchen from September 2027.
---

**Looking for my next kitchen from September 2027.** Bristol, Bath or the coast between.

I have cooked fish for fifteen years, the last six as head chef, in kitchens of four to twelve.

What owners bring me in for:

- **Margins.** Whole-fish buying and a daily menu, costed before service.
- **A brigade that stays.** Rotas people can live on, and cooks who are taught.
- **Openings.** Two kitchens opened from an empty room.

The dates and the numbers are on the [CV](/experience/), which prints on a sheet of A4. If it sounds like your kitchen, [get in touch](/contact/).
```

`content/pages/contact.md`

```markdown
---
title: Contact
description: How to reach Dana Whitlock. E-mail is best, with a reply within two days.
---

**E-mail is best: [dana@danawhitlock.example](mailto:dana@danawhitlock.example).** I reply within two days.

Between services you can ring [07700 900142](tel:+447700900142), Tuesday to Saturday from three to five.

Tell me where the kitchen is, how many covers, and when you need someone. I am based in Bristol and will travel an hour for the right room.
```

`data/profile.json`

```json
{
  "name": "Dana Whitlock",
  "role": "Head chef — seafood, open fire, small brigades",
  "email": "dana@danawhitlock.example",
  "links": [
    { "label": "07700 900142", "url": "tel:+447700900142" },
    { "label": "danawhitlock.example", "url": "https://danawhitlock.example" }
  ],
  "skills": [
    "Whole-fish butchery",
    "Menu costing",
    "Brigade training",
    "Level 3 food safety",
    "English, Romanian"
  ]
}
```

## Rules for the author

- Write only what the customer told you. Never invent an employer, a date, a figure, a qualification, a phone number, answering hours or a travel distance: leave the field or the sentence out. A role with only `title` and `date` is complete, `highlights` may be one line or none, and a contact page with one `mailto:` link is complete.
- Frontmatter is flat: `key: value` on one line, or `key:` followed by indented `- item` lines for a list, with no blank line inside the list. No nesting and no multi-line values. Leave a field with nothing to say out altogether: a key with nothing after it (`location:`) stops the build. Put a value in double quotes if it is the bare word `true` or `false`, or if it begins with a quotation mark (`organization: ""The Crown" (series 4)"`).
- File names use only a-z, digits and hyphens. Write `ae`, `oe`, `ue`, `ss` for German umlauts and drop every other accent (é becomes e, ș becomes s); titles keep their real spelling.
- Dates are `YYYY-MM-DD`.
- Every role, page and post has a `description`.
- Images are optional everywhere, and this family adds no field for one. Write the site so that it is complete with none; never invent an image path.
- A picture the customer supplied (a headshot) may go in the body of the home page or of a role as a Markdown image with alt text that describes it: `![Dana Whitlock at the pass](/media/2027/01/dana-whitlock.jpg)`. Use only a file you were given, and at most one per page.
- Contact is the `mailto:` link and the `tel:` link. Do not write a form or promise one.
- Use the same phone number and e-mail address in `profile.json` and on the contact page.
- The site cannot know today's date. Wording that goes stale ("present", "since 2021", "from September 2027", a `summary` in the present tense) may appear in a role's `period`, `summary` and `description`, in a page's `description`, in the `role` key of `profile.json` and in page text. When a role ends, edit its `period`, `summary` and `description` together.
- `summary` and `highlights` are plain text. Markdown in them is printed as typed.
- Do not add keys the contract lacks (a photo, a kind of entry, an end date, a phone key). Say it in the title, the period or the body.
- Interface words ("Skills", "Experience", "Read the CV", the print note) belong to the theme. Do not repeat them in content.

## Rules for the theme builder

A theme ships the templates `base`, `page`, `post`, `list`, `404`, `cv` and `role`; `content-templates/role.md`; a `starter.json` whose `collections` and `navigation` equal the block above, with no `plugins`; no `layouts` in `theme.json`; and a `sample/data/profile.json` with all five keys. Partials are the theme's own business.

What every theme renders:

- **On every page:** the site title, the menu, and a profile block when `data.profile` exists: `name` (or `site.title` when blank), `role`, `email` as a `mailto:` link, every entry of `links` in order as `<a href="{{ link.url }}">{{ link.label }}</a>`, and a link to `/experience/`. `skills` may be printed there too. On the CV the letterhead may stand in for the block. With `email` blank and `links` empty, no empty list is left behind.
- **`cv`** (the list at `/experience/`): a letterhead with `name` as the `h1` (`site.title` when `name` is blank), `role`, `email` and `links`; with no `profile.json`, the `h1` is `page.title`. Then every item of `items`, in the order given: `title`, `organization`, `period`, `location`, `summary` and each of `highlights`. When `period` is blank, print `<time datetime="{{ entry.date }}">{{ entry.dateFormatted }}</time>` in its place. Link the title to `entry.url` only inside `{{#if entry.content}}`. Then `skills` under a heading from `strings`, the pagination links when `pagination.multiple`, and a line from `strings` when `items` is empty.
- **`cv` on paper:** A4 portrait, dark ink on white whatever the screen colours; the menu, the profile block, the footer and any button removed; the e-mail address and link labels printed as text; no entry split across two sheets; the theme's own sample CV on one sheet.
- **`role`:** `title` as the `h1`, `organization`, `period` (or the date, as above), `location`, `summary`, `highlights`, the body, and a link back to `/experience/`.
- **`page`:** `title` as the `h1`, then the body. `description` is never printed, on a page or a role.
- **`list` and `post`**, for a site that posts: per item the `title` linked to `url`, `dateFormatted` and `description`; the tag as the heading on a tag page; pagination; an empty state. A post shows `title`, date, `tagLinks`, `cover` when set, and the body.
- **`404`:** links to `/` and `/experience/`.
- **In page text:** `a[href^="tel:"]` and `a[href^="mailto:"]`, a first paragraph that may be bold from end to end, ordinary Markdown, and an image no wider than its column.

A signature may draw only on the `experience` fields, the `profile.json` keys, `site.title`, `site.description` and `page.title`. Templates cannot count, group, add up years, or find the first or last item, and the build does not know today's date. So no theme marks an entry as current, labels one by its place in the list, or writes "present", "current" or "latest" in its own words; `period` says it. The newest entry may be a role that has not begun.

What every theme tolerates, with no sideways scroll at 320px and no lost text:

- no `profile.json`, and any mix of blank keys in it;
- a `name` of 30 characters that differs from the site title, a `role` of 125, an `email` of 40 with nowhere to break;
- no `links`, or six: a label that is one unbroken web address of 72 characters, and a phone number of 52 with spaces, slashes and brackets;
- no `skills`, one, or fifteen, one of them 85 characters long and one a single word of 39 letters;
- a `title` of 2 characters and one of 90, and a single unbreakable word of 34 letters as the whole title — on the CV and as the `h1` of its page;
- an `organization` of 110 characters, a `period` of 60, a `location` of 85, a `summary` of 300: none sits in a fixed-size box, and a column made for `2019–2023` still holds a sentence;
- an item with `title` and `date` and nothing else: no empty label, no dangling separator, no empty list;
- `highlights` absent, one line, or six of 150 characters;
- one entry or fifty, two on the same date, a future date, and a second page holding a single entry: position effects (`:nth-child`, counters) restart on each page and may not carry meaning. The stress site has 16 roles and does not reach a second page, so check `pagination.multiple` by hand, for example with `pageSize` lowered in a scratch copy of the site;
- ordinary Markdown in any body: `h2` to `h4`, nested lists, a three-column table with a long cell, a blockquote, a code block with a long line, a rule, a long bare URL, an image wider than the column (it shrinks to fit, on screen and on paper; the stress site has none);
- no image anywhere: a theme reserves no space for a portrait, and the CV never shows one.

Interface words come from the theme's `strings.json`: English keys at the top level, and one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. Text drawn by CSS (`content:`) counts as an interface word, so it reaches the stylesheet through an attribute filled from `strings`. A print button is progressive enhancement: rendered hidden, shown by script, with a keyboard hint beside it for a page without script. No theme emits a `<form>`.

## Left out on purpose

Raised by the audit of `folio` and declined:

- A `kind` select (work, education, volunteering, project): templates cannot group, and the list has one sort key, so the headings it exists for cannot be drawn.
- `location` and `phone` keys in `profile.json`: a phone number is already a `links` entry with a `tel:` URL, and the town fits in `role` or on the contact page.
- An `availability` key in `profile.json`: it is the opening line of the home page, where it can be a full sentence.
- A `home` layout with a status line, buttons and a "recently" extract: it needs a template name the contract does not have, and the profile block already links the CV and the e-mail address from every page.
- Aligning "CV" in the menu with "Experience" as the collection label: either change is a rename; a site sets both words in its own language anyway.
- A `cvUrl` setting: `/experience/` is fixed by this contract, so themes may link it directly.
