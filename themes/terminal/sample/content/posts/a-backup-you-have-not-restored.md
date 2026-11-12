---
title: "A backup you have never restored is a rumour"
date: 2026-02-24
description: "The monthly restore test behind Copperline's backups: the script, what it has caught, and why the calendar reminder matters more than the tooling."
tags:
  - postgres
  - infrastructure
example: true
---

For Copperline's first eight months I had nightly backups and complete confidence in them. Then I tried to restore one, for no reason other than a quiet Friday, and it failed: the dump was fine, but it had been written by a newer `pg_dump` than the Postgres I was restoring into.

Nothing was lost. But I had spent eight months believing in something I had never once seen work.

## The test

On the first Monday of every month a script pulls last night's dump, loads it into a scratch VM, and asks it three questions. If any answer is wrong, I get paged like a customer would:

```sh
#!/bin/sh
set -eu

latest=$(rclone lsf backups:copperline/nightly/ | sort | tail -1)
rclone copy "backups:copperline/nightly/$latest" /var/tmp/restore/

createdb restore_test
pg_restore --no-owner --jobs 4 --dbname restore_test "/var/tmp/restore/$latest"

psql restore_test --tuples-only --command "select count(*) from accounts" | grep -q '[1-9]'
psql restore_test --tuples-only --command "select max(created_at) > now() - interval '36 hours' from check_results" | grep -q t
psql restore_test --tuples-only --command "select count(*) from jobs where done_at is null and run_at < now() - interval '1 day'" | grep -q '^ *0$'

dropdb restore_test
```

The three questions are the point. "Did it restore" is not enough — an empty database restores perfectly. So: are there accounts, is the newest data recent, and is the job queue in a sane state.

## What it has caught

| Month | What failed | Cause |
| ----- | ----------- | ----- |
| 2024-03 | restore refused the dump | `pg_dump` newer than the scratch server |
| 2024-11 | newest data four days old | backup cron silently disabled by an OS upgrade |
| 2025-08 | restore took 3 h, not 20 min | an index that should have been dropped in 2024 |

Three failures in two years, none of them during an actual emergency. That is the whole return on about an hour of work a month.

## The part that isn't tooling

The script is the easy half. The hard half is that nothing in the world reminds you to run it: backups fail quietly, and restores only fail when you need them. So the test is a recurring calendar event with my name on it, and when it fires it files the result — pass or fail — as a line in the public changelog. A promise written down where customers can see it is harder to skip than a good intention.
