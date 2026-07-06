// plain — optional auth Worker (cms-spec §3 auth, §12 M6).
//
// Stateless GitHub "user authorization" code-for-token exchange, so editors can
// click "Sign in with GitHub" instead of pasting a fine-grained PAT (v1). The
// Worker holds NO state: the CSRF nonce lives in a short-lived cookie, never on
// a server, and the token is handed straight to the admin page and forgotten.
//
// Secrets (set with `wrangler secret put`, never committed):
//   GITHUB_CLIENT_ID · GITHUB_CLIENT_SECRET · ALLOWED_ORIGIN
//
// Built for a GitHub **App** (recommended): the user-to-server token it issues
// is scoped to the App's installed permissions on the installed repos only —
// Contents-only, this-repo-only — not the OAuth App's broad classic `repo`.
// Apps don't use OAuth scopes, so no `scope` param is sent. (For an OAuth App
// instead, add `authorize.searchParams.set("scope", "repo")` below.)
//
// Token lifetime follows the App's setting. With non-expiring user tokens
// (recommended for simplicity) the token works until revoked, exactly like v1.
// If you enable expiring tokens, the exchange also returns a refresh token this
// Worker does not use — the writer just clicks "Sign in with GitHub" again
// (one click while logged in) when the ~8h token lapses.

const COOKIE = "plain_oauth_state";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectUri = url.origin + "/callback";

    // Step 1 — start: redirect the browser to GitHub's authorize page with a
    // random `state` nonce, also stashed in a short-lived HttpOnly cookie so we
    // can verify it on return (CSRF protection — no server storage needed).
    if (url.pathname === "/" || url.pathname === "/login") {
      const state = crypto.randomUUID();
      const authorize = new URL("https://github.com/login/oauth/authorize");
      authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", redirectUri);
      authorize.searchParams.set("state", state);   // no `scope`: a GitHub App's permissions govern the token
      return new Response(null, {
        status: 302,
        headers: {
          Location: authorize.toString(),
          "Set-Cookie": cookie(COOKIE, state, 600),
        },
      });
    }

    // Step 2 — callback: GitHub redirects here with ?code & ?state.
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const sent = (request.headers.get("Cookie") || "").match(
        new RegExp(`(?:^|; )${COOKIE}=([^;]+)`)
      );
      // Verify state echoes the cookie before trusting the code (CSRF).
      if (!code || !state || !sent || sent[1] !== state) {
        return text("Sign-in failed: invalid or missing state. Please try again.", 400);
      }
      // Exchange the code for a token, server-to-server, using the secret.
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.access_token) {
        return text(`Sign-in failed: ${data.error_description || "no token returned by GitHub"}.`, 502);
      }
      // Deliver the token to the admin via postMessage — never a URL param
      // (§11 privacy) — targeting only ALLOWED_ORIGIN, then clear the nonce.
      return new Response(popup(data.access_token, env.ALLOWED_ORIGIN), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Set-Cookie": cookie(COOKIE, "", 0),
        },
      });
    }

    return text("Not found.", 404);
  },
};

const cookie = (name, value, maxAge) =>
  `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

const text = (body, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

// Minimal popup page: post the token to the opener on ALLOWED_ORIGIN, then
// close. The token lives only in this HTML response and the postMessage — it
// never appears in a URL, query string, or server log.
const popup = (token, origin) =>
  `<!doctype html><meta charset="utf-8"><title>Signed in</title>
<body>Signed in with GitHub. You can close this window.
<script>
  var token = ${JSON.stringify(token)}, origin = ${JSON.stringify(origin)};
  if (window.opener) window.opener.postMessage({ type: "plain-oauth", token: token }, origin);
  window.close();
</script>`;
