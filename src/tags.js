'use strict';

const tagsByTask = new Map([
  [1, ['docs', 'onboarding']],
  [3, ['infra']]
]);

function listByTask(taskId) {
  return tagsByTask.get(taskId) || [];
}

function setTags(taskId, tags) {
  const normalized = [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
  tagsByTask.set(taskId, normalized);
  return normalized;
}

function listAllTags() {
  const all = new Set();
  for (const tags of tagsByTask.values()) {
    for (const tag of tags) all.add(tag);
  }
  return [...all].sort();
}

function removeTask(taskId) {
  tagsByTask.delete(taskId);
}

module.exports = { listByTask, setTags, listAllTags, removeTask };
