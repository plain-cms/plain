---
title: Staff product engineer
date: 2023-09-01
organization: Fieldnote
period: 2023–present
location: Remote (EU)
summary: Own the editor and publishing pipeline of a collaborative research tool used by 40,000 teams.
description: Sam Kessler's work as staff product engineer at Fieldnote since 2023, from the editor rewrite to a publishing pipeline that got almost eight times faster.
highlights:
  - Led the editor rewrite to CRDT-based sync; conflict reports dropped 94% and offline editing shipped
  - Cut p95 publish latency from 6.1s to 800ms by moving rendering to an incremental pipeline
example: true
---

Fieldnote is a research notebook that whole teams write in at once. The
editing and publishing surface is mine end to end, which is the part people
keep open for hours a day.

The work that mattered most was replacing last-write-wins syncing with a
CRDT model, a year of careful migration with no data loss, and rebuilding
the publish pipeline so that a 300-page workspace republishes incrementally
instead of from scratch. Both projects shipped behind flags, rolled out
gradually and were boring by launch day, which was the point.

I also look after the team's writing habits: a design doc before code for
anything that crosses a service boundary, and a changelog that readers
actually read.
