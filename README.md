# jothiflow.github.io

Static, multilingual (en/fr) signup page published with GitHub Pages. It posts to the
[`systemeio-saving-contacts-cloudflare-worker`](https://github.com/jothiflow/systemeio-saving-contacts-cloudflare-worker) Worker,
which saves the contact in systeme.io. No build step.

## Configure

Edit `config.js`:

| Key | Value |
| --- | --- |
| `workerUrl` | URL printed by `npx wrangler deploy` in the Worker repo |
| `turnstileSiteKey` | Cloudflare Turnstile **site** key (public). Required if the Worker has `TURNSTILE_SECRET_KEY` set; add every hostname the page is served from (`jothiflow.com`, `www.jothiflow.com`, `jothiflow.github.io`) to the widget's domains |
| `source` | Value stored in the `signup_source` contact field |

In the Worker's `wrangler.toml`, `ALLOWED_ORIGINS` must contain every origin the page is served from:
`https://jothiflow.com`, `https://www.jothiflow.com` and, while it redirects, `https://jothiflow.github.io`.

## Languages

The page starts in the saved choice, else the browser's language, else English, and the picker
is at the top of the card. The chosen language is sent as `locale`, so the Worker answers
validation errors in the same language and stores it on the contact.

To add one: a dictionary in `i18n.js` + a `LANG_NAMES` entry, and the same code in the Worker's
`LOCALES`. `npm test` fails if a key is missing in any language.

## Develop

```bash
npm test         # translation completeness + language detection
npm run serve    # local static server (add its origin to the Worker's ALLOWED_ORIGINS for a real call)
```

## Publish

Repo settings → Pages → deploy from branch `main`, folder `/`.
(GitHub Pages on a private repo needs a paid plan; otherwise the repo must be public.)

## Custom domain

The site is served at **https://jothiflow.com** (`www` redirects to it, and so does the old
`jothiflow.github.io` address). The `CNAME` file names the domain; keep it, because GitHub Pages
reads the setting from it. DNS is at Cloudflare and must stay **DNS only** (grey cloud) so GitHub
can issue the certificate:

| Name | Type | Target |
| --- | --- | --- |
| `jothiflow.com` (apex) | CNAME (flattened by Cloudflare) | `jothiflow.github.io` |
| `www` | CNAME | `jothiflow.github.io` |

The apex has mail records beside it (MX, SPF, DKIM, DMARC for the sending domain); changing the
web records does not touch them.
