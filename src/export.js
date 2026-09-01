'use strict';

const COLUMNS = ['id', 'title', 'status', 'assignee', 'createdAt'];

function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(tasks) {
  const lines = [COLUMNS.join(',')];
  for (const task of tasks) {
    lines.push(COLUMNS.map((column) => escapeCell(task[column])).join(','));
  }
  return lines.join('\n') + '\n';
}

module.exports = { toCsv, COLUMNS };
