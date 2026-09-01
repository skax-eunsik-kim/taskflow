'use strict';

const state = { status: '', q: '' };

const listEl = document.getElementById('task-list');
const emptyEl = document.getElementById('empty-message');
const searchEl = document.getElementById('search-input');
const formEl = document.getElementById('create-form');

const STATUS_LABELS = {
  todo: '할 일',
  in_progress: '진행 중',
  done: '완료'
};

async function fetchTasks() {
  const params = new URLSearchParams();
  if (state.status) params.set('status', state.status);
  if (state.q) params.set('q', state.q);
  const res = await fetch(`/api/tasks?${params.toString()}`);
  const data = await res.json();
  render(data.tasks);
}

function render(tasks) {
  listEl.innerHTML = '';
  emptyEl.hidden = tasks.length > 0;
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = `task status-${task.status}`;
    li.innerHTML = `
      <div class="task-main">
        <span class="task-title"></span>
        <span class="badge"></span>
      </div>
      <p class="task-desc"></p>
      <div class="task-actions">
        <select class="status-select">
          <option value="todo">할 일</option>
          <option value="in_progress">진행 중</option>
          <option value="done">완료</option>
        </select>
        <button class="delete-btn">삭제</button>
      </div>
    `;
    li.querySelector('.task-title').textContent = task.title;
    li.querySelector('.badge').textContent = STATUS_LABELS[task.status] || task.status;
    li.querySelector('.task-desc').textContent = task.description || '';
    const select = li.querySelector('.status-select');
    select.value = task.status;
    select.addEventListener('change', async () => {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: select.value })
      });
      fetchTasks();
    });
    li.querySelector('.delete-btn').addEventListener('click', async () => {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      fetchTasks();
    });
    listEl.appendChild(li);
  }
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('title-input').value;
  const assignee = document.getElementById('assignee-input').value;
  const description = document.getElementById('description-input').value;
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignee, description })
  });
  if (res.ok) {
    formEl.reset();
    fetchTasks();
  }
});

searchEl.addEventListener('input', () => {
  state.q = searchEl.value;
  fetchTasks();
});

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    state.status = button.dataset.status;
    fetchTasks();
  });
});

const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('taskflow-theme', next);
  applyTheme(next);
});

applyTheme(localStorage.getItem('taskflow-theme') || 'light');

fetchTasks();
