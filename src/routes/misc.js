'use strict';

const express = require('express');
const store = require('../store');
const users = require('../users');
const tags = require('../tags');
const activity = require('../activity');
const { computeStats } = require('../stats');

const router = express.Router();

router.get('/users', (req, res) => {
  res.json({ users: users.listUsers() });
});

router.get('/users/:username', (req, res) => {
  const user = users.getUser(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }
  res.json({ user });
});

router.get('/tags', (req, res) => {
  res.json({ tags: tags.listAllTags() });
});

router.get('/activity', (req, res) => {
  res.json({ activity: activity.list({ limit: req.query.limit }) });
});

router.get('/stats', (req, res) => {
  res.json({ stats: computeStats(store.listTasks()) });
});

module.exports = router;
