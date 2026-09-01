'use strict';

let nextId = 3;

const projects = [
  {
    id: 1,
    name: '플랫폼 개선',
    description: '내부 도구와 개발 환경을 개선하는 트랙',
    taskIds: [1, 3],
    createdAt: '2026-08-19T08:00:00.000Z'
  },
  {
    id: 2,
    name: '운영 업무',
    description: '반복되는 팀 운영 업무 모음',
    taskIds: [2],
    createdAt: '2026-08-19T08:05:00.000Z'
  }
];

function listProjects() {
  return projects;
}

function getProject(id) {
  return projects.find((project) => project.id === id) || null;
}

function createProject({ name, description }) {
  const project = {
    id: nextId++,
    name,
    description: description || '',
    taskIds: [],
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  return project;
}

function updateProject(id, patch) {
  const project = getProject(id);
  if (!project) return null;
  if (patch.name !== undefined) project.name = patch.name;
  if (patch.description !== undefined) project.description = patch.description;
  return project;
}

function deleteProject(id) {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  return true;
}

function assignTask(projectId, taskId) {
  const project = getProject(projectId);
  if (!project) return null;
  if (!project.taskIds.includes(taskId)) {
    project.taskIds.push(taskId);
  }
  return project;
}

function unassignTask(projectId, taskId) {
  const project = getProject(projectId);
  if (!project) return null;
  const index = project.taskIds.indexOf(taskId);
  if (index !== -1) {
    project.taskIds.splice(index, 1);
  }
  return project;
}

function computeProgress(project, getTask) {
  const tasks = project.taskIds.map((taskId) => getTask(taskId)).filter(Boolean);
  if (tasks.length === 0) return 0;
  const done = tasks.filter((task) => task.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

module.exports = {
  listProjects,
  computeProgress,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignTask,
  unassignTask
};
