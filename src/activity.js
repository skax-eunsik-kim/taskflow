'use strict';

const MAX_ENTRIES = 200;

let nextId = 1;
const entries = [];

function record(type, message) {
  const entry = {
    id: nextId++,
    type,
    message,
    createdAt: new Date().toISOString()
  };
  entries.unshift(entry);
  if (entries.length > MAX_ENTRIES) {
    entries.pop();
  }
  return entry;
}

function list({ limit } = {}) {
  const count = Number(limit) > 0 ? Number(limit) : 20;
  return entries.slice(0, count);
}

module.exports = { record, list };
