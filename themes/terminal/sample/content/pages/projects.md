---
title: Projects
description: What I've shipped — the business, the side projects, and the tools that escaped.
lede: One product pays the bills. The rest keep me honest.
example: true
---

## Copperline

Uptime monitoring and status pages for small teams. Checks from three regions, alerting over email and webhooks, and status pages you can point a CNAME at. Around 400 paying teams; run entirely by me since 2023. The stack is deliberately dull — [I wrote it up in full](/blog/copperline-architecture/).

## jotfile

A command-line notebook. Built in a weekend, which turned into [an essay about scope](/blog/shipping-jotfile-in-a-weekend/). Single binary, no daemon, your notes are just files.

```sh
brew install whitlock/tap/jotfile

jot "queue post: mention the partial index"   # appends to today's file
jot -s "partial index"                        # searches every note you've kept
```

## pgq-worker

The job-queue worker extracted from Copperline: Postgres, `SKIP LOCKED`, exponential backoff, ~500 lines, no opinions about your framework. Two years of production behind it — [the numbers are here](/blog/a-postgres-queue-two-years-in/).

```js
import { work } from 'pgq-worker';

await work(pool, {
  'email.send': async ({ to, template }) => mailer.send(to, template),
  'check.run': async ({ checkId }) => runCheck(checkId),
});
```

## This site

Markdown in Git, built with plain, deployed from a push. The [migration from Jekyll](/blog/migrating-from-jekyll/) took an afternoon, most of which was redirects. The theme you're looking at is the part I fuss over.
