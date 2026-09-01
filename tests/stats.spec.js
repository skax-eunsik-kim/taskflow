'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { computeStats } = require('../src/stats');

test('computeStats counts by status', () => {
  const stats = computeStats([
    { status: 'todo', assignee: 'a' },
    { status: 'done', assignee: 'a' },
    { status: 'done', assignee: null }
  ]);
  assert.strictEqual(stats.total, 3);
  assert.strictEqual(stats.byStatus.done, 2);
  assert.strictEqual(stats.byStatus.todo, 1);
});

test('computeStats groups by assignee with fallback label', () => {
  const stats = computeStats([
    { status: 'todo', assignee: 'a' },
    { status: 'todo', assignee: null }
  ]);
  assert.strictEqual(stats.byAssignee.a, 1);
  assert.strictEqual(stats.byAssignee['(미지정)'], 1);
});

test('computeStats returns 0% doneRatio for empty task list', () => {
  const stats = computeStats([]);
  assert.strictEqual(stats.total, 0);
  assert.strictEqual(stats.doneRatio, 0);
});

test('computeStats doneRatio for a non-empty list', () => {
  const stats = computeStats([
    { status: 'done', assignee: null },
    { status: 'todo', assignee: null }
  ]);
  assert.strictEqual(stats.doneRatio, 50);
});
