---
title: "Alert rules a customer can read out loud"
date: 2026-04-22
description: "Why Copperline's alerting config is a short YAML file instead of a rule builder, and the one field that halved the support tickets about it."
tags:
  - saas
  - architecture
example: true
---

The first version of Copperline's alerting had a rule builder: dropdowns, AND/OR groups, a preview. It took three weeks to build and generated more support email than the rest of the product combined. Nobody could tell, looking at a rule, when it would fire.

The second version is a text box with a file in it.

## The file

Every team has one, it lives next to their checks, and it is short enough to read aloud in a stand-up:

```yaml
# Who gets woken up, and for what.
alerts:
  - name: site is down
    when: 2 of 3 regions fail
    for: 2m
    notify: [oncall-email, ops-webhook]

  - name: site is slow
    when: p95 > 1500ms
    for: 10m
    notify: [ops-webhook]
    quiet_hours: 22:00-07:00 Europe/Lisbon
```

`for:` is the field that mattered. Most "false alarm" tickets were single failed checks during a deploy; making the duration impossible to leave out — the file doesn't validate without it — cut those tickets roughly in half within a month.

## What the webhook receives

The other half of readable alerting is a payload you can act on without opening a dashboard. It says what failed, since when, and from where:

```json
{
  "alert": "site is down",
  "check": "https://shop.example/health",
  "state": "firing",
  "since": "2026-04-18T03:12:40Z",
  "regions": { "fra": "timeout", "iad": "timeout", "sin": "ok" }
}
```

## Why not a builder

A builder optimises for the first five minutes. A file optimises for the day the alert fires at 3 a.m. and someone has to work out why — they can read it, diff it, paste it into a ticket, and keep it in their own repository if they like. The validator's error messages do the teaching the dropdowns were supposed to do.

It also deleted about 2,000 lines of front-end code, which is the kind of feature I like best.
