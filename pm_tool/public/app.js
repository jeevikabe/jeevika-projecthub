// const socket = typeof io !== 'undefined' ? io() : null;
// let currentProjectId = null;
// let currentEditingTaskId = null;
// let taskToDeleteId = null;
// let currentUser = JSON.parse(localStorage.getItem('user')) || null;

// document.addEventListener('DOMContentLoaded', () => {
//   if (!currentUser) {
//     document.getElementById('auth-modal').style.display = 'flex';
//   } else {
//     document.getElementById('auth-modal').style.display = 'none';
//     updateUserDisplay();
//     loadProjects();
//   }
// });

// // Dynamic Greeting & Selection State
// function updateUserDisplay() {
//   const profileBox = document.getElementById('user-profile-box');
//   const displayName = document.getElementById('user-display-name');
//   const welcomeUser = document.getElementById('welcome-user');
//   const projectTitle = document.getElementById('project-title');

//   if (currentUser) {
//     const userName = currentUser.name || 'User';
//     if (displayName) displayName.textContent = userName;
//     if (profileBox) profileBox.style.display = 'flex';

//     if (!currentProjectId) {
//       if (projectTitle) projectTitle.textContent = `Welcome, ${userName}!`;
//       if (welcomeUser) {
//         welcomeUser.textContent = '';
//         welcomeUser.style.display = 'none';
//       }
//     } else {
//       if (welcomeUser) {
//         welcomeUser.textContent = `Welcome, ${userName}!`;
//         welcomeUser.style.display = 'inline-block';
//       }
//     }
//   }
// }

// // Switch between login & register card views
// function toggleAuthMode(mode) {
//   const loginBox = document.getElementById('login-box');
//   const registerBox = document.getElementById('register-box');
//   const authHeading = document.getElementById('auth-heading');
//   const authSubheading = document.getElementById('auth-subheading');

//   if (mode === 'register') {
//     if (loginBox) loginBox.style.display = 'none';
//     if (registerBox) registerBox.style.display = 'flex';
//     if (authHeading) authHeading.textContent = 'Create Account';
//     if (authSubheading) authSubheading.textContent = 'Start organizing your projects today';
//   } else {
//     if (registerBox) registerBox.style.display = 'none';
//     if (loginBox) loginBox.style.display = 'flex';
//     if (authHeading) authHeading.textContent = 'Welcome Back';
//     if (authSubheading) authSubheading.textContent = 'Sign in to access your projects and tasks';
//   }
// }

// async function register(e) {
//   if (e) e.preventDefault();

//   const name = document.getElementById('reg-name').value.trim();
//   const email = document.getElementById('reg-email').value.trim();
//   const password = document.getElementById('reg-password').value.trim();

//   if (!name || !email || !password) return alert('Please fill in all fields');

//   const res = await fetch('/api/auth/register', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, email, password })
//   });

//   const data = await res.json();
//   if (res.ok) {
//     showNotification('Account created! Logging in...');
//     document.getElementById('login-email').value = email;
//     document.getElementById('login-password').value = password;
//     login();
//   } else {
//     alert(data.error || 'Registration failed');
//   }
// }

// async function login(e) {
//   if (e) e.preventDefault();

//   const email = document.getElementById('login-email').value.trim();
//   const password = document.getElementById('login-password').value.trim();

//   if (!email || !password) return alert('Please enter email and password');

//   const res = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password })
//   });

//   const data = await res.json();
//   if (data.token) {
//     currentUser = data;
//     localStorage.setItem('user', JSON.stringify(data));
//     document.getElementById('auth-modal').style.display = 'none';
//     updateUserDisplay();
//     loadProjects();
//   } else {
//     alert(data.error || 'Login failed');
//   }
// }

// function closeModal(id) {
//   document.getElementById(id).style.display = 'none';
// }

// function promptLogout() {
//   document.getElementById('logout-modal').style.display = 'flex';
// }

// function confirmLogout() {
//   closeModal('logout-modal');
//   localStorage.removeItem('user');
//   currentUser = null;
//   currentProjectId = null;

//   document.getElementById('project-title').textContent = 'Welcome!';
//   document.getElementById('new-task-btn').style.display = 'none';
//   document.getElementById('project-actions').style.display = 'none';

//   const welcomeUser = document.getElementById('welcome-user');
//   if (welcomeUser) {
//     welcomeUser.textContent = '';
//     welcomeUser.style.display = 'none';
//   }

//   document.getElementById('no-project-view').style.display = 'flex';
//   document.getElementById('board-view').style.display = 'none';
//   document.getElementById('project-list').innerHTML = '';
//   document.getElementById('user-profile-box').style.display = 'none';

//   ['login-email', 'login-password', 'reg-name', 'reg-email', 'reg-password'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) el.value = '';
//   });

//   toggleAuthMode('login');
//   document.getElementById('auth-modal').style.display = 'flex';
// }

// // Projects Logic
// async function loadProjects() {
//   const res = await fetch('/api/projects');
//   const projects = await res.json();
//   const list = document.getElementById('project-list');
//   list.innerHTML = '';
//   projects.forEach(p => {
//     const li = document.createElement('li');
//     li.textContent = p.title;
//     if (currentProjectId === p._id) li.classList.add('active');
//     li.onclick = () => selectProject(p._id, p.title);
//     list.appendChild(li);
//   });
// }

// function selectProject(id, title) {
//   currentProjectId = id;
//   document.getElementById('project-title').textContent = title;

//   const userName = currentUser ? currentUser.name : '';
//   const welcomeUser = document.getElementById('welcome-user');
//   if (welcomeUser && userName) {
//     welcomeUser.textContent = `Welcome, ${userName}!`;
//     welcomeUser.style.display = 'inline-block';
//   }

//   document.getElementById('no-project-view').style.display = 'none';
//   document.getElementById('board-view').style.display = 'flex';
//   document.getElementById('new-task-btn').style.display = 'inline-block';
//   document.getElementById('project-actions').style.display = 'flex';

//   loadProjects();
//   if (socket) socket.emit('join-project', id);
//   loadTasks();
// }

// function openCreateProjectModal() {
//   document.getElementById('new-project-title').value = '';
//   document.getElementById('create-project-modal').style.display = 'flex';
// }

// async function submitCreateProject() {
//   const title = document.getElementById('new-project-title').value.trim();
//   if (!title) return alert('Please enter a project title');

//   closeModal('create-project-modal');
//   const res = await fetch('/api/projects', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title })
//   });

//   if (res.ok) {
//     const project = await res.json();
//     selectProject(project._id, project.title);
//   }
// }

// function openEditProjectModal() {
//   if (!currentProjectId) return;
//   const currentTitle = document.getElementById('project-title').textContent;
//   document.getElementById('edit-project-title-input').value = currentTitle;
//   document.getElementById('edit-project-modal').style.display = 'flex';
// }

// async function submitEditProject() {
//   const title = document.getElementById('edit-project-title-input').value.trim();
//   if (!title || !currentProjectId) return;

//   closeModal('edit-project-modal');
//   const res = await fetch(`/api/projects/${currentProjectId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title })
//   });

//   if (res.ok) {
//     document.getElementById('project-title').textContent = title;
//     loadProjects();
//     showNotification('Project updated!');
//   }
// }

// function openDeleteProjectModal() {
//   if (!currentProjectId) return;
//   document.getElementById('delete-project-modal').style.display = 'flex';
// }

// async function confirmDeleteProject() {
//   if (!currentProjectId) return;
//   closeModal('delete-project-modal');

//   const res = await fetch(`/api/projects/${currentProjectId}`, {
//     method: 'DELETE'
//   });

//   if (res.ok) {
//     currentProjectId = null;
//     updateUserDisplay();
//     document.getElementById('project-actions').style.display = 'none';
//     document.getElementById('new-task-btn').style.display = 'none';
//     document.getElementById('no-project-view').style.display = 'flex';
//     document.getElementById('board-view').style.display = 'none';
//     loadProjects();
//     showNotification('Project deleted');
//   }
// }

// // Tasks Logic
// async function loadTasks() {
//   if (!currentProjectId) return;
  
//   const res = await fetch(`/api/tasks/project/${currentProjectId}`);
//   const tasks = await res.json();

//   ['Todo', 'In Progress', 'Done'].forEach(status => {
//     const colId = `col-${status.replace(/\s+/g, '')}`;
//     const col = document.getElementById(colId);
//     if (!col) return;
    
//     col.innerHTML = `<h3>${status.toUpperCase()}</h3>`;

//     const filteredTasks = tasks.filter(t => t.status === status);

//     if (filteredTasks.length === 0) {
//       const emptyState = document.createElement('div');
//       emptyState.className = 'empty-column-state';
//       emptyState.innerHTML = `
//         <div class="empty-icon">📥</div>
//         <div class="empty-text">No tasks yet</div>
//       `;
//       col.appendChild(emptyState);
//     } else {
//       filteredTasks.forEach(t => {
//         const card = document.createElement('div');
//         card.className = 'task-card';
//         card.draggable = true;
//         card.ondragstart = (e) => e.dataTransfer.setData('taskId', t._id);

//         card.innerHTML = `
//           <div class="task-card-header">
//             <div class="task-title">${escapeHtml(t.title)}</div>
//             <div class="task-card-actions">
//               <button class="btn-icon-sm edit-task-btn" title="Edit Task">✏️</button>
//               <button class="btn-icon-sm danger delete-task-btn" title="Delete Task">🗑️</button>
//             </div>
//           </div>
//           <div class="task-desc">${escapeHtml(t.description || '')}</div>
//           <div class="task-assignee">👤 Assigned: <b>${escapeHtml(t.assignedTo || 'Unassigned')}</b></div>
//           <div class="comments">
//             ${(t.comments || []).map(c => `<div class="comment-item"><b>${escapeHtml(c.userName)}:</b> ${escapeHtml(c.text)}</div>`).join('')}
//             <input type="text" class="comment-input" placeholder="Add comment..." onkeydown="addComment(event, '${t._id}')">
//           </div>
//         `;

//         const editBtn = card.querySelector('.edit-task-btn');
//         const deleteBtn = card.querySelector('.delete-task-btn');

//         editBtn.addEventListener('click', () => {
//           openEditTaskModal(t._id, t.title, t.description || '', t.assignedTo || '');
//         });

//         deleteBtn.addEventListener('click', () => {
//           deleteTask(t._id);
//         });

//         col.appendChild(card);
//       });
//     }
//   });
// }

// function openCreateTaskModal() {
//   if (!currentProjectId) return alert('Select a project first');
//   document.getElementById('task-title-input').value = '';
//   document.getElementById('task-desc-input').value = '';
//   document.getElementById('task-assignee-input').value = '';
//   document.getElementById('create-task-modal').style.display = 'flex';
// }

// async function submitCreateTask() {
//   const title = document.getElementById('task-title-input').value.trim();
//   if (!title) return alert('Task title is required');

//   const description = document.getElementById('task-desc-input').value.trim();
//   const assignedInput = document.getElementById('task-assignee-input').value.trim();
//   const assignedTo = assignedInput ? assignedInput : 'Unassigned';

//   closeModal('create-task-modal');
//   const res = await fetch('/api/tasks', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title, description, project: currentProjectId, assignedTo })
//   });

//   if (res.ok) await loadTasks();
// }

// function openEditTaskModal(id, title, description, assignedTo) {
//   currentEditingTaskId = id;
//   document.getElementById('edit-task-title-input').value = title;
//   document.getElementById('edit-task-desc-input').value = description;
//   document.getElementById('edit-task-assignee-input').value = assignedTo;
//   document.getElementById('edit-task-modal').style.display = 'flex';
// }

// async function submitEditTask() {
//   if (!currentEditingTaskId) return;

//   const title = document.getElementById('edit-task-title-input').value.trim();
//   const description = document.getElementById('edit-task-desc-input').value.trim();
//   const assignedTo = document.getElementById('edit-task-assignee-input').value.trim();

//   if (!title) return alert('Task title is required');

//   closeModal('edit-task-modal');
//   const res = await fetch(`/api/tasks/${currentEditingTaskId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title, description, assignedTo: assignedTo || 'Unassigned' })
//   });

//   if (res.ok) {
//     currentEditingTaskId = null;
//     await loadTasks();
//     showNotification('Task updated!');
//   }
// }

// function deleteTask(taskId) {
//   taskToDeleteId = taskId;
//   document.getElementById('delete-task-modal').style.display = 'flex';
// }

// async function confirmDeleteTask() {
//   if (!taskToDeleteId) return;

//   closeModal('delete-task-modal');

//   const res = await fetch(`/api/tasks/${taskToDeleteId}`, {
//     method: 'DELETE'
//   });

//   if (res.ok) {
//     taskToDeleteId = null;
//     await loadTasks();
//     showNotification('Task deleted');
//   }
// }

// // Drag & Drop
// function allowDrop(e) {
//   e.preventDefault();
//   const column = e.target.closest('.column');
//   if (column) column.classList.add('drag-over');
// }

// function dragLeave(e) {
//   const column = e.target.closest('.column');
//   if (column && !column.contains(e.relatedTarget)) {
//     column.classList.remove('drag-over');
//   }
// }

// async function dropTask(e, status) {
//   e.preventDefault();
//   const column = e.target.closest('.column');
//   if (column) column.classList.remove('drag-over');

//   const taskId = e.dataTransfer.getData('taskId');
//   if (!taskId) return;

//   const res = await fetch(`/api/tasks/${taskId}/status`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ status })
//   });

//   if (res.ok) await loadTasks();
// }

// // Comments
// async function addComment(e, taskId) {
//   if (e.key === 'Enter' && e.target.value.trim()) {
//     const text = e.target.value.trim();
//     e.target.value = '';

//     const res = await fetch(`/api/tasks/${taskId}/comments`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userName: currentUser ? currentUser.name : 'User', text })
//     });

//     if (res.ok) await loadTasks();
//   }
// }

// function showNotification(text) {
//   const container = document.getElementById('toast-container');
//   if (!container) return;
//   const toast = document.createElement('div');
//   toast.className = 'toast';
//   toast.innerHTML = `🔔 ${text}`;
//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.style.opacity = '0';
//     setTimeout(() => toast.remove(), 300);
//   }, 4000);
// }

// if (socket) {
//   socket.on('task-updated', (data) => {
//     loadTasks();
//     showNotification(data && data.message ? data.message : 'Board updated in real-time!');
//   });
// }

// function escapeHtml(str) {
//   if (!str) return '';
//   return String(str)
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
// }




















// Live Render API Base URL
const API_BASE = 'https://jeevika-projecthub-api.onrender.com';

const socket = typeof io !== 'undefined' ? io(API_BASE) : null;
let currentProjectId = null;
let currentEditingTaskId = null;
let taskToDeleteId = null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser) {
    openAuthModal();
  } else {
    document.getElementById('auth-modal').style.display = 'none';
    updateUserDisplay();
    loadProjects();
  }

  // Handle Enter keypress for password inputs
  document.getElementById('login-password')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur(); // Safely dismiss virtual keyboard
      login(e);
    }
  });

  document.getElementById('reg-password')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur(); // Safely dismiss virtual keyboard
      register(e);
    }
  });

  // Tap background/card empty area to dismiss keyboard without triggering back navigation
  document.addEventListener('touchstart', (e) => {
    if (!['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        document.activeElement.blur();
      }
    }
  }, { passive: true });
});

// Toggle password text/password field visibility
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

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

async function register(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if (!name || !email || !password) return alert('Please fill in all fields');

  const res = await fetch(`${API_BASE}/api/auth/register`, {
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

async function login(e) {
  if (e) e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) return alert('Please enter email and password');

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    currentUser = data;
    localStorage.setItem('user', JSON.stringify(data));
    closeAuthModal();
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
  openAuthModal();
}

// Projects Logic
async function loadProjects() {
  const res = await fetch(`${API_BASE}/api/projects`);
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
  if (socket) socket.emit('join-project', id);
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
  const res = await fetch(`${API_BASE}/api/projects`, {
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
  const res = await fetch(`${API_BASE}/api/projects/${currentProjectId}`, {
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

  const res = await fetch(`${API_BASE}/api/projects/${currentProjectId}`, {
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
  
  const res = await fetch(`${API_BASE}/api/tasks/project/${currentProjectId}`);
  const tasks = await res.json();

  ['Todo', 'In Progress', 'Done'].forEach(status => {
    // Map status string to matching DOM column ID
    const statusKey = status === 'In Progress' ? 'InProgress' : status;
    const colId = `col-${statusKey}`;
    const col = document.getElementById(colId);
    if (!col) return;
    
    // Retain heading and check placeholder elements
    const headingHTML = col.querySelector('h3') ? col.querySelector('h3').outerHTML : `<h3>${status.toUpperCase()}</h3>`;
    const placeholderHTML = `<div class="empty-column-placeholder" id="placeholder-${statusKey}" style="display: none;">No task yet</div>`;
    col.innerHTML = headingHTML + placeholderHTML;

    const filteredTasks = tasks.filter(t => t.status === status);
    const placeholderEl = document.getElementById(`placeholder-${statusKey}`);

    if (filteredTasks.length === 0) {
      if (placeholderEl) placeholderEl.style.display = 'flex';
    } else {
      if (placeholderEl) placeholderEl.style.display = 'none';
      filteredTasks.forEach(t => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('data-task-id', t._id);
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
  const res = await fetch(`${API_BASE}/api/tasks`, {
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
  const res = await fetch(`${API_BASE}/api/tasks/${currentEditingTaskId}`, {
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

function deleteTask(taskId) {
  taskToDeleteId = taskId;
  document.getElementById('delete-task-modal').style.display = 'flex';
}

async function confirmDeleteTask() {
  if (!taskToDeleteId) return;

  closeModal('delete-task-modal');

  const res = await fetch(`${API_BASE}/api/tasks/${taskToDeleteId}`, {
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

async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (res.ok) await loadTasks();
}

async function dropTask(e, status) {
  e.preventDefault();
  const column = e.target.closest('.column');
  if (column) column.classList.remove('drag-over');

  const taskId = e.dataTransfer.getData('taskId');
  if (!taskId) return;

  await updateTaskStatus(taskId, status);
}

// Comments
async function addComment(e, taskId) {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const text = e.target.value.trim();
    e.target.value = '';
    e.target.blur(); // Dismiss keyboard after submitting comment

    const res = await fetch(`${API_BASE}/api/tasks/${taskId}/comments`, {
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

if (socket) {
  socket.on('task-updated', (data) => {
    loadTasks();
    showNotification(data && data.message ? data.message : 'Board updated in real-time!');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Mobile Sidebar Drawer Control
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.toggle('open');
  if (backdrop) backdrop.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// Automatically close mobile sidebar when selecting a project
if (typeof selectProject !== 'undefined') {
  const originalSelectProject = selectProject;
  selectProject = function(id, title) {
    originalSelectProject(id, title);
    closeSidebar();
  };
}

// ==========================================================================
// Mobile Touch Drag-and-Drop Support (Touch Events Polyfill)
// ==========================================================================
let draggedCard = null;
let touchClone = null;

function enableTouchDragAndDrop() {
  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
  const card = e.target.closest('.task-card');
  if (!card || e.target.closest('.btn-icon-sm') || e.target.closest('.comment-input')) return;

  draggedCard = card;

  touchClone = card.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.pointerEvents = 'none';
  touchClone.style.opacity = '0.85';
  touchClone.style.zIndex = '9999';
  touchClone.style.width = card.offsetWidth + 'px';
  touchClone.style.transform = 'scale(1.03)';
  document.body.appendChild(touchClone);

  const touch = e.touches[0];
  touchClone.style.left = touch.clientX - card.offsetWidth / 2 + 'px';
  touchClone.style.top = touch.clientY - 20 + 'px';
}

function handleTouchMove(e) {
  if (!draggedCard || !touchClone) return;
  e.preventDefault(); 

  const touch = e.touches[0];
  touchClone.style.left = touch.clientX - touchClone.offsetWidth / 2 + 'px';
  touchClone.style.top = touch.clientY - 20 + 'px';

  const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = targetElement ? targetElement.closest('.column') : null;

  document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));
  if (column) column.classList.add('drag-over');
}

async function handleTouchEnd(e) {
  if (!draggedCard) return;

  if (touchClone) {
    touchClone.remove();
    touchClone = null;
  }

  const touch = e.changedTouches[0];
  const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = targetElement ? targetElement.closest('.column') : null;

  document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));

  if (column) {
    let newStatus = 'Todo';
    if (column.id === 'col-InProgress') newStatus = 'In Progress';
    if (column.id === 'col-Done') newStatus = 'Done';

    const taskId = draggedCard.getAttribute('data-task-id');
    if (taskId) {
      await updateTaskStatus(taskId, newStatus);
    }
  }

  draggedCard = null;
}

document.addEventListener('DOMContentLoaded', enableTouchDragAndDrop);

// ==========================================================================
// Soft Keyboard Open/Close & Android Back Button Interception
// ==========================================================================
// document.addEventListener('focusin', (e) => {
//   if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
//     document.body.classList.add('keyboard-active');
//     setTimeout(() => {
//       e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }, 300);
//   }
// });

// Add keyboard active class and ensure focused inputs stay visible above virtual keyboard
document.addEventListener('focusin', (e) => {
  const target = e.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    document.body.classList.add('keyboard-active');

    // Use visualViewport API if available for precise keyboard detection, or fallback to smooth scroll
    if (window.visualViewport) {
      const handleResize = () => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.visualViewport.removeEventListener('resize', handleResize);
      };
      window.visualViewport.addEventListener('resize', handleResize);
    }

    // Fallback delay for devices without visualViewport resize events
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
});



document.addEventListener('focusout', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    document.body.classList.remove('keyboard-active');
  }
});

// Intercept Android back button when inputs are focused or modal is open
window.addEventListener('popstate', (event) => {
  const activeElement = document.activeElement;
  
  // If an input or textarea is focused, blur it to close the keyboard instead of navigating back
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    event.preventDefault();
    activeElement.blur();
    history.pushState(null, '', window.location.href);
    return;
  }

  // If the auth modal is open when back is pressed, close it or prevent exit if required
  const authModal = document.getElementById('auth-modal');
  if (authModal && authModal.style.display === 'flex' && currentUser) {
    event.preventDefault();
    closeAuthModal();
  }
});

function openAuthModal() {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.style.display = 'flex';
    history.pushState({ modalOpen: true }, '', window.location.href);
  }
}

function closeAuthModal() {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.style.display = 'none';
    if (history.state && history.state.modalOpen) {
      history.back();
    }
  }
}