# Newsletter and writing — family contract

For people whose site is their writing — an essayist, a newsletter, a reviewer, a diarist, a firm that writes to its customers: dated pieces in an archive, a page about the writer and a way to subscribe. The pieces are the site; everything else points at them.

Every theme in this family reads exactly the content described here, so a site can change theme without changing a content file. The block below is the contract in machine-readable form; the test suite and the theme harness compare every theme of the family against it.

```json
{
  "family": "writing",
  "title": "Newsletter and writing",
  "collections": {},
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Archive", "url": "/blog/" },
    { "label": "About", "url": "/about/" },
    { "label": "Subscribe", "url": "/subscribe/" }
  ],
  "plugins": [],
  "data": {
    "newsletter.json": {
      "formAction": "",
      "prompt": "",
      "buttonLabel": "",
      "email": ""
    }
  },
  "templates": [],
  "layouts": [],
  "contentTemplates": ["essay.md", "page.md"],
  "contentClasses": [],
  "extras": {
    "default": { "layouts": ["page", "landing"], "contentTemplates": ["landing.md"] },
    "terminal": { "plugins": ["github-stars"] }
  }
}
```

This is the contract of the shipped theme `letters`, unchanged, plus one optional key: `newsletter.json` gains `email`. Without it a site with no mailing-list provider has no way to offer a subscription except a feed link; with it the subscribe box is a `mailto:` link. A file written before the change has no `email` and behaves as it did.

The family adds no collection, no template and no content class. Its one collection is the engine's standard `posts`, which every site already has.

## The files of a site

| File | Becomes |
| --- | --- |
| `content/posts/<slug>.md` | one piece: a line in the archive at `/blog/` and a page of its own at `/blog/<slug>/` |
| `content/pages/index.md` | the home page `/` |
| `content/pages/about.md` | `/about/` |
| `content/pages/subscribe.md` | `/subscribe/` |
| `data/newsletter.json` | the subscribe box printed at the foot of every page |
| `data/navigation.json` | the menu: the four entries of the block above, in that order, as `[{ "label": "…", "url": "…" }]` |
| `site.config.json` | `site.title`, `site.description`, and the `label` of `posts` (`collections.posts.label`) |

The menu is Home, Archive, About, Subscribe. The URLs and their order are fixed, so the file names `about.md` and `subscribe.md` are fixed too. The labels are the site's: translate them, or use the customer's own word for the archive (`Reviews`, `Diary`, `Stages`, `Issues`). On every site set the `label` of `posts` to the word the menu uses for `/blog/`: it is the heading of the archive, and it is "Blog" until changed. A site in another language keeps file names, URLs and field names. The engine builds `/blog/` itself: do not write a page for it.

`site.title` is the name of the publication or the writer, 30 characters at most. `site.description` is one plain sentence on what is written here; it is printed in the footer. Write both.

`pages` and `posts` are the engine's standard collections and are not changed here. A page has `title` (required), `description` and `draft`. `data/footer.json` and `data/strings.*.json` belong to the site, not to this contract.

## Collection `posts`

One item is one finished piece of writing: an essay, a letter, a review, a diary entry, a column. A site may open with one and grow to hundreds.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The piece's own title: its heading and its line in the archive. Not the piece's place in the run ("Letter 12") and not the bare date. A diary or log entry is titled by what happened (`The broad beans go in`), never by its day alone. A review may use the work's own title; name its author or director in the title or the description (`Middlemarch, by George Eliot`), and give a verdict or rating in the description or the body. | `Three Miles an Hour` |
| `date` | date | yes | The day the piece is dated, `YYYY-MM-DD`: the day it was sent or published, or, for a diary entry, a trail stage or a screening, the day it records. It is printed and it sorts the archive. A piece with a future date is published at once — the build does not know today's date — so hold a piece back with `draft: true`, not with its date. | `2026-03-17` |
| `description` | text | no, but always write it | One sentence, up to about 160 characters, that makes someone want to read the piece. It is the line under the title in the archive, some themes print it under the title on the piece itself, and it is what search engines and link previews show. Write it to work in all three places, and never repeat it as the first sentence of the body. The build warns when it is missing. | `On walking pace, and the things you only notice at it.` |
| `cover` | image | no | A picture shown above the text and used in link previews: a path under `/media/`. Leave it out unless the writer supplied a picture. It is decoration, shown with no alt text; a picture that says something goes in the body as `![what it shows](/media/…)`. | `/media/2026/03/towpath.jpg` |
| `tags` | list | no | None to three topics, each one or two words. A tag is also the only way to gather pieces: an issue of a zine (`issue 4`), a trail (`pennine way`), a series. Use the same tag on every piece of it, and link its page by hand where needed (`[Issue 4](/blog/tag/issue-4/)`). Every tag gets a page listing its pieces at `/blog/tag/<tag>/`, so use a tag only if several pieces will share it, and spell it the same way every time — `Walking` and `walking` are two tags fighting over one address. | `walking` |
| `draft` | boolean | no | `true` keeps the piece off the site. Default `false`. | `false` |

There are no select fields.

**Body.** The piece, in Markdown. The title is already printed above it, so start with the first paragraph and use `##` for headings inside the piece. A greeting and a sign-off (`— Nell`) are ordinary paragraphs. Code goes in a fenced block with its language after the backticks. No raw HTML and no class names.

**Order.** Newest `date` first. Two pieces with the same date follow file-name order. To move a piece, change its date — there is no other ordering field.

**Numbers.** No field numbers a piece, and a theme may number the lines of the archive by position; those numbers move when a piece is added. So never number a piece by its place in the run ("letter no. 12", "my fortieth post"). A number that belongs to the thing written about (day 7 of a walk, issue 4 of a zine, part 2 of 3) is the writer's own and never changes: write it in the title (`Day 7: Hawes to Keld`) or the body.

**URLs.** The file name is the address: `three-miles-an-hour.md` is `/blog/three-miles-an-hour/`. The archive is `/blog/`, ten pieces to a page unless the site sets another `pageSize`; the eleventh starts `/blog/page/2/`. The feed is `/blog/rss.xml`. A tag's page is `/blog/tag/` plus the tag in lowercase with accents dropped and anything but letters and digits turned into hyphens.

## Data file `data/newsletter.json`

How a reader subscribes. Keep every key in the file and leave a string `""` when there is nothing to say.

| Key | Meaning | Format | Example | When blank |
| --- | --- | --- | --- | --- |
| `formAction` | The sign-up address of the writer's own mailing-list provider: the URL its embedded form posts to, taking one field named `email` | an `https://` URL | `https://lists.example.com/subscribe/abc123` | No form is printed. This is the usual case: leave it blank unless the writer names a provider and gives this address. The address of a provider's sign-up page is not this address: leave `formAction` blank and link that page from `subscribe.md`. |
| `prompt` | The line that invites a reader to subscribe | one sentence of plain text, up to about 80 characters | `One letter at a time, by e-mail. No noise.` | The theme uses its own words. |
| `buttonLabel` | The word on the form's button; used only with `formAction` | one or two words | `Subscribe` | The theme uses its own word. |
| `email` | The address a reader writes to, to be added to the list by hand. Leave it blank when `formAction` is set; the address for replies then stands on the about page only. | one e-mail address | `nell@slowpost.example` | No `mailto:` link is printed. |

What the theme prints, at the foot of every page, is decided in this order:

1. `formAction` set: the prompt and a form with one e-mail field and the button.
2. else `email` set: the prompt and the address as a `mailto:` link.
3. else the site has a feed: the theme's own line and a link to `/blog/rss.xml`.
4. else nothing.

With no `newsletter.json` at all a theme behaves as if every key were blank. With `email` set and no provider, the writer adds each name by hand; say so on the subscribe page. A writer whose provider gives only a sign-up page has both keys blank unless names are also taken by e-mail: the box is then the feed link, and `subscribe.md` carries the link to the sign-up page.

## Pages

All three are plain Markdown. This family has **no content classes**: page text contains no raw HTML and no class names, and a theme must not ask for any. An e-mail address in page text is a link, `[nell@slowpost.example](mailto:nell@slowpost.example)`, and so is a phone number, `[01632 960142](tel:+441632960142)`.

A page's `title` is its main heading. Its `description` is for search engines and link previews, and some themes print it under the title, so write a sentence that can stand there and do not repeat it in the body.

`index.md` — the home page. `title` is a headline in the writer's voice ("One letter at a time"), never "Home" and never just the site's name, which is printed above it. `description` says what is written here and by whom. The body: who writes, about what and how often, in a short paragraph; then up to three pieces to start with, as a list of links with a few words on each. Link only pieces that exist in `content/posts/`, by their file names; with one or two pieces, link those. Then a line linking the archive at `/blog/` and `/subscribe/`. The home page does not list pieces by itself — a template cannot take "the newest three" — so choose pieces that will still be good in a year and link them by hand.

`about.md` — who the writer is and where they write from; what the pieces are about and the rules they are written under; how to reply, as a `mailto:` link. A business adds its phone number as a `tel:` link and its address as a line of text.

`subscribe.md` — what arrives, how often, and what never will; how to subscribe, in words that match `newsletter.json`: with `email`, a `mailto:` link to the same address; with `formAction`, a pointer to the box at the foot of the page; with a provider's sign-up page, a link to that page; how to leave; and a link to the feed, `[RSS feed](/blog/rss.xml)`.

A site may add further pages (an imprint, a privacy note, a reading list): any lowercase slug, the same `title` and `description`, plain Markdown. A page is reached only if something links it: append it to `data/navigation.json` after Subscribe, six entries at most, or link it from the about page's text.

## Examples

`content/posts/three-miles-an-hour.md`

```markdown
---
title: Three Miles an Hour
date: 2026-03-17
description: On walking pace, and the things you only notice at it.
tags:
  - walking
  - attention
---

Dear reader,

The towpath between the two locks is a mile and a third, and for six years I cycled it in seven minutes without once seeing the heron.

## What the bicycle hides

At twelve miles an hour a hedge is a green wall. At three it is forty plants, and one of them is always doing something.

> The speed of thought is about the speed of walking.

I sold the bicycle in January. The heron is there most mornings, by the second lock.

— Nell
```

`content/pages/index.md`

```markdown
---
title: One letter at a time
description: Essays on attention, walking and notebooks by Nell Whitcombe, written slowly and sent when they are finished.
---

Dear reader,

I'm Nell Whitcombe. I edit other people's sentences for a living, and every few weeks I write a letter of my own and send it to everyone who has asked for one.

If you are new, three to start with:

- [Why Letters](/blog/why-letters/) — the first one, and the reason for the name.
- [Three Miles an Hour](/blog/three-miles-an-hour/) — the one people forward.
- [The Reply I Didn't Send](/blog/the-reply-i-didnt-send/) — the one that gets the most replies.

Everything is in the [archive](/blog/), newest first. New letters arrive by [e-mail](/subscribe/) the morning they are finished.

— Nell
```

`content/pages/about.md`

```markdown
---
title: About
description: Who writes these letters, and the small rules they are written under.
---

I'm Nell Whitcombe. By day I copy-edit other people's books from a back room in Duluth, Minnesota.

Each letter is about one thing, is finished before it is sent, and runs to about five hundred words. There is no schedule beyond "when it's done", which in practice means every four or five weeks.

Every letter takes replies. Answer the e-mail, or write to [nell@slowpost.example](mailto:nell@slowpost.example).
```

`content/pages/subscribe.md`

```markdown
---
title: Subscribe
description: New letters by e-mail, the morning they are finished. Nothing else, ever.
---

New letters arrive by e-mail every four or five weeks, never more than one at a time. No digests and no announcements.

To be added to the list, write to [nell@slowpost.example](mailto:nell@slowpost.example) with the word *subscribe*. I add every name by hand. Leaving is one line back to me.

Prefer a feed reader? The [RSS feed](/blog/rss.xml) lists every new letter the moment it is published.
```

`data/newsletter.json`

```json
{
  "formAction": "",
  "prompt": "One letter at a time, by e-mail. No noise.",
  "buttonLabel": "",
  "email": "nell@slowpost.example"
}
```

## Rules for the author

- Frontmatter is flat: `key: value` on one line, or `key:` followed by indented `- item` lines for a list. No nesting and no multi-line values. Put a value in double quotes only if it is a bare number or the bare word `true` or `false` — a piece titled `"1984"`. Inside a title or description use typographic quotation marks (“ ”, „ “, « »), never straight ones: a value that begins and ends with a straight quote loses them. Leave out a key that has no value; `cover:` or `description:` with nothing after it stops the build. A colon inside a value is fine (`title: Day 7: Hawes to Keld`).
- File names use only a to z, digits and hyphens. Make the name from the title: lowercase, hyphens for spaces, no punctuation, shortened to its first three to six words if it is long. Write `ae`, `oe`, `ue`, `ss` for ä, ö, ü, ß and drop every other accent (é becomes e, ñ becomes n, ă becomes a). Each name is used once: add the year or a word when two titles would give the same name (`march-2026.md`). Titles keep their real spelling.
- Dates are `YYYY-MM-DD`.
- Every piece and every page has a `description`.
- Images are optional everywhere. Write the site so that it is complete with none: no `cover`, no picture in a body. Never invent an image path.
- Contact is `mailto:` and `tel:` links, never a form. The only form in this family is the subscribe box, and only when the writer already has a mailing-list provider and has given its sign-up address; otherwise leave `formAction` blank, and set `email` when readers subscribe by writing to the writer.
- When `email` is set, use that same address on the subscribe page and on the about page.
- The site cannot know today's date. Do not write "this week's letter" or "the latest" on a page; on the home page link pieces by name.
- Do not add keys the contract lacks (a subtitle, an author, a series, a rating, a reading time). Say it in the title, the description or the body. A series or an issue is a tag. For numbers see Numbers above.
- Interface words ("Archive", "Filed under", "Back to the archive", "Follow by RSS") belong to the theme. Do not repeat them in content.

## Rules for the theme builder

A theme ships the templates `base`, `page`, `post`, `list` and `404`; `content-templates/essay.md` (a piece) and `page.md`; a `starter.json` with `"collections": {}`, the `navigation` of the block above and no `plugins`; no `layouts` in `theme.json`; and a sample of the three pages, six to twelve pieces and a `sample/data/newsletter.json` holding all four keys, with `formAction` blank and `email` set. Partials are the theme's own business.

What every theme renders:

- **`base`**, on every page: `site.title` linking to `/`; the menu from `nav`, with `aria-current` on the current entry; the page; the subscribe box; a footer with `site.title`, `site.description` and `data.footer.html` when set; a `<link rel="alternate">` for each of `feeds`.
- **The subscribe box**, once, after `<main>` and before the footer, in the order given under `newsletter.json`. In cases 1 and 2 the heading is `prompt`, or the theme's words from `strings` when it is blank. In case 3 the heading is always the theme's own feed line from `strings`; `prompt` is not printed there, because it invites the reader to e-mail. The form is `<form method="post" action="{{ data.newsletter.formAction }}">` holding one labelled `<input type="email" name="email" required>` and a button reading `buttonLabel` or a word from `strings`. The `mailto:` link shows the address itself as its text and its `href` is `mailto:` plus `email` as written. The feed link is printed only inside `{{#if feeds}}`. With nothing to print, no box, heading or rule is left behind. This is the only `<form>` a theme emits.
- **`list`** — the archive, its later pages, and every tag page. The `h1` is `page.title` (the collection's label), or on a tag page the `tag` itself with a word from `strings`, because the engine's own title for a tag page is English. Then every item of `items` in the order given: `title` linked to `url`, `<time datetime="{{ item.date }}">` showing `dateFormatted` or the date, and `description` when set. Tags may be shown. Then the pagination links when `pagination.multiple`, and a line from `strings` when `items` is empty.
- **`post`**: `title` as the `h1`; the date as a `<time>`; every entry of `tagLinks` linked to its page; `cover` when set, with `alt=""`; the body; a link back to `/blog/`. `description` may be printed under the title as a standfirst or left out, nowhere else. A reading time is optional: `page.readingTime` when the site's plugin sets it, or progressive enhancement.
- **`page`**: `title` as the `h1`, `description` under it or not at all, then the body.
- **`404`**: links to `/` and `/blog/`.
- **In a body** — this family is long reading, so the body is where a theme earns its keep: a measure of 60 to 75 characters; paragraphs, `h2` to `h4`, nested lists, a blockquote of one paragraph or several, inline code, a code block that scrolls inside itself, a table that never widens the page, a rule, an image scaled to the column, `a[href^="mailto:"]` and `a[href^="tel:"]`, and a closing line that begins with a dash.

A signature may draw only on a piece's `title`, `date`, `dateFormatted`, `description`, `tagLinks` and `url`, on `nav`, `site.title`, `site.description` and `page.title`. It may not depend on `cover` (most sites have none) or on `newsletter.json` (the box may be absent). `tagLinks` and `description` may be absent as well. A signature may use them, but it must be carried by `title` and `date` alone on a piece that has neither. A tagless piece is a complete line, not a broken one. Templates cannot count, group, slice, or find the first or last item, and the build does not know today's date. So no theme labels a piece "latest", "new" or "this week", none lists "recent" pieces on the home page, and a number given by position (a list marker, a CSS counter) is decoration: it restarts on each archive page, so show it only where it is true or not at all.

What every theme tolerates, with no sideways scroll at 320px and no lost text:

- no `newsletter.json`, and any mix of blank keys; a `prompt` of 140 characters; a `buttonLabel` of 36; an `email` of 44 with nowhere to break;
- a `title` of 2 characters and one of 81, and a single unbreakable word of 37 letters as the whole title — in the archive and as the `h1` of its page;
- no `description`, or one of 320 characters;
- no tags, or six: one of 38 characters with spaces, one a single word of 26, and a tag used by one piece only;
- a piece with `title` and `date` alone and a one-line body: no empty standfirst, no empty tag list, no dangling separator;
- one piece or forty; ten to an archive page, so a second page may hold a single line; two pieces on the same date; dates years apart, past and future;
- ordinary Markdown in any body: `h2` to `h4`, a list nested three deep, a three-column table with a long cell, a blockquote, a code block with a line of 140 characters, a rule, a bare URL of 135 characters, a phone link of 50;
- a site title of up to 30 characters, with an ampersand; four menu entries, or six; any word as the archive's heading;
- a page the menu does not link, and a piece or page whose `template` names a layout the theme lacks (the engine falls back to the collection's template);
- no image anywhere: a theme reserves no space for a cover, a portrait or a logo.

Interface words come from the theme's `strings.json`: English keys at the top level, and one object each for `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl`. Text drawn by CSS (`content:`) counts as an interface word, so it reaches the stylesheet through an attribute filled from `strings`. A decorative copy of a contract field (for example `data-title="{{ item.title }}"` read with `attr()`) is content, not an interface word, and is allowed, provided the real text is also in the HTML and the page loses nothing when the copy is absent. A theme reads no frontmatter key and no data key that is not in this file, apart from the legacy `landing` template in `default` (see below).

## Left out on purpose

Raised by the audits of `letters`, `terminal` and `default` and declined:

- Declaring `pages` and `posts` in the starter, with `label: "Archive"` and `pageSize: 50`: a starter that declares them replaces the site's own definitions on apply. The label and the page size are the site's; a theme works with any.
- A `home` layout that lists the newest pieces: it needs a template name the contract does not have, and a template cannot slice a list, so it would print the whole archive. The home page links up to three pieces by hand.
- A `number` field or an engine ordinal for stable numbering: numbers are one theme's ornament, not the family's content.
- The `landing` layout of `default`, its hero keys and its `features`, `testimonials` and `faq` collections: a sales page is another family's job, and seven themes would each have to ship it. `default` is the engine's own theme and shipped the layout before the family existed, so it keeps `templates/landing.html`, `content-templates/landing.md` and `"layouts": ["page", "landing"]` as a legacy extra (the `extras` key of the block above), and sites already using it lose nothing on upgrade. It is not part of the contract, no other theme ships it, a content agent never writes a landing page for this family, and a site that changes theme falls back to `page`.
- A `lede` field on pages (`terminal`): `description` is the line under the title.
- `coverAlt` on posts: a cover is decoration; a picture that says something goes in the body with its own alt text. A change to `posts` would also be a change for every family.
- `data/contact.json` or a site-wide e-mail key: `newsletter.json` now carries the address to write to, and the about page carries the rest.
- `github-stars` and `reading-time` in the contract's `plugins`, and Search, Projects or Contact in the menu: none is letters' contract, the first loads from another site, and a site adds plugins and menu entries of its own. `terminal` shipped with `github-stars` in its starter before the family existed and keeps it as a legacy extra (`extras` in the block above); no new theme declares a plugin.
- Engine changes — a tag-page title from `strings`, previous and next pieces, a capped loop, wrapped tables and code lines, a content-template picker filtered by collection, a starter merge that keeps a site's fields: all are outside a content contract.
