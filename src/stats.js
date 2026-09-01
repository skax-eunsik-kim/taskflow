'use strict';

function computeStats(tasks) {
  const byStatus = { todo: 0, in_progress: 0, done: 0 };
  const byAssignee = {};
  for (const task of tasks) {
    if (byStatus[task.status] !== undefined) {
      byStatus[task.status] += 1;
    }
    const key = task.assignee || '(미지정)';
    byAssignee[key] = (byAssignee[key] || 0) + 1;
  }
  const total = tasks.length;
  const doneRatio = total === 0 ? 0 : Math.round((byStatus.done / total) * 100);
  return { total, byStatus, byAssignee, doneRatio };
}

module.exports = { computeStats };
