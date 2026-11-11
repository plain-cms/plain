# classes — Studio and classes

For places that teach groups on a weekly timetable: yoga and Pilates studios, gyms, dance, swimming, music and language schools, evening classes. The site answers three questions — when can I come, who teaches, how do I try it — so the weekly timetable is the main object and the instructors are the only collection.

Contract source: `themes/form`. Themes: `form` (shipped); `lanes`, `bout`, `crux`, `lexicon`, `etude`, `tearoff`, `barre` (planned). Every theme in the family carries exactly the contract below, so a site switches between them with no content change.

```json
{
  "family": "classes",
  "title": "Studio and classes",
  "collections": {
    "instructors": {
      "path": "content/instructors",
      "urlPattern": "/instructors/:slug/",
      "template": "instructor",
      "listUrl": "/instructors/",
      "listTemplate": "list",
      "label": "Instructors",
      "sortBy": "title",
      "sortOrder": "asc",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "discipline", "type": "text" },
        { "name": "description", "type": "text" },
        { "name": "photo", "type": "image" },
        { "name": "draft", "type": "boolean", "default": false }
      ]
    }
  },
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "Schedule", "url": "/schedule/" },
    { "label": "Instructors", "url": "/instructors/" },
    { "label": "Contact", "url": "/contact/" }
  ],
  "plugins": [],
  "data": {
    "schedule.json": {
      "trialNote": "",
      "days": [
        {
          "day": "",
          "classes": [
            { "time": "", "name": "", "who": "", "level": "" }
          ]
        }
      ]
    }
  },
  "templates": ["instructor"],
  "layouts": [],
  "contentTemplates": ["instructor.md", "timetable-page.md"],
  "contentClasses": []
}
```

Not repeated in the block because they are universal: the `pages` and `posts` collections (defined in the site's own `site.config.json`) and the templates `base`, `page`, `post`, `list`, `404`. This family changes neither collection; it adds one page frontmatter key, `showSchedule` (see Pages). Partials are each theme's own business.

## Collection `instructors`

One item is one person who teaches. File `content/instructors/<slug>.md`; the file name is the URL: `maya-lindqvist.md` → `/instructors/maya-lindqvist/`. All instructors are listed at `/instructors/`, ten to a page (`/instructors/page/2/` …). A lone teacher still writes one instructor file.

| Field | Type | Required | Meaning and format | Example |
| --- | --- | --- | --- | --- |
| `title` | text | yes | The person's name as it should be read. It is the page heading, the link text in the list and the sort key. | `Maya Lindqvist` |
| `discipline` | text | no | What they teach, in a few words. Separate several with ` · `. Blank: the line is left out. | `Vinyasa · Slow Flow` |
| `description` | text | yes, by rule | One sentence: what they teach and what the class is like. Shown under the name in the list and used as the page's search and share text. A missing one is a build warning. | `Teaches the sunrise classes — steady, unhurried, and kind to stiff hips.` |
| `photo` | image | no | Root-relative path to a portrait under `/media/`. Blank: no picture and no empty box. | `/media/2026/03/maya.jpg` |
| `draft` | boolean | no | `true` keeps the person off the site. Default `false`. | `false` |

Body: two to four short paragraphs — what they teach on the timetable, what a first-timer should expect, one detail about them. The body may be empty.

Sorting: by `title`, A to Z, exactly as written — so by first name when names are written first name first. Capitals sort before lower case, and a name starting with an accented letter (Ä, Ö, Ş) sorts after Z. There is no manual order and no "featured" person; do not prefix names with numbers.

There are no select fields in this family.

## Data file `data/schedule.json`

The weekly timetable. It repeats every week; it holds no dates.

| Key | Format | Meaning | Example |
| --- | --- | --- | --- |
| `trialNote` | string, plain text | One sentence on how a first visit works. No HTML, no Markdown, no links. Blank: printed nowhere. | `First class free — come 10 minutes early and say hi at the desk.` |
| `days` | list | One block per day, shown in the order written, Monday first. List each day that has classes. Add a day with `"classes": []` only when the place teaches on five or more days and visitors need to see that it is closed that day; a place with two or three class days lists only those. | |
| `days[].day` | string | The day's label: the weekday name in the site's language, spelled in full. A short qualifier is allowed when the day is not weekly (`Saturday (even weeks only)`); a theme's optional today marker then skips that block. | `Monday` |
| `days[].classes` | list | That day's classes, shown in the order written — write them in start-time order. An empty list `[]` shows the day as having no classes. | |
| `classes[].time` | string | When the class starts, as the audience writes it, in one style for the whole file. Begin with the hour (`07:00`, `7:00 AM`, `7 Uhr`). Add the end as a range only when the length matters and differs between classes (`18:00–19:30`); otherwise say the usual length once in the schedule page body. At most 25 characters. | `07:00`, `7:00 AM` or `18:00–19:30` |
| `classes[].name` | string | The class name. | `Sunrise Vinyasa` |
| `classes[].who` | string | Who teaches it, as said at the desk — first name or full name. The theme adds its own word for "with". It is not a link and need not match an instructor's `title`. `""` when nobody is named. | `Maya` |
| `classes[].level` | string | Who it is for, in one to three words; printed as written, no value is special. `""` when it does not apply. | `All levels`, `Beginner`, `Ages 6–8` |

Always write all four keys on a class, using `""` for a blank. The theme never sorts, groups, counts or filters the timetable: what the file says is what the page shows.

Every site has this file with at least one day and one class: the menu, the 404 and every instructor page link to `/schedule/`. (A theme still copes without it: if `days` is empty or the file is missing, no timetable is printed anywhere.)

Teaching by arrangement (one-to-one music or swimming lessons, private tuition) is written as one row per teaching window: `{ "time": "15:00–19:00", "name": "Piano lessons", "who": "Clara", "level": "By arrangement" }`. Group classes (choir, theory, ensemble) are ordinary rows. Say how to book a lesson in `trialNote` and on the contact page.

Where a class happens: with one address, it goes on the contact page only. When the place differs by class, put it in `name` in brackets (`Life drawing (Scout Hall)`, `Stage 2 (teaching pool)`) and give each address on the contact page. Never put it in `day` or `level`.

## Pages

A site has three pages besides the generated instructor pages. The slugs are fixed — themes link to `/schedule/` and `/contact/` directly.

Page frontmatter: `title` (required), `description` (required by rule; shown as the intro line under the title), `showSchedule` (optional boolean; `true` prints the timetable between the page heading and the body), `draft`.

| File | URL | `showSchedule` | Contains |
| --- | --- | --- | --- |
| `content/pages/index.md` | `/` | `true` | `title` is the home headline (not "Home"); `description` is the one- or two-sentence pitch. Body: how the place works, who it is for, where a beginner should start, with links to `/contact/` and `/instructors/`. |
| `content/pages/schedule.md` | `/schedule/` | `true` (required) | Body: what the levels or grades mean, when doors open, the usual class length, where holiday changes are posted. A school that runs in terms or course blocks adds a `## Term dates` section (a short list: term name, first and last day, written out in full) and says how to enrol, with a link to `/contact/`. Never write "this term" or "next term" without its dates. |
| `content/pages/contact.md` | `/contact/` | — | How the first visit works, prices (a Markdown table), the address and how to get there, desk hours, and `tel:` and `mailto:` links. The contract has no contact data file: this page is the only home for phone, e-mail, address and prices. |

`/instructors/` is generated from the collection; there is no page file for it.

Content classes: none. Page and instructor bodies are plain Markdown — headings from `##`, lists, tables, blockquotes, links. Do not write raw HTML with class names; no theme in this family styles any.

Posts are universal and optional: `content/posts/<slug>.md`, served at `/blog/<slug>/` and listed at `/blog/`. Frontmatter: `title` (required), `date` (required, `YYYY-MM-DD`), `description`, `cover` (image, optional), `tags` (a `- item` list, optional), `draft`. Write one only when the customer gives dated news (a holiday closure, a new class, a new term). The menu preset does not link `/blog/`; a site that posts adds `{ "label": "News", "url": "/blog/" }` after Instructors.

## Examples

`content/instructors/maya-lindqvist.md`

```markdown
---
title: Maya Lindqvist
discipline: Vinyasa · Slow Flow
description: Teaches the sunrise classes and Tuesday's Slow Flow — steady, unhurried, and kind to stiff hips.
---

Maya teaches the 7 a.m. Vinyasa three mornings a week and the Tuesday
evening Slow Flow that most beginners start with.

Expect clear instructions, an easier option for every pose, and nobody
watching you. She has taught since 2014 and still counts breaths out loud.
```

`content/pages/schedule.md`

```markdown
---
title: Weekly schedule
description: The same classes every week. Your first one is free — come ten minutes early.
showSchedule: true
---

Doors open twenty minutes before each class. Holiday changes are posted
here first.

## What the levels mean

- **All levels** — every exercise has an easier and a harder version.
- **Beginner** — assumes nothing.
- **Intermediate** — about three months of regular classes.
```

`content/pages/contact.md` (the last section; every site has it)

```markdown
## Talk to us

Call or text [+1 555 0142](tel:+15550142), or email
[hello@example.com](mailto:hello@example.com).
```

`data/schedule.json`

```json
{
  "trialNote": "First class free — come 10 minutes early and say hi at the desk.",
  "days": [
    {
      "day": "Monday",
      "classes": [
        { "time": "07:00", "name": "Sunrise Vinyasa", "who": "Maya", "level": "All levels" },
        { "time": "18:00", "name": "Strength Foundations", "who": "Theo", "level": "Beginner" },
        { "time": "19:15", "name": "Open Practice", "who": "", "level": "" }
      ]
    },
    {
      "day": "Tuesday",
      "classes": [
        { "time": "19:00", "name": "Slow Flow", "who": "Maya", "level": "Beginner" }
      ]
    }
  ]
}
```

## Rules for the author

- Frontmatter is flat: `key: value` scalars and simple `- item` lists. No nesting, no multi-line values.
- Dates (posts only) are `YYYY-MM-DD`. The timetable has no dates.
- Images are optional everywhere. The site must be complete with none: no `photo`, no pictures in bodies.
- Contact is `tel:` and `mailto:` links on the contact page, never a form. Write the `tel:` target as digits with a leading `+`; the visible number may have spaces.
- Every page and every instructor has a `description`.
- File names are lowercase a–z, digits and hyphens only, and are the URL. Drop accents or spell them out: `Jürgen Müller` → `juergen-mueller.md`, `José Núñez` → `jose-nunez.md`. The `title` keeps the real spelling. Never name an instructor `index.md`.
- Write `index.md`, `schedule.md` and `contact.md` with exactly those slugs, whatever the site's language. Translate the titles, the menu labels and the `Instructors` label (menu labels in `data/navigation.json`, the `Instructors` label in `site.config.json`), not the slugs.
- The place's name is `site.title` in `site.config.json`. Write the menu to `data/navigation.json` as the array in the block. The four URLs are fixed; the labels are free: translate them, and use the customer's own word for the people (`Coaches`, `Teachers`, `Tutors`) both in the menu label and in `collections.instructors.label` in `site.config.json`, which is the heading of `/instructors/`. Extra pages (`content/pages/prices.md` → `/prices/`) are allowed when the customer asks and need their own menu entry.
- Applying another theme of this family rewrites the `instructors` definition and the menu from that theme's starter, so a translated or reworded `label` and menu labels must be set again after a switch (a platform does this as part of the switch). Content files and `data/schedule.json` are not touched.
- Write day names in full in the site's language (`Montag`, not `Mo`), one block per day.
- `data/footer.json` and `data/strings.*.json` belong to the site, never to a theme's sample.

## Rules for the theme builder

`starter.json` carries `collections` and `navigation` exactly as in the block (key for key, in order) and no `plugins`; `theme.json` has no `layouts`; `content-templates/` holds `instructor.md` and `timetable-page.md`; `sample/data/` holds `schedule.json` and `navigation.json` only.

Every theme must render:

- **`page`** — `page.title` as the h1; `page.description` as an intro line when set; the timetable when `page.showSchedule` is true, between the heading and the body; then `page.content`.
- **The timetable** (from `data.schedule`, only when `days` is not empty) — every day in written order with its `day` label; every class in written order with `time`, `name`, then `who` (after the theme's word for "with") and `level`, each only when set; a day whose `classes` is empty shown with the theme's "no classes" words; `trialNote` under the timetable when set. It must read without JavaScript, fit a 320px screen with no sideways scroll, and print.
- **`instructor`** — `page.title` as the h1, `page.discipline` when set, `page.photo` when set (alt text: the title), `page.content`, and a link to `/schedule/`.
- **`list`** — serves `/instructors/` and, on sites that post, the blog and tag pages. Per item: `title` linked to `url`; `discipline`, `dateFormatted`, `description` and `photo` each only when set; an empty state; pagination.
- **`404`** — links to `/` and `/schedule/`.
- **`base`** — `site.title`, the menu, `data.footer.html` when the site has it. A "try a class" link, if the theme has one, goes to `/contact/`.

Every theme must tolerate:

- no `photo` anywhere; a blank `discipline`; an instructor with an empty body; `who`, `level` and `trialNote` blank;
- one instructor or forty (the list paginates at ten); one class in a day or twelve; one day block or eight; a day with none;
- an 80-character name, a two-character name, a 40-character unbreakable word in any `title` (instructor, page or post), a `discipline` or a class `name`;
- free-text `time` up to 25 characters (`07:00`, `7 Uhr`, `6:15 PM`, `18:00–21:45 Uhr`, `from 19:30 (by arrangement)`) — a long one must wrap, not widen the day; a long `level`; a full name in `who`; a `day` label that is not a weekday (`Saturday (even weeks only)`); a three-line `trialNote` containing an e-mail address;
- an item with a date and no discipline in `list` (a post), and one with a discipline and no date;
- plain Markdown of any shape in a body: h2–h4, nested lists, a wide table, a blockquote, a code block with a long line, a long bare URL.

The build does not know today's date or the time. A theme never shows "today", "next" or "now" without JavaScript. The word may sit in the built page only inside an element carrying the `hidden` attribute, which a script reveals after it has matched the day; marking the current day or the next class is optional progressive enhancement, matched on the `day` label as best it can, and a label it cannot match is simply left unmarked. Post lists show whatever is in the collection, past or future.

Interface words ("with", "No classes", "Try a class", "This week") come from the theme's `strings.json` — English keys at the top level, plus `de`, `fr`, `it`, `ro`, `es`, `pt`, `nl` blocks — never from the contract's data.

## Changes from `themes/form`

One additive change:

- `instructors` gains `{ "name": "description", "type": "text" }` after `discipline`. Every theme already prints it and the rules require it on every item, but without the field the editor offers no place to type it. Optional; existing content already sets it.

Declined:

- Declaring `pages` with a typed `showSchedule` — a starter that declares `pages` replaces the site's own definition on apply; the bare key already works and the editor keeps it.
- A numeric `weekday` on each day — only the optional today marker would use it.
- Studio `email`, `phone`, `address`, `ctaUrl` in data — no theme prints contact details itself; they live on the contact page, which always exists.
- `whoUrl` on a class — templates cannot look an instructor up, and a hand-kept URL goes stale.
- `duration` or `ends` on a class — `time` is free text and may hold a range.
- `where` on a class — most sites have one address; it would cost every theme a fifth slot. The place goes in `name` in brackets.
- Term or course dates in data — they change every term and the build cannot know which term is current; they go in the schedule page body.
- A separate shape for lessons by arrangement — the four class keys hold a teaching window.
- A closed set of `level` values — that retypes an existing free-text key.
- Declaring `posts` in the starter — universal, defined by the site.
