import { config } from './config.js';
import { initLang } from './lang.js';

for (const a of document.querySelectorAll('.contact')) {
  a.href = `mailto:${config.privacyContact}`;
  a.textContent = config.privacyContact;
}

// One <article data-lang="xx"> per language; only the active one is shown.
initLang(document.getElementById('lang'), (lang) => {
  for (const section of document.querySelectorAll('[data-lang]')) section.hidden = section.dataset.lang !== lang;
});

