'use strict';

const express = require('express');
const projects = require('../projects');
const store = require('../store');
const activity = require('../activity');

const router = express.Router();

router.get('/', (req, res) => {
  const list = projects.listProjects().map((project) => ({
    ...project,
    taskCount: project.taskIds.length,
    progress: projects.computeProgress(project, store.getTask)
  }));
  res.json({ projects: list });
});

router.post('/', (req, res) => {
  const { name, description } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const project = projects.createProject({ name: String(name).trim(), description });
  activity.record('project.created', `프로젝트 생성: ${project.name}`);
  res.status(201).json({ project });
});

router.get('/:id', (req, res) => {
  const project = projects.getProject(Number(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  const tasks = project.taskIds.map((taskId) => store.getTask(taskId)).filter(Boolean);
  const progress = projects.computeProgress(project, store.getTask);
  res.json({ project: { ...project, tasks, progress } });
});

router.patch('/:id', (req, res) => {
  const project = projects.updateProject(Number(req.params.id), req.body || {});
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  activity.record('project.updated', `프로젝트 수정: ${project.name}`);
  res.json({ project });
});

router.delete('/:id', (req, res) => {
  const removed = projects.deleteProject(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'project not found' });
  }
  activity.record('project.deleted', `프로젝트 삭제: #${req.params.id}`);
  res.status(204).end();
});

router.post('/:id/tasks', (req, res) => {
  const taskId = Number((req.body || {}).taskId);
  if (!store.getTask(taskId)) {
    return res.status(400).json({ error: 'unknown taskId' });
  }
  const project = projects.assignTask(Number(req.params.id), taskId);
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  activity.record('project.task_assigned', `프로젝트 '${project.name}'에 작업 #${taskId} 배정`);
  res.json({ project });
});

router.delete('/:id/tasks/:taskId', (req, res) => {
  const project = projects.unassignTask(Number(req.params.id), Number(req.params.taskId));
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  res.json({ project });
});

module.exports = router;
