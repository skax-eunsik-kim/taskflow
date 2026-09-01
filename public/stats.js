'use strict';

async function loadStats() {
  const res = await fetch('/api/stats');
  const { stats } = await res.json();
  const cards = [
    { label: '전체 작업', value: stats.total },
    { label: '할 일', value: stats.byStatus.todo },
    { label: '진행 중', value: stats.byStatus.in_progress },
    { label: '완료', value: stats.byStatus.done },
    { label: '완료율', value: `${stats.doneRatio}%` }
  ];
  const cardsEl = document.getElementById('stat-cards');
  cardsEl.innerHTML = '';
  for (const card of cards) {
    const div = document.createElement('div');
    div.className = 'stat-card';
    const value = document.createElement('div');
    value.className = 'value';
    value.textContent = card.value;
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = card.label;
    div.append(value, label);
    cardsEl.appendChild(div);
  }

  const assigneeEl = document.getElementById('assignee-list');
  assigneeEl.innerHTML = '';
  for (const [assignee, count] of Object.entries(stats.byAssignee)) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = assignee;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `${count}개`;
    li.append(name, meta);
    assigneeEl.appendChild(li);
  }
}

async function loadActivity() {
  const res = await fetch('/api/activity?limit=10');
  const { activity } = await res.json();
  const listEl = document.getElementById('activity-list');
  const emptyEl = document.getElementById('activity-empty');
  listEl.innerHTML = '';
  emptyEl.hidden = activity.length > 0;
  for (const entry of activity) {
    const li = document.createElement('li');
    const message = document.createElement('span');
    message.textContent = entry.message;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = new Date(entry.createdAt).toLocaleString('ko-KR');
    li.append(message, meta);
    listEl.appendChild(li);
  }
}

loadStats();
loadActivity();
