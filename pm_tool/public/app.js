const socket = io();
let currentProjectId = null;
let currentEditingTaskId = null;
let taskToDeleteId = null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    document.getElementById('auth-modal').style.display = 'flex';
  } else {
    document.getElementById('auth-modal').style.display = 'none';
    updateUserDisplay();
    loadProjects();
  }
});

// Dynamic Greeting & Selection State
function updateUserDisplay() {
  const profileBox = document.getElementById('user-profile-box');
  const displayName = document.getElementById('user-display-name');
  const welcomeUser = document.getElementById('welcome-user');
  const projectTitle = document.getElementById('project-title');

  if (currentUser) {
    const userName = currentUser.name || 'User';
    if (displayName) displayName.textContent = userName;
    if (profileBox) profileBox.style.display = 'flex';

    if (!currentProjectId) {
      if (projectTitle) projectTitle.textContent = `Welcome, ${userName}!`;
      if (welcomeUser) {
        welcomeUser.textContent = '';
        welcomeUser.style.display = 'none';
      }
    } else {
      if (welcomeUser) {
        welcomeUser.textContent = `Welcome, ${userName}!`;
        welcomeUser.style.display = 'inline-block';
      }
    }
  }
}

// Switch between login & register card views
function toggleAuthMode(mode) {
  const loginBox = document.getElementById('login-box');
  const registerBox = document.getElementById('register-box');
  const authHeading = document.getElementById('auth-heading');
  const authSubheading = document.getElementById('auth-subheading');

  if (mode === 'register') {
    if (loginBox) loginBox.style.display = 'none';
    if (registerBox) registerBox.style.display = 'flex';
    if (authHeading) authHeading.textContent = 'Create Account';
    if (authSubheading) authSubheading.textContent = 'Start organizing your projects today';
  } else {
    if (registerBox) registerBox.style.display = 'none';
    if (loginBox) loginBox.style.display = 'flex';
    if (authHeading) authHeading.textContent = 'Welcome Back';
    if (authSubheading) authSubheading.textContent = 'Sign in to access your projects and tasks';
  }
}

async function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if (!name || !email || !password) return alert('Please fill in all fields');

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    showNotification('Account created! Logging in...');
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
    login();
  } else {
    alert(data.error || 'Registration failed');
  }
}

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) return alert('Please enter email and password');

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    currentUser = data;
    localStorage.setItem('user', JSON.stringify(data));
    document.getElementById('auth-modal').style.display = 'none';
    updateUserDisplay();
    loadProjects();
  } else {
    alert(data.error || 'Login failed');
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function promptLogout() {
  document.getElementById('logout-modal').style.display = 'flex';
}

function confirmLogout() {
  closeModal('logout-modal');
  localStorage.removeItem('user');
  currentUser = null;
  currentProjectId = null;

  document.getElementById('project-title').textContent = 'Welcome!';
  document.getElementById('new-task-btn').style.display = 'none';
  document.getElementById('project-actions').style.display = 'none';

  const welcomeUser = document.getElementById('welcome-user');
  if (welcomeUser) {
    welcomeUser.textContent = '';
    welcomeUser.style.display = 'none';
  }

  document.getElementById('no-project-view').style.display = 'flex';
  document.getElementById('board-view').style.display = 'none';
  document.getElementById('project-list').innerHTML = '';
  document.getElementById('user-profile-box').style.display = 'none';

  ['login-email', 'login-password', 'reg-name', 'reg-email', 'reg-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  toggleAuthMode('login');
  document.getElementById('auth-modal').style.display = 'flex';
}

// Projects Logic
async function loadProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();
  const list = document.getElementById('project-list');
  list.innerHTML = '';
  projects.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.title;
    if (currentProjectId === p._id) li.classList.add('active');
    li.onclick = () => selectProject(p._id, p.title);
    list.appendChild(li);
  });
}

function selectProject(id, title) {
  currentProjectId = id;
  document.getElementById('project-title').textContent = title;

  const userName = currentUser ? currentUser.name : '';
  const welcomeUser = document.getElementById('welcome-user');
  if (welcomeUser && userName) {
    welcomeUser.textContent = `Welcome, ${userName}!`;
    welcomeUser.style.display = 'inline-block';
  }

  document.getElementById('no-project-view').style.display = 'none';
  document.getElementById('board-view').style.display = 'flex';
  document.getElementById('new-task-btn').style.display = 'inline-block';
  document.getElementById('project-actions').style.display = 'flex';

  loadProjects();
  socket.emit('join-project', id);
  loadTasks();
}

function openCreateProjectModal() {
  document.getElementById('new-project-title').value = '';
  document.getElementById('create-project-modal').style.display = 'flex';
}

async function submitCreateProject() {
  const title = document.getElementById('new-project-title').value.trim();
  if (!title) return alert('Please enter a project title');

  closeModal('create-project-modal');
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (res.ok) {
    const project = await res.json();
    selectProject(project._id, project.title);
  }
}

function openEditProjectModal() {
  if (!currentProjectId) return;
  const currentTitle = document.getElementById('project-title').textContent;
  document.getElementById('edit-project-title-input').value = currentTitle;
  document.getElementById('edit-project-modal').style.display = 'flex';
}

async function submitEditProject() {
  const title = document.getElementById('edit-project-title-input').value.trim();
  if (!title || !currentProjectId) return;

  closeModal('edit-project-modal');
  const res = await fetch(`/api/projects/${currentProjectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (res.ok) {
    document.getElementById('project-title').textContent = title;
    loadProjects();
    showNotification('Project updated!');
  }
}

function openDeleteProjectModal() {
  if (!currentProjectId) return;
  document.getElementById('delete-project-modal').style.display = 'flex';
}

async function confirmDeleteProject() {
  if (!currentProjectId) return;
  closeModal('delete-project-modal');

  const res = await fetch(`/api/projects/${currentProjectId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    currentProjectId = null;
    updateUserDisplay();
    document.getElementById('project-actions').style.display = 'none';
    document.getElementById('new-task-btn').style.display = 'none';
    document.getElementById('no-project-view').style.display = 'flex';
    document.getElementById('board-view').style.display = 'none';
    loadProjects();
    showNotification('Project deleted');
  }
}

// Tasks Logic
async function loadTasks() {
  if (!currentProjectId) return;
  
  const res = await fetch(`/api/tasks/project/${currentProjectId}`);
  const tasks = await res.json();

  ['Todo', 'In Progress', 'Done'].forEach(status => {
    const colId = `col-${status.replace(/\s+/g, '')}`;
    const col = document.getElementById(colId);
    if (!col) return;
    
    col.innerHTML = `<h3>${status.toUpperCase()}</h3>`;

    const filteredTasks = tasks.filter(t => t.status === status);

    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-column-state';
      emptyState.innerHTML = `
        <div class="empty-icon">📥</div>
        <div class="empty-text">No tasks yet</div>
      `;
      col.appendChild(emptyState);
    } else {
      filteredTasks.forEach(t => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.ondragstart = (e) => e.dataTransfer.setData('taskId', t._id);

        card.innerHTML = `
          <div class="task-card-header">
            <div class="task-title">${escapeHtml(t.title)}</div>
            <div class="task-card-actions">
              <button class="btn-icon-sm edit-task-btn" title="Edit Task">✏️</button>
              <button class="btn-icon-sm danger delete-task-btn" title="Delete Task">🗑️</button>
            </div>
          </div>
          <div class="task-desc">${escapeHtml(t.description || '')}</div>
          <div class="task-assignee">👤 Assigned: <b>${escapeHtml(t.assignedTo || 'Unassigned')}</b></div>
          <div class="comments">
            ${(t.comments || []).map(c => `<div class="comment-item"><b>${escapeHtml(c.userName)}:</b> ${escapeHtml(c.text)}</div>`).join('')}
            <input type="text" class="comment-input" placeholder="Add comment..." onkeydown="addComment(event, '${t._id}')">
          </div>
        `;

        const editBtn = card.querySelector('.edit-task-btn');
        const deleteBtn = card.querySelector('.delete-task-btn');

        editBtn.addEventListener('click', () => {
          openEditTaskModal(t._id, t.title, t.description || '', t.assignedTo || '');
        });

        deleteBtn.addEventListener('click', () => {
          deleteTask(t._id);
        });

        col.appendChild(card);
      });
    }
  });
}

function openCreateTaskModal() {
  if (!currentProjectId) return alert('Select a project first');
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-desc-input').value = '';
  document.getElementById('task-assignee-input').value = '';
  document.getElementById('create-task-modal').style.display = 'flex';
}

async function submitCreateTask() {
  const title = document.getElementById('task-title-input').value.trim();
  if (!title) return alert('Task title is required');

  const description = document.getElementById('task-desc-input').value.trim();
  const assignedInput = document.getElementById('task-assignee-input').value.trim();
  const assignedTo = assignedInput ? assignedInput : 'Unassigned';

  closeModal('create-task-modal');
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, project: currentProjectId, assignedTo })
  });

  if (res.ok) await loadTasks();
}

function openEditTaskModal(id, title, description, assignedTo) {
  currentEditingTaskId = id;
  document.getElementById('edit-task-title-input').value = title;
  document.getElementById('edit-task-desc-input').value = description;
  document.getElementById('edit-task-assignee-input').value = assignedTo;
  document.getElementById('edit-task-modal').style.display = 'flex';
}

async function submitEditTask() {
  if (!currentEditingTaskId) return;

  const title = document.getElementById('edit-task-title-input').value.trim();
  const description = document.getElementById('edit-task-desc-input').value.trim();
  const assignedTo = document.getElementById('edit-task-assignee-input').value.trim();

  if (!title) return alert('Task title is required');

  closeModal('edit-task-modal');
  const res = await fetch(`/api/tasks/${currentEditingTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, assignedTo: assignedTo || 'Unassigned' })
  });

  if (res.ok) {
    currentEditingTaskId = null;
    await loadTasks();
    showNotification('Task updated!');
  }
}

// Styled Task Deletion Modal Logic
function deleteTask(taskId) {
  taskToDeleteId = taskId;
  document.getElementById('delete-task-modal').style.display = 'flex';
}

async function confirmDeleteTask() {
  if (!taskToDeleteId) return;

  closeModal('delete-task-modal');

  const res = await fetch(`/api/tasks/${taskToDeleteId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    taskToDeleteId = null;
    await loadTasks();
    showNotification('Task deleted');
  }
}

// Drag & Drop
function allowDrop(e) {
  e.preventDefault();
  const column = e.target.closest('.column');
  if (column) column.classList.add('drag-over');
}

function dragLeave(e) {
  const column = e.target.closest('.column');
  if (column && !column.contains(e.relatedTarget)) {
    column.classList.remove('drag-over');
  }
}

async function dropTask(e, status) {
  e.preventDefault();
  const column = e.target.closest('.column');
  if (column) column.classList.remove('drag-over');

  const taskId = e.dataTransfer.getData('taskId');
  if (!taskId) return;

  const res = await fetch(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (res.ok) await loadTasks();
}

// Comments
async function addComment(e, taskId) {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const text = e.target.value.trim();
    e.target.value = '';

    const res = await fetch(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: currentUser ? currentUser.name : 'User', text })
    });

    if (res.ok) await loadTasks();
  }
}

function showNotification(text) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `🔔 ${text}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

socket.on('task-updated', (data) => {
  loadTasks();
  showNotification(data && data.message ? data.message : 'Board updated in real-time!');
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}