---
title: "Deploys are a Makefile and thirty seconds"
date: 2026-03-24
description: "The entire deploy pipeline of a paid service: four Make targets, rsync, and a systemd unit. What it does, what it skips, and when I would outgrow it."
tags:
  - tooling
  - infrastructure
example: true
---

Every few months someone asks what Copperline's deploy pipeline looks like, hoping for a diagram. There isn't one. There's a Makefile, and it has been the same Makefile, give or take a target, since the first paying customer.

## The Makefile

Four targets. `make deploy` is the only one I type on a normal day:

```makefile
HOSTS := app-1.copperline.example app-2.copperline.example

test:
	node --test tests/

build: test
	npx esbuild src/client/main.js --bundle --minify --outfile=dist/app.js

deploy: build
	for h in $(HOSTS); do \
	  rsync -az --delete ./ deploy@$$h:/srv/copperline/next/ && \
	  ssh deploy@$$h "sudo systemctl reload-or-restart copperline"; \
	done

rollback:
	for h in $(HOSTS); do ssh deploy@$$h "sudo /srv/copperline/bin/rollback"; done
```

The hosts deploy one after the other, so the load balancer always has one healthy backend. That is the whole zero-downtime story.

## The unit

systemd does the supervision, the restarts and the logs. The unit file is the only piece of "orchestration" in the system:

```ini
[Unit]
Description=Copperline app
After=network-online.target postgresql.service

[Service]
User=copperline
WorkingDirectory=/srv/copperline/current
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=2
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## What a deploy looks like

Thirty seconds, most of it the test suite:

```
$ time make deploy
node --test tests/
# pass 212
# fail 0
dist/app.js  38.1kb
app-1.copperline.example: reloaded
app-2.copperline.example: reloaded

real    0m29.4s
```

## When I would outgrow it

Three things would make me replace this: a second person deploying, a third kind of server, or a migration that can't run in a single transaction. None has happened in two years. Until one does, a pipeline would be a second product to maintain — and [I already have one of those](/blog/shipping-jotfile-in-a-weekend/).
