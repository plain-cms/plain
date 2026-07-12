# plain — auth Worker (optional)

A tiny (~60-line), **stateless** Cloudflare Worker that runs the GitHub
"user authorization" flow so editors can click **"Sign in with GitHub"** instead
of pasting a Personal Access Token.

> **This is opt-in.** plain's default sign-in (v1) is a GitHub fine-grained PAT
> pasted into the admin and kept in `localStorage` — no Worker, no server. This
> Worker is the optional v2 (cms-spec §3, Milestone 6) for teams who prefer a
> click over a paste. If you don't deploy it, nothing changes.

## What it does

The Worker's only job is the one step the browser can't do safely on its own:
swapping a GitHub `code` for an access token (that exchange requires the client
*secret*, which must never ship to a browser). It stores nothing.

## Everything here is yours (and free)

There is **no central plain auth service** — you don't need access to anyone
else's settings, and nobody's infrastructure sits between your writers and
GitHub. You create **your own** GitHub App (any GitHub account can, free),
deploy **your own** copy of this Worker (Cloudflare free plan), and hold your
own secrets. Your writers see *your* app's name on the authorize screen, and
their tokens travel only between their browser, your Worker, and GitHub.
That's deliberate: a shared auth service would mean one party holding a
secret that can mint tokens for every plain site's repo. Nobody should have
that — so nobody does.

## GitHub App vs OAuth App

Use a **GitHub App** (recommended). An App issues *user-to-server* tokens scoped
to its installed permissions on the repos it's installed on — for plain that's
**Contents-only, on your content repo only**. An OAuth App can only issue a
broad classic `repo` token (every repo the user can touch). Same click for the
writer; far tighter blast radius. The Worker is built for a GitHub App as-is;
for an OAuth App, add `scope=repo` back (see the note in `worker.js`).

## Deploy

### 1. Create a GitHub App

GitHub → **Settings → Developer settings → GitHub Apps → New GitHub App**:

- **Name / Homepage URL:** anything (e.g. `plain admin`, your site URL).
- **Callback URL:** your Worker's `/callback` — `https://plain-oauth.<your-subdomain>.workers.dev/callback` (you'll know the exact host after the first `wrangler deploy`; edit it afterwards). Tick **Request user authorization (OAuth) during installation** is optional.
- **Expiring user tokens:** *uncheck* to keep it simple (tokens work like v1). Leave checked for tighter security — writers just re-click "Sign in" every ~8h.
- **Webhook:** uncheck **Active** (plain doesn't use webhooks).
- **Permissions → Repository:** **Contents: Read and write**, **Metadata: Read-only** (mandatory), **Actions: Read-only** (so the admin's build-status pill works). Add **Actions: Read and write** only if you also want the admin's in-app "Update available" button to trigger updates — otherwise skip it.
- **Where can this App be installed?** *Only on this account.*

Click **Create**, then: note the **Client ID**, generate a **Client secret**, and — importantly — **Install App** (left menu) onto your content repo (e.g. `plain-cms/plain`), granting it that repo.

### 2. Install Wrangler

```sh
npm i -g wrangler       # or use `npx wrangler ...` for every command below
wrangler login
```

### 3. Set the secrets (never committed)

```sh
wrangler secret put GITHUB_CLIENT_ID       # paste the GitHub App Client ID
wrangler secret put GITHUB_CLIENT_SECRET   # paste the GitHub App Client secret
wrangler secret put ALLOWED_ORIGIN         # your admin origin, e.g. https://you.github.io
```

`ALLOWED_ORIGIN` is scheme + host only (no trailing path — e.g. `https://you.github.io`,
not `.../your-repo`). It is the **only** origin the Worker will hand a token to.

### 4. Deploy

```sh
wrangler deploy
```

Wrangler prints the Worker URL (e.g. `https://plain-oauth.<sub>.workers.dev`).
If that host differs from what you set in step 1, update the App's **Callback
URL** to `<that URL>/callback`.

### 5. Point the admin at it

The admin already knows how to do the popup + `postMessage` flow — it just needs
the Worker's URL. Add one field to `site.config.json` and rebuild:

```json
{
  "site": {
    "title": "…",
    "url": "https://you.github.io/your-repo",
    "oauthUrl": "https://plain-oauth.<your-subdomain>.workers.dev"
  }
}
```

On the next build, the sign-in screen shows a **"Sign in with GitHub"** button
(the access-token form stays available under *"or use an access token"*). Leave
`oauthUrl` out to keep the token-only sign-in.

### 6. Give your writers access

A writer's token can only touch what **both** the writer and the App can reach.
So each writer needs repo write access, and the App must be installed on the repo
(step 1):

1. Repo → **Settings → Collaborators → Add people** → invite each writer with **Write**.
2. Make sure the App is **installed** on that repo (step 1's *Install App*).

Then a writer opens `/admin/`, clicks **Sign in with GitHub**, authorizes the App
once, and can publish — no token to generate or paste, and the token they get is
scoped to just this repo's contents.

## What it costs

Nothing. A sign-in is a handful of Worker requests — far inside Cloudflare's
free plan — and GitHub Apps are free to create and install. No server to
rent, nothing to maintain.

## A second site (or many)

One Worker serves **one** site: `ALLOWED_ORIGIN` is deliberately a single
origin so a token can never be handed to the wrong site. To add GitHub
sign-in to another plain site:

1. **Reuse the same GitHub App** — no need for a new one:
   - App settings → add the new Worker's `/callback` as an extra **Callback
     URL** (GitHub Apps allow up to 10).
   - If the new site's repo lives under a different account than the App,
     set **Advanced → Where can this App be installed → Any account**, then
     **Install App** on that account and grant it the site's repo.
2. **Deploy a second Worker instance** from this same folder — its own name,
   its own secrets (secrets never copy between Workers):

   ```sh
   wrangler deploy --name plain-oauth-mysite
   wrangler secret put GITHUB_CLIENT_ID --name plain-oauth-mysite       # the same App's ID
   wrangler secret put GITHUB_CLIENT_SECRET --name plain-oauth-mysite   # the same App's secret
   wrangler secret put ALLOWED_ORIGIN --name plain-oauth-mysite         # the new site's origin
   ```

3. Set the new site's `site.oauthUrl` to the new Worker's URL and rebuild.

Never point two sites at one Worker — the second site's popup would try to
deliver its token to the other site's origin and silently fail.

## Troubleshooting

- **No "Sign in with GitHub" button on `/admin/`** — `site.oauthUrl` is
  missing from `site.config.json`, or the site hasn't been rebuilt since you
  added it. The button is config-gated; installing the GitHub App alone
  doesn't enable it.
- **Can't find the Client ID** — it lives on the App's *developer settings*
  page (GitHub → the account that **owns** the App → Settings → Developer
  settings → GitHub Apps → your App), not on the "Applications"
  authorization page you see as an installer.
- **GitHub errors about the redirect URI** — the Worker's URL isn't among the
  App's Callback URLs. Add `<worker-url>/callback`.
- **Popup completes but the admin stays signed out** — `ALLOWED_ORIGIN`
  doesn't exactly match the admin's origin (scheme + host only — no path, no
  trailing slash).
- **Signed in but saves fail** — the App isn't installed on the content repo,
  or the writer lacks Write access (step 6).

## The flow

1. Admin opens `GET /login` (popup). Worker generates a random `state`, sets it
   in a short-lived **HttpOnly, Secure, SameSite=Lax** cookie, and 302-redirects
   to `github.com/login/oauth/authorize`.
2. The editor approves on GitHub. GitHub redirects the popup to
   `GET /callback?code=…&state=…`.
3. Worker checks `state` against the cookie (**CSRF**), then POSTs
   `code` + `client_id` + `client_secret` to
   `github.com/login/oauth/access_token` and reads the `access_token`.
4. Worker returns a tiny HTML page that `postMessage`s the token to
   `ALLOWED_ORIGIN` and closes the popup. The token is **never** in a URL.

## Security notes

- **Stateless.** No database, no KV, no server session. The CSRF nonce lives in
  a cookie; the token is delivered and forgotten.
- **Token never touches a URL/query string** (cms-spec §11 privacy). It travels
  in the HTML response body and a `postMessage` targeted at a single allowed
  origin — never the address bar, never a server log.
- **CSRF protection** via a random `state` nonce echoed through a short-lived
  HttpOnly cookie and verified on callback.
- **Single allowed origin.** The Worker only posts the token to
  `ALLOWED_ORIGIN`.
- **Secrets never committed.** `GITHUB_CLIENT_SECRET` (and the others) are set
  with `wrangler secret put` and stored encrypted by Cloudflare.

## Scope note

OAuth Apps issue *classic* scopes only, so this flow requests `repo`.
Fine-grained tokens (single-repo, contents read/write) are preferable and are
exactly what the v1 PAT sign-in uses — they just aren't available through the
OAuth web flow.
