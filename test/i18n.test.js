import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DEFAULT_LANG, LANG_NAMES, STRINGS, matchLang, pickLang } from '../i18n.js';

test('every language defines exactly the same keys', () => {
  const reference = Object.keys(STRINGS[DEFAULT_LANG]).sort();
  for (const [lang, dict] of Object.entries(STRINGS)) {
    assert.deepEqual(Object.keys(dict).sort(), reference, lang);
    assert.ok(LANG_NAMES[lang], `${lang} has no display name`);
  }
});

const page = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

for (const name of ['index.html', 'privacy.html', 'email.html']) {
  test(`every data-i18n and data-title key used in ${name} exists`, () => {
    const html = page(name);
    const keys = [...html.matchAll(/data-(?:i18n|title)="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length > 0);
    for (const key of keys) assert.ok(key in STRINGS[DEFAULT_LANG], key);
  });
}

for (const name of ['privacy.html', 'email.html']) {
  test(`${name} has one article per language, with matching lang attributes`, () => {
    const html = page(name);
    for (const lang of Object.keys(STRINGS)) {
      assert.match(html, new RegExp(`<article data-lang="${lang}" lang="${lang}"`), lang);
    }
  });
}

test('language detection', () => {
  assert.equal(matchLang('FR-ca'), 'fr');
  assert.equal(matchLang('de'), null);
  assert.equal(pickLang('fr', ['en']), 'fr');
  assert.equal(pickLang(null, ['de-DE', 'fr-FR', 'en']), 'fr');
  assert.equal(pickLang('xx', []), DEFAULT_LANG);
});
