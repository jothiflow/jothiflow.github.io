import { config } from './config.js';
import { STRINGS } from './i18n.js';
import { initLang } from './lang.js';

const $ = (id) => document.getElementById(id);
const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'consent'];

let lang;
let turnstileToken = '';
let turnstileWidget = null;
const t = (key) => STRINGS[lang][key];

// ---------- errors ----------

function showError(field, message) {
  const el = $(`${field}-error`);
  if (!el) return showFormError(message);
  el.textContent = message;
  el.hidden = false;
  $(field).setAttribute('aria-invalid', 'true');
  $(field).setAttribute('aria-describedby', el.id);
}

function showFormError(message) {
  $('form-error').textContent = message;
  $('form-error').hidden = false;
}

function clearErrors() {
  for (const f of FIELDS) {
    $(`${f}-error`).hidden = true;
    $(f).removeAttribute('aria-invalid');
    $(f).removeAttribute('aria-describedby');
  }
  $('form-error').hidden = true;
}

// ---------- Turnstile ----------

function initTurnstile() {
  if (!config.turnstileSiteKey) return;
  window.onTurnstileLoad = () => {
    turnstileWidget = window.turnstile.render('#turnstile', {
      sitekey: config.turnstileSiteKey,
      callback: (token) => { turnstileToken = token; },
      'expired-callback': () => { turnstileToken = ''; },
      'error-callback': () => { turnstileToken = ''; },
    });
  };
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
  s.async = true;
  document.head.append(s);
}

// ---------- submit ----------

$('signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  if (config.turnstileSiteKey && !turnstileToken) return showFormError(t('antiBotPending'));

  // Client-side checks only spare a round trip; the Worker validates authoritatively.
  const value = (id) => $(id).value.trim();
  let bad = false;
  for (const f of ['firstName', 'email']) {
    if (!value(f)) { showError(f, t('required')); bad = true; }
  }
  if (bad) return $('signup').querySelector('[aria-invalid="true"]')?.focus();

  const button = $('submit');
  button.disabled = true;
  button.textContent = t('sending');

  try {
    const res = await fetch(config.workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: value('firstName'),
        lastName: value('lastName'),
        email: value('email'),
        phone: value('phone'),
        consent: $('consent').checked,
        source: config.source,
        locale: lang,
        website: $('website').value,
        turnstileToken,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      $('form-view').hidden = true;
      $('success-view').hidden = false;
      return;
    }
    if (Array.isArray(data.errors)) {
      for (const err of data.errors) showError(err.field, err.message);
      $('signup').querySelector('[aria-invalid="true"]')?.focus();
    } else {
      showFormError(data.error ?? t('networkError'));
    }
  } catch {
    showFormError(t('networkError'));
  } finally {
    button.disabled = false;
    button.textContent = t('submit');
    // A Turnstile token is single-use.
    if (turnstileWidget !== null) { window.turnstile.reset(turnstileWidget); turnstileToken = ''; }
  }
});

initLang($('lang'), (l) => {
  lang = l;
  clearErrors(); // server messages are in the previous language
  if ($('submit').disabled) $('submit').textContent = t('sending');
});
initTurnstile();
