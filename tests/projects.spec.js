'use strict';

const test = require('node:test');
const assert = require('node:assert');
const projects = require('../src/projects');

test('createProject assigns id and empty taskIds', () => {
  const project = projects.createProject({ name: '테스트 프로젝트' });
  assert.ok(project.id > 0);
  assert.deepStrictEqual(project.taskIds, []);
  projects.deleteProject(project.id);
});

test('assignTask adds a task once', () => {
  const project = projects.createProject({ name: '배정 테스트' });
  projects.assignTask(project.id, 1);
  projects.assignTask(project.id, 1);
  assert.deepStrictEqual(project.taskIds, [1]);
  projects.deleteProject(project.id);
});

test('unassignTask removes the task', () => {
  const project = projects.createProject({ name: '해제 테스트' });
  projects.assignTask(project.id, 2);
  projects.unassignTask(project.id, 2);
  assert.deepStrictEqual(project.taskIds, []);
  projects.deleteProject(project.id);
});

test('updateProject changes name and description', () => {
  const project = projects.createProject({ name: '이름 변경 전' });
  const updated = projects.updateProject(project.id, { name: '이름 변경 후', description: '설명' });
  assert.strictEqual(updated.name, '이름 변경 후');
  assert.strictEqual(updated.description, '설명');
  projects.deleteProject(project.id);
});

test('computeProgress returns done ratio of resolvable tasks', () => {
  const project = { taskIds: [1, 2, 99999] };
  const getTask = (id) =>
    ({ 1: { status: 'done' }, 2: { status: 'todo' } })[id] || null;
  assert.strictEqual(projects.computeProgress(project, getTask), 50);
});

test('computeProgress returns 0 for empty project', () => {
  assert.strictEqual(projects.computeProgress({ taskIds: [] }, () => null), 0);
});

test('deleteProject returns false for unknown id', () => {
  assert.strictEqual(projects.deleteProject(99999), false);
});
