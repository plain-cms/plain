# sales-analytics

Views and CTA-click counts for your landing pages, sent to **your own API**, with an
in-site **`/insights/` dashboard** that reads them back. plain is a static, database-free CMS,
so the counts can't live in the repo — this plugin ships the two client pieces (a tracking
beacon and a dashboard) and defines the small API contract your backend implements. Point it at
your backend with a `services` entry and you own the data.

Progressive enhancement throughout: every CTA is a plain link and every page is plain HTML, so
the site and its buttons work with JavaScript off. The beacon and the dashboard are the only
things that need JS.

## What it does

- On **every page**, sends a `view` beacon on load and a `click` beacon whenever a
  `[data-cta]` element is clicked (the landing template tags its CTAs `hero`,
  `hero-secondary`, `footer`, and `plan-<name>`; add `data-cta="…"` to any other link to track it).
- On the **dashboard page** (`/insights/` by default, `noindex`), fetches aggregated counts and
  renders total views / clicks / click-through plus a per-page, per-CTA table.

## Install & configure

1. Enable the plugin (admin **Plugins** screen, or add `"sales-analytics"` to `plugins` in
   `site.config.json`).
2. Point it at your backend with a **service** — a public `https://` endpoint (endpoints only,
   never secrets; this value is published):

   ```json
   "services":      { "backend": "https://api.example.com" },
   "pluginOptions": { "sales-analytics": { "service": "backend", "dashboardPath": "/insights/", "dashboardTitle": "Insights" } }
   ```

| Option | Default | Meaning |
| ------ | ------- | ------- |
| `service` | `"backend"` | Which `services.<name>` endpoint to POST events to / GET reports from. |
| `dashboardPath` | `"/insights/"` | Where the reports dashboard page is emitted (kept out of search with `noindex`). |
| `dashboardTitle` | `"Insights"` | The dashboard page's title. |

## Privacy / network disclosure

This plugin makes network calls **only to the endpoint you configure** (your own backend) — a
`POST` per pageview and per CTA click, and a `GET` when you open the dashboard. It sends **no
cookies**, sets nothing on visitors' devices, and talks to **no third party**. The only value
stored on-device is an optional admin **token you paste on the dashboard**, kept in `localStorage`
and sent only to your endpoint as a bearer token. If no service is configured, the plugin is inert.

## The API contract (what your backend implements)

Two routes on the configured service. The build never sends secrets, so both are called from the
browser: `POST /events` must accept cross-origin posts from your site; `GET /reports` may be public
or bearer-protected (your choice).

### `POST <service>/events`

Receives one beacon. Return **2xx** (204 is ideal); the body is ignored. **Stamp the time
server-side** — don't trust the client clock. Respond with CORS headers allowing your site origin
(`Access-Control-Allow-Origin`), since beacons are cross-origin.

```jsonc
// type: "view"
{ "type": "view", "page": "/plain/", "ref": "https://news.ycombinator.com/" }
// type: "click"
{ "type": "click", "page": "/plain/", "cta": "hero" }
```

| Field | Always | Meaning |
| ----- | ------ | ------- |
| `type` | yes | `"view"` or `"click"`. |
| `page` | yes | `location.pathname` of the page. |
| `cta`  | clicks | the clicked element's `data-cta` value. |
| `ref`  | views  | `document.referrer` (may be `null`/empty). |

Beacons are best-effort and fire-and-forget: they may arrive out of order, be retried by the
browser, or (rarely) be dropped. Count them idempotently if you can; approximate totals are fine.

### `GET <service>/reports`

Returns aggregated counts for the dashboard. If it requires auth, answer unauthenticated requests
with **401/403** and the dashboard will prompt for a token, then retry with
`Authorization: Bearer <token>`. Shape:

```json
{
  "range": "30d",
  "pages": [
    {
      "page": "/plain/",
      "views": 1280,
      "clicks": 143,
      "ctas": [
        { "cta": "hero", "clicks": 96 },
        { "cta": "footer", "clicks": 47 }
      ]
    }
  ]
}
```

| Field | Meaning |
| ----- | ------- |
| `range` | optional label shown under the table (e.g. `"30d"`). |
| `pages[].page` | the page path. |
| `pages[].views` / `clicks` | totals for the window. |
| `pages[].ctas[]` | per-CTA click counts (`cta` = the `data-cta` value). |

The dashboard computes overall totals and click-through (clicks ÷ views) itself, so `/reports`
only needs the raw counts above. Sort/limit however you like; the dashboard re-sorts by views.

## Works without a backend?

Tracking and the dashboard need the `services` endpoint. If you only want pageviews and have no
backend, the built-in `goatcounter` plugin gives third-party pageview counts with no server —
but its numbers live in GoatCounter's dashboard, not in `/insights/`.
