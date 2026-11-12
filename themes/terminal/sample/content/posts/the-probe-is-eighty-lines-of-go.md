---
title: "The whole uptime probe is 80 lines of Go"
date: 2026-05-05
description: "What runs in three regions and decides whether your site is up: one loop, one HTTP client, and a deliberate refusal to hold state."
tags:
  - go
  - infrastructure
example: true
---

Copperline checks about 9,000 URLs a minute from three regions. The program that does it is the smallest thing I maintain, and I'd like it to stay that way. Customers sometimes ask what "the probe" is, expecting an agent or a mesh. It's a loop.

## The loop

Each probe asks home for its batch, runs the checks concurrently, and posts the results back. It keeps nothing between ticks — if it dies, systemd starts another and nothing is lost but one interval:

```go
func tick(ctx context.Context, api *Client, region string) error {
	checks, err := api.Batch(ctx, region)
	if err != nil {
		return fmt.Errorf("fetch batch: %w", err)
	}

	results := make([]Result, len(checks))
	var wg sync.WaitGroup
	for i, c := range checks {
		wg.Add(1)
		go func() {
			defer wg.Done()
			results[i] = run(ctx, c)
		}()
	}
	wg.Wait()

	return api.Report(ctx, region, results)
}
```

## One check

A check is a GET with a hard timeout. The only subtlety is what counts as an answer: a 500 is a *response*, and the customer decides whether that means down; a timeout or a refused connection is not a response at all, and those are reported differently.

```go
func run(ctx context.Context, c Check) Result {
	ctx, cancel := context.WithTimeout(ctx, c.Timeout)
	defer cancel()

	start := time.Now()
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, c.URL, nil)
	req.Header.Set("User-Agent", "Copperline-Probe/3 (+https://copperline.example/probe)")

	resp, err := client.Do(req)
	if err != nil {
		return Result{ID: c.ID, Err: classify(err), Took: time.Since(start)}
	}
	defer resp.Body.Close()
	return Result{ID: c.ID, Status: resp.StatusCode, Took: time.Since(start)}
}
```

## What it refuses to do

- **No retries.** A retry inside the probe hides exactly the flakiness customers pay to see. The server decides: two regions out of three must agree before anyone is paged.
- **No local config.** The batch comes from the API every tick, so there is nothing to deploy when a customer edits a check.
- **No clever client.** Redirects are followed, bodies are not read, TLS errors are errors.

The binary is 6 MB and uses about 30 MB of memory. It has been restarted by hand twice in two years, both times by me, both times to see what would happen. Nothing did.
