// Deployment settings. Nothing here is secret: the Turnstile *site* key is public by design.
export const config = {
  // URL of the saving-contacts Worker (`npx wrangler deploy` prints it).
  workerUrl: 'https://saving-contacts-1.jothiflow.workers.dev',
  // Cloudflare Turnstile site key. Leave empty to disable the widget
  // (only if the Worker has no TURNSTILE_SECRET_KEY, otherwise submissions get 403).
  turnstileSiteKey: '0x4AAAAAAFJesOZS3gu4DYn1',
  // Identifies this form in the systeme.io `signup_source` field.
  source: 'jothiflow.github.io',
  // Contact shown on the privacy page for data requests (access, deletion, ...).
  privacyContact: 'jothiflow+privacy@gmail.com',
};
