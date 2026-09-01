'use strict';

let nextId = 4;

const tasks = [
  {
    id: 1,
    title: '온보딩 문서 정리',
    description: '신규 팀원을 위한 온보딩 가이드를 최신 상태로 갱신한다.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'jiyoung',
    createdAt: '2026-08-20T09:00:00.000Z'
  },
  {
    id: 2,
    title: '주간 회의록 공유',
    description: '지난 주 회의록을 위키에 올리고 팀 채널에 공유한다.',
    status: 'done',
    priority: 'low',
    assignee: 'minsu',
    createdAt: '2026-08-21T02:30:00.000Z'
  },
  {
    id: 3,
    title: '배포 스크립트 점검',
    description: '스테이징 배포 스크립트의 실패 케이스를 재현하고 원인을 기록한다.',
    status: 'todo',
    priority: 'medium',
    assignee: null,
    createdAt: '2026-08-25T11:15:00.000Z'
  }
];

const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];

function listTasks({ status, q } = {}) {
  let result = tasks.slice();
  if (status) {
    result = result.filter((task) => task.status === status);
  }
  if (q) {
    const keyword = String(q).toLowerCase();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword) ||
        (task.description || '').toLowerCase().includes(keyword)
    );
  }
  return result;
}

function getTask(id) {
  return tasks.find((task) => task.id === id) || null;
}

function createTask({ title, description, assignee, priority }) {
  const task = {
    id: nextId++,
    title,
    description: description || '',
    status: 'todo',
    priority: priority || 'medium',
    assignee: assignee || null,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  return task;
}

function updateTask(id, patch) {
  const task = getTask(id);
  if (!task) return null;
  if (patch.title !== undefined) task.title = patch.title;
  if (patch.description !== undefined) task.description = patch.description;
  if (patch.assignee !== undefined) task.assignee = patch.assignee;
  if (patch.status !== undefined) task.status = patch.status;
  if (patch.priority !== undefined) task.priority = patch.priority;
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = {
  VALID_STATUSES,
  VALID_PRIORITIES,
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
