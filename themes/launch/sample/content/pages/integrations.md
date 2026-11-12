---
title: Integrations
description: Pulse sends alerts where your team already looks and takes configuration from where it already lives.
example: true
---

## Where alerts go

| Channel | Plans | Notes |
| ------- | ----- | ----- |
| Email | All | One message per incident, not per region |
| Slack | Team, Scale | Acknowledge and escalate from the message |
| SMS and phone call | Team, Scale | Repeats until someone acknowledges |
| Webhooks | Team, Scale | Signed JSON, retried for 24 hours |
| PagerDuty and Opsgenie | Scale | Two-way: an ack on either side counts |

## Configuration as code

The official Terraform provider covers monitors, assertion sets, status
pages and rotations. Changes made in the dashboard show up as drift, so a
team can move over one service at a time.

## The API

Everything in the dashboard is a documented REST call with scoped tokens.
Check results stream over a webhook or can be pulled as JSON for thirteen
months back.

Missing something? [Tell us](/contact/) — most of this list started as a
customer's email.
