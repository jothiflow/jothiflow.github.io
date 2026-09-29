// UI strings. To add a language: add it here, and to LANG_NAMES; the Worker must support it too
// (LOCALES in systemeio-saving-contacts/src/i18n.ts) or it will answer errors in English.
export const LANG_NAMES = { en: 'English', fr: 'Français' };
export const DEFAULT_LANG = 'en';

export const STRINGS = {
  en: {
    pageTitle: 'Join Jothiflow',
    heading: 'Join Jothiflow',
    intro: 'Leave your details and we will keep you posted.',
    firstName: 'First name',
    lastName: 'Last name',
    optional: '(optional)',
    email: 'Email',
    phone: 'Phone',
    consent: 'I agree to receive emails from Jothiflow. I can unsubscribe at any time.',
    submit: 'Sign up',
    sending: 'Sending…',
    successTitle: 'Thank you!',
    successBody: 'You are on the list. Check your inbox for our next message.',
    networkError: 'Network problem. Please check your connection and try again.',
    antiBotPending: 'Please wait for the anti-robot check to finish.',
    required: 'This field is required.',
    invalid: 'Invalid value.',
    language: 'Language',
  },
  fr: {
    pageTitle: 'Rejoindre Jothiflow',
    heading: 'Rejoindre Jothiflow',
    intro: 'Laissez vos coordonnées et nous vous tiendrons informé·e.',
    firstName: 'Prénom',
    lastName: 'Nom',
    optional: '(facultatif)',
    email: 'Email',
    phone: 'Téléphone',
    consent: 'J’accepte de recevoir des emails de Jothiflow. Je peux me désinscrire à tout moment.',
    submit: 'S’inscrire',
    sending: 'Envoi…',
    successTitle: 'Merci !',
    successBody: 'Vous êtes inscrit·e. Surveillez votre boîte mail pour notre prochain message.',
    networkError: 'Problème réseau. Vérifiez votre connexion et réessayez.',
    antiBotPending: 'Merci d’attendre la fin de la vérification anti-robot.',
    required: 'Ce champ est obligatoire.',
    invalid: 'Valeur invalide.',
    language: 'Langue',
  },
};

/** "fr-CA" / "FR_fr" -> "fr" when supported, else null. */
export function matchLang(tag) {
  if (typeof tag !== 'string') return null;
  const base = tag.trim().toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(STRINGS, base) ? base : null;
}

/** Saved choice first, then the browser's language list in order, then the default. */
export function pickLang(saved, browserLangs = []) {
  return matchLang(saved) ?? browserLangs.map(matchLang).find(Boolean) ?? DEFAULT_LANG;
}
