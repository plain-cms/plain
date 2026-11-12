---
title: Backing up your work
order: "90"
description: What to copy, how often, and how to put everything back after a lost or replaced computer.
---

A backup is a second copy kept somewhere else. This section covers what to copy, a routine that takes two minutes, and how to restore from it.

## Before you start

You need a second place to keep the copy: an external drive, a network share, or a private online folder. One is enough to begin with.

## Make a backup

1. Close anything that is still writing to the project folder.
2. Copy the whole folder to the backup location:

   ```sh
   cp -R my-project /Volumes/Backup/my-project-2026-07-05
   ```

3. Put the date in the name of the copy, so older copies are never overwritten.

## Check it worked

Open the copy and look for the newest file you changed. If it is there with today's date, the backup is good.

| How often     | Keep for  |
| ------------- | --------- |
| Every Friday  | One month |
| Every month   | One year  |

> **Note** — A copy on the same disk is not a backup. If the disk fails, both go together.

## Restore from a backup

Copy the dated folder back and remove the date from its name. Nothing else needs to be reinstalled or reset.

## Related sections

Every section is listed in the [contents](/docs/).
