'use strict';

let selectedProjectId = null;

const projectListEl = document.getElementById('project-list');
const detailPanelEl = document.getElementById('detail-panel');
const detailTitleEl = document.getElementById('detail-title');
const detailDescriptionEl = document.getElementById('detail-description');
const detailTasksEl = document.getElementById('detail-tasks');
const assignSelectEl = document.getElementById('assign-select');

async function fetchProjects() {
  const res = await fetch('/api/projects');
  const data = await res.json();
  projectListEl.innerHTML = '';
  for (const project of data.projects) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = project.name;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `작업 ${project.taskCount}개 · ${project.progress}% 완료`;
    const openButton = document.createElement('button');
    openButton.textContent = '열기';
    openButton.addEventListener('click', () => openProject(project.id));
    li.append(label, meta, openButton);
    projectListEl.appendChild(li);
  }
}

async function openProject(id) {
  selectedProjectId = id;
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) return;
  const { project } = await res.json();
  detailPanelEl.hidden = false;
  detailTitleEl.textContent = project.name;
  detailDescriptionEl.textContent = project.description || '';
  detailTasksEl.innerHTML = '';
  for (const task of project.tasks) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = task.title;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = task.status;
    const removeButton = document.createElement('button');
    removeButton.textContent = '제외';
    removeButton.addEventListener('click', async () => {
      await fetch(`/api/projects/${id}/tasks/${task.id}`, { method: 'DELETE' });
      openProject(id);
      fetchProjects();
    });
    li.append(label, meta, removeButton);
    detailTasksEl.appendChild(li);
  }
  await refreshAssignOptions();
}

async function refreshAssignOptions() {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  assignSelectEl.innerHTML = '';
  for (const task of data.tasks) {
    const option = document.createElement('option');
    option.value = task.id;
    option.textContent = `#${task.id} ${task.title}`;
    assignSelectEl.appendChild(option);
  }
}

document.getElementById('assign-button').addEventListener('click', async () => {
  if (!selectedProjectId || !assignSelectEl.value) return;
  await fetch(`/api/projects/${selectedProjectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: Number(assignSelectEl.value) })
  });
  openProject(selectedProjectId);
  fetchProjects();
});

document.getElementById('project-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('project-name').value;
  const description = document.getElementById('project-description').value;
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  });
  if (res.ok) {
    event.target.reset();
    fetchProjects();
  }
});

fetchProjects();
