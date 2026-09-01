'use strict';

const express = require('express');
const tags = require('../tags');
const store = require('../store');

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
  res.json({ tags: tags.listByTask(req.taskId) });
});

router.put('/', (req, res) => {
  const body = req.body || {};
  if (!Array.isArray(body.tags)) {
    return res.status(400).json({ error: 'tags must be an array' });
  }
  const saved = tags.setTags(req.taskId, body.tags);
  res.json({ tags: saved });
});

module.exports = router;
