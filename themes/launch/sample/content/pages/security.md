---
title: Security
description: What Pulse stores, where it lives and who can reach it — written to be read, not to pass an audit.
example: true
---

## What we hold

Pulse stores the URLs you ask it to check, the results of those checks and
the contact details of the people it pages. It never stores response
bodies: assertions are evaluated in memory and only the pass or fail is
kept.

## Where it lives

Data is encrypted in transit and at rest, in two regions you choose at
sign-up — North America or the European Union — and does not leave them.
Backups are taken hourly and a restore is rehearsed every quarter.

## Who can reach it

Access to production needs a hardware key and is logged; four people have
it. Customer accounts support single sign-on and an audit log on the Scale
plan, and two-factor sign-in on every plan.

## When something goes wrong

Incidents on our own systems appear on our status page from the same code
yours runs on. If your data is involved we email the account owner within
72 hours with what happened and what we changed.

Report a vulnerability to
[security@pulsemonitor.example](mailto:security@pulsemonitor.example).
