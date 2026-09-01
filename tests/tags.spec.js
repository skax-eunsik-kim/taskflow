'use strict';

const test = require('node:test');
const assert = require('node:assert');
const tags = require('../src/tags');

test('setTags trims, dedupes, and drops empty tags', () => {
  const saved = tags.setTags(2, [' 긴급 ', '긴급', '', '  ', 'infra']);
  assert.deepStrictEqual(saved, ['긴급', 'infra']);
  tags.removeTask(2);
});

test('listByTask returns empty array for untagged task', () => {
  assert.deepStrictEqual(tags.listByTask(99999), []);
});

test('listAllTags aggregates unique sorted tags', () => {
  const all = tags.listAllTags();
  assert.ok(all.includes('docs'));
  assert.ok(all.includes('infra'));
  assert.deepStrictEqual(all, [...all].sort());
});
