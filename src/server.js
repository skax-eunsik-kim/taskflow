'use strict';

const path = require('path');
const express = require('express');
const store = require('./store');
const projectsRouter = require('./routes/projects');
const commentsRouter = require('./routes/comments');
const tagsRouter = require('./routes/tags');
const miscRouter = require('./routes/misc');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/projects', projectsRouter);
app.use('/api/tasks/:taskId/comments', commentsRouter);
app.use('/api/tasks/:taskId/tags', tagsRouter);
app.use('/api', miscRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'taskflow' });
});

app.get('/api/tasks', (req, res) => {
  const { status, q } = req.query;
  if (status && !store.VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'invalid status filter' });
  }
  res.json({ tasks: store.listTasks({ status, q }) });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = store.getTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json({ task });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, assignee } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const task = store.createTask({ title: String(title).trim(), description, assignee });
  res.status(201).json({ task });
});

app.patch('/api/tasks/:id', (req, res) => {
  const patch = req.body || {};
  if (patch.status && !store.VALID_STATUSES.includes(patch.status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  const task = store.updateTask(Number(req.params.id), patch);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json({ task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const removed = store.deleteTask(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(204).end();
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`taskflow listening on http://localhost:${port}`);
  });
}

module.exports = app;
