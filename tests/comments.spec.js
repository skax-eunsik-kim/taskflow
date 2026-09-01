'use strict';

const test = require('node:test');
const assert = require('node:assert');
const comments = require('../src/comments');

test('listByTask returns only comments for the task', () => {
  const result = comments.listByTask(1);
  assert.ok(result.length >= 1);
  assert.ok(result.every((comment) => comment.taskId === 1));
});

test('addComment stores author and body', () => {
  const comment = comments.addComment({ taskId: 2, author: 'haeun', body: '확인했습니다.' });
  assert.ok(comment.id > 0);
  assert.strictEqual(comment.author, 'haeun');
  assert.ok(comments.listByTask(2).some((item) => item.id === comment.id));
  comments.deleteComment(comment.id);
});

test('deleteComment removes the comment', () => {
  const comment = comments.addComment({ taskId: 2, author: null, body: '삭제 대상' });
  assert.strictEqual(comments.deleteComment(comment.id), true);
  assert.ok(!comments.listByTask(2).some((item) => item.id === comment.id));
});
