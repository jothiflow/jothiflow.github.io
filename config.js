// Deployment settings. Nothing here is secret: the Turnstile *site* key is public by design.
export const config = {
  // URL of the systemeio-saving-contacts Worker (`npx wrangler deploy` prints it).
  workerUrl: 'https://systemeio-saving-contacts.CHANGE-ME.workers.dev',
  // Cloudflare Turnstile site key. Leave empty to disable the widget
  // (only if the Worker has no TURNSTILE_SECRET_KEY, otherwise submissions get 403).
  turnstileSiteKey: '',
  // Identifies this form in the systeme.io `signup_source` field.
  source: 'jothiflow.github.io',
};
