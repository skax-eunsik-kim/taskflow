'use strict';

const test = require('node:test');
const assert = require('node:assert');
const store = require('../src/store');

test('listTasks filters by status', () => {
  const done = store.listTasks({ status: 'done' });
  assert.ok(done.every((task) => task.status === 'done'));
});

test('listTasks matches keyword in title or description', () => {
  const result = store.listTasks({ q: '회의록' });
  assert.ok(result.length >= 1);
  assert.ok(result.some((task) => task.title.includes('회의록')));
});

test('createTask assigns id and default status', () => {
  const task = store.createTask({ title: '테스트 작업' });
  assert.ok(task.id > 0);
  assert.strictEqual(task.status, 'todo');
  assert.ok(store.getTask(task.id));
  store.deleteTask(task.id);
});

test('updateTask changes status', () => {
  const task = store.createTask({ title: '상태 변경 대상' });
  const updated = store.updateTask(task.id, { status: 'done' });
  assert.strictEqual(updated.status, 'done');
  store.deleteTask(task.id);
});

test('deleteTask removes the task', () => {
  const task = store.createTask({ title: '삭제 대상' });
  assert.strictEqual(store.deleteTask(task.id), true);
  assert.strictEqual(store.getTask(task.id), null);
});
