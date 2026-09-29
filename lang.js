import { LANG_NAMES, STRINGS, pickLang } from './i18n.js';

const STORAGE_KEY = 'lang';

// localStorage can throw (private mode, blocked site data): pages must work without it.
const storage = {
  get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch { /* ignore */ } },
};

/**
 * Fills the language <select>, translates every [data-i18n] element and the page title
 * (`<body data-title="key">`), and calls `onChange(lang)` on load and on each switch.
 */
export function initLang(select, onChange) {
  for (const [code, name] of Object.entries(LANG_NAMES)) select.add(new Option(name, code));

  const apply = (lang, persist) => {
    if (persist) storage.set(lang);
    document.documentElement.lang = lang;
    select.value = lang;
    const strings = STRINGS[lang];
    document.title = strings[document.body.dataset.title];
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = strings[el.dataset.i18n];
    onChange(lang);
  };

  select.addEventListener('change', (e) => apply(pickLang(e.target.value), true));
  apply(pickLang(storage.get(), navigator.languages ?? [navigator.language]), false);
}
