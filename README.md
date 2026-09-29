# jothiflow.github.io

Static, multilingual (en/fr) signup page published with GitHub Pages. It posts to the
[`systemeio-saving-contacts-cloudflare-worker`](https://github.com/jothiflow/systemeio-saving-contacts-cloudflare-worker) Worker,
which saves the contact in systeme.io. No build step.

## Configure

Edit `config.js`:

| Key | Value |
| --- | --- |
| `workerUrl` | URL printed by `npx wrangler deploy` in the Worker repo |
| `turnstileSiteKey` | Cloudflare Turnstile **site** key (public). Required if the Worker has `TURNSTILE_SECRET_KEY` set; add `jothiflow.github.io` to the widget's domains |
| `source` | Value stored in the `signup_source` contact field |

In the Worker's `wrangler.toml`, `ALLOWED_ORIGINS` must contain `https://jothiflow.github.io`.

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
