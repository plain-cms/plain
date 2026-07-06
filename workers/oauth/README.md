# plain — OAuth Worker (optional)

A tiny (~60-line), **stateless** Cloudflare Worker that performs the GitHub
OAuth web flow so editors can click **"Sign in with GitHub"** instead of pasting
a Personal Access Token.

> **This is opt-in.** plain's default sign-in (v1) is a GitHub fine-grained PAT
> pasted into the admin and kept in `localStorage` — no Worker, no server. This
> Worker is the optional v2 (cms-spec §3, Milestone 6) for teams who prefer a
> click over a paste. If you don't deploy it, nothing changes.

## What it does

The Worker's only job is the one step the browser can't do safely on its own:
swapping a GitHub OAuth `code` for an access token (that exchange requires the
client *secret*, which must never ship to a browser). It stores nothing.

## Deploy

### 1. Create a GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** anything (e.g. `plain admin`).
- **Homepage URL:** your admin/site URL (e.g. `https://you.github.io`).
- **Authorization callback URL:** your Worker's `/callback` URL —
  `https://plain-oauth.<your-subdomain>.workers.dev/callback`
  (you'll know the exact host after the first `wrangler deploy`; you can edit
  this field afterwards).

Click **Register application**, then note the **Client ID** and generate a
**Client secret**.

### 2. Install Wrangler

```sh
npm i -g wrangler       # or use `npx wrangler ...` for every command below
wrangler login
```

### 3. Set the secrets (never committed)

```sh
wrangler secret put GITHUB_CLIENT_ID       # paste the OAuth App Client ID
wrangler secret put GITHUB_CLIENT_SECRET   # paste the OAuth App Client secret
wrangler secret put ALLOWED_ORIGIN         # your admin origin, e.g. https://you.github.io
```

`ALLOWED_ORIGIN` is scheme + host only (no trailing path). It is the **only**
origin the Worker will hand a token to.

### 4. Deploy

```sh
wrangler deploy
```

Wrangler prints the Worker URL (e.g. `https://plain-oauth.<sub>.workers.dev`).
If that host differs from what you guessed in step 1, update the OAuth App's
**Authorization callback URL** to `<that URL>/callback`.

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

"Sign in with GitHub" gives a writer a token, but they can only publish if their
GitHub account can write to the repo. On GitHub, open the repo → **Settings →
Collaborators → Add people**, and invite each writer with **Write** access. They
then open `/admin/`, click **Sign in with GitHub**, authorize the OAuth App once,
and can publish — no token to generate or paste.

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
