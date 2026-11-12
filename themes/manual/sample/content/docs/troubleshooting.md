---
title: Troubleshooting
order: "08"
description: The errors you'll actually see, what they mean, and the one-line fixes.
prev: /docs/deploying/
prevTitle: Deploying
example: true
---

Every mkweb error names the file, the line, and the fix. This page collects the ones people meet most often, in the order they usually meet them.

## "command not found: mkweb"

The binary isn't on your `PATH`. Find out where it landed, then add that directory to your shell profile:

```sh
ls ~/.local/bin/mkweb
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
exec $SHELL
```

> **Note** — On Windows, add the folder containing `mkweb.exe` to your PATH under *System Properties → Environment Variables*, then open a new terminal.

## "port 8080 already in use"

Something else is listening on the dev port. Either stop it or pick another port:

```sh
mkweb dev --port 3000
```

To make the change permanent, set `"port": 3000` in `mkweb.json`.

## "unknown option 'prot' in mkweb.json (line 7)"

A typo in the config file. mkweb rejects unknown keys on purpose — a silently ignored option is worse than an error. The message suggests the nearest valid name:

```
mkweb.json:7 — unknown option "prot" — did you mean "port"?
```

## "frontmatter: missing closing --- (pages/about.md, line 1)"

A page's frontmatter block was opened but never closed. Frontmatter is fenced by two `---` lines:

```markdown
---
title: About
---
The body starts here.
```

## "broken link: /pricng/ (pages/index.md, line 12)"

`mkweb check --links` found an internal link that resolves to no page. Fix the target or the link — the file and line are in the message.

## Exit codes

For scripting and CI, mkweb keeps its exit codes boring:

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| `0`  | Success.                                 |
| `1`  | Build or validation error (see message). |
| `2`  | Bad invocation — unknown command or flag. |

## Still stuck?

Check the section that matches the error first: [Configuration](/docs/configuration/) for anything about `mkweb.json`, [Commands](/docs/commands/) for flags, [Deploying](/docs/deploying/) for a site that builds but looks wrong online.

If the answer isn't in the manual, that's a gap in the manual. Write to [docs@mkweb.example](mailto:docs@mkweb.example) with the full error message and the output of `mkweb version`, and we'll fix both.
