'use strict';

const express = require('express');
const comments = require('../comments');
const store = require('../store');
const users = require('../users');
const activity = require('../activity');

const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
  const taskId = Number(req.params.taskId);
  if (!store.getTask(taskId)) {
    return res.status(404).json({ error: 'task not found' });
  }
  req.taskId = taskId;
  next();
});

router.get('/', (req, res) => {
  res.json({ comments: comments.listByTask(req.taskId) });
});

router.post('/', (req, res) => {
  const { author, body } = req.body || {};
  if (!body || !String(body).trim()) {
    return res.status(400).json({ error: 'body is required' });
  }
  if (author && !users.getUser(author)) {
    return res.status(400).json({ error: 'unknown author' });
  }
  const comment = comments.addComment({
    taskId: req.taskId,
    author: author || null,
    body: String(body).trim()
  });
  activity.record('comment.created', `작업 #${req.taskId}에 댓글 작성`);
  res.status(201).json({ comment });
});

router.delete('/:commentId', (req, res) => {
  const removed = comments.deleteComment(Number(req.params.commentId));
  if (!removed) {
    return res.status(404).json({ error: 'comment not found' });
  }
  res.status(204).end();
});

module.exports = router;
