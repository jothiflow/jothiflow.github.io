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

test('every data-i18n key used in index.html exists', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length > 0);
  for (const key of keys) assert.ok(key in STRINGS[DEFAULT_LANG], key);
});

test('language detection', () => {
  assert.equal(matchLang('FR-ca'), 'fr');
  assert.equal(matchLang('de'), null);
  assert.equal(pickLang('fr', ['en']), 'fr');
  assert.equal(pickLang(null, ['de-DE', 'fr-FR', 'en']), 'fr');
  assert.equal(pickLang('xx', []), DEFAULT_LANG);
});
