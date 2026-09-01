'use strict';

const path = require('path');
const express = require('express');
const store = require('./store');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

function sendError(res, status, code, message) {
  res.status(status).json({ error: { code, message } });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'taskflow' });
});

app.get('/api/tasks', (req, res) => {
  const { status, q } = req.query;
  if (status && !store.VALID_STATUSES.includes(status)) {
    return sendError(res, 400, 'INVALID_STATUS_FILTER', '유효하지 않은 상태 필터입니다.');
  }
  res.json({ tasks: store.listTasks({ status, q }) });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = store.getTask(Number(req.params.id));
  if (!task) {
    return sendError(res, 404, 'TASK_NOT_FOUND', '작업을 찾을 수 없습니다.');
  }
  res.json({ task });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, assignee } = req.body || {};
  if (!title || !String(title).trim()) {
    return sendError(res, 400, 'TITLE_REQUIRED', '제목은 필수입니다.');
  }
  const task = store.createTask({ title: String(title).trim(), description, assignee });
  res.status(201).json({ task });
});

app.patch('/api/tasks/:id', (req, res) => {
  const patch = req.body || {};
  if (patch.status && !store.VALID_STATUSES.includes(patch.status)) {
    return sendError(res, 400, 'INVALID_STATUS', '유효하지 않은 상태 값입니다.');
  }
  const task = store.updateTask(Number(req.params.id), patch);
  if (!task) {
    return sendError(res, 404, 'TASK_NOT_FOUND', '작업을 찾을 수 없습니다.');
  }
  res.json({ task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const removed = store.deleteTask(Number(req.params.id));
  if (!removed) {
    return sendError(res, 404, 'TASK_NOT_FOUND', '작업을 찾을 수 없습니다.');
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
