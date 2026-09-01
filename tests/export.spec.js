'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { toCsv } = require('../src/export');

test('toCsv renders header and rows', () => {
  const csv = toCsv([
    { id: 1, title: '간단한 작업', status: 'todo', assignee: 'a', createdAt: 't' }
  ]);
  const lines = csv.trim().split('\n');
  assert.strictEqual(lines[0], 'id,title,status,assignee,createdAt');
  assert.strictEqual(lines[1], '1,간단한 작업,todo,a,t');
});

test('toCsv escapes commas and quotes', () => {
  const csv = toCsv([
    { id: 2, title: '쉼표, 그리고 "따옴표"', status: 'todo', assignee: null, createdAt: 't' }
  ]);
  assert.ok(csv.includes('"쉼표, 그리고 ""따옴표"""'));
});

test('toCsv renders null assignee as empty cell', () => {
  const csv = toCsv([{ id: 3, title: 't', status: 'todo', assignee: null, createdAt: 'x' }]);
  assert.ok(csv.includes('3,t,todo,,x'));
});
