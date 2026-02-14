// API Service
const API = {
    baseUrl: 'http://localhost:3000/api',
    
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Auth
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    // Lists
    async getLists() {
        return this.request('/lists');
    },

    async createList(listData) {
        return this.request('/lists', {
            method: 'POST',
            body: JSON.stringify(listData)
        });
    },

    async updateList(id, listData) {
        return this.request(`/lists/${id}`, {
            method: 'PUT',
            body: JSON.stringify(listData)
        });
    },

    async deleteList(id) {
        return this.request(`/lists/${id}`, {
            method: 'DELETE'
        });
    },

    // Tasks
    async getTasks(listId) {
        return this.request(`/tasks/list/${listId}`);
    },

    async createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    },

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    },

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }
};

// UI Components
class Notification {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    static getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Modal Manager
class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.title = document.getElementById('modalTitle');
        this.body = document.getElementById('modalBody');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector('.close-btn').addEventListener('click', () => this.hide());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    show(title, content) {
        this.title.textContent = title;
        this.body.innerHTML = '';
        this.body.appendChild(content);
        this.modal.classList.add('active');
    }

    hide() {
        this.modal.classList.remove('active');
    }
}

// Task Form Component
class TaskForm {
    constructor(listId, task = null) {
        this.listId = listId;
        this.task = task;
    }

    render() {
        const form = document.createElement('form');
        form.className = 'task-form';
        form.innerHTML = `
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="taskTitle" value="${this.task?.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="taskDescription" rows="3">${this.task?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Prioridade</label>
                <select id="taskPriority">
                    <option value="1" ${this.task?.priority === 1 ? 'selected' : ''}>Baixa</option>
                    <option value="2" ${this.task?.priority === 2 ? 'selected' : ''}>Média</option>
                    <option value="3" ${this.task?.priority === 3 ? 'selected' : ''}>Alta</option>
                </select>
            </div>
            <div class="form-group">
                <label>Data de Entrega</label>
                <input type="date" id="taskDueDate" value="${this.task?.due_date || ''}">
            </div>
            <button type="submit" class="btn">${this.task ? 'Atualizar' : 'Criar'} Tarefa</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskData = {
                list_id: this.listId,
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                priority: parseInt(document.getElementById('taskPriority').value),
                due_date: document.getElementById('taskDueDate').value || null
            };

            if (this.task) {
                this.handleUpdate(taskData);
            } else {
                this.handleCreate(taskData);
            }
        });

        return form;
    }

    async handleCreate(taskData) {
        try {
            await API.createTask(taskData);
            Notification.show('Tarefa criada com sucesso!', 'success');
            document.getElementById('modal').classList.remove('active');
            loadTasks(this.listId);
        } catch (error) {
            Notification.show(error.message, 'error');
        }
    }

    async handleUpdate(taskData) {
        try {
            await API.updateTask(this.task.id, taskData);
            Notification.show('Tarefa atualizada com sucesso!', 'success');
            document.getElementById('modal').classList.remove('active');
            loadTasks(this.listId);
        } catch (error) {
            Notification.show(error.message, 'error');
        }
    }
}

// List Form Component
class ListForm {
    constructor(list = null) {
        this.list = list;
    }

    render() {
        const colors = ['#4A90E2', '#27AE60', '#E74C3C', '#F39C12', '#9B59B6', '#E67E22'];
        
        const form = document.createElement('form');
        form.className = 'list-form';
        
        form.innerHTML = `
            <div class="form-group">
                <label>Título</label>
                <input type="text" id="listTitle" value="${this.list?.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="listDescription" rows="3">${this.list?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Cor</label>
                <div class="color-picker">
                    ${colors.map(color => `
                        <div class="color-option ${this.list?.color === color ? 'selected' : ''}" 
                             style="background-color: ${color}"
                             data-color="${color}"></div>
                    `).join('')}
                </div>
                <input type="hidden" id="listColor" value="${this.list?.color || colors[0]}">
            </div>
            <button type="submit" class="btn">${this.list ? 'Atualizar' : 'Criar'} Lista</button>
        `;

        // Color picker functionality
        const colorOptions = form.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                form.querySelector('#listColor').value = option.dataset.color;
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const listData = {
                title: document.getElementById('listTitle').value,
                description: document.getElementById('listDescription').value,
                color: document.getElementById('listColor').value
            };

            if (this.list) {
                this.handleUpdate(listData);
            } else {
                this.handleCreate(listData);
            }
        });

        return form;
    }

    async handleCreate(listData) {
        try {
            await API.createList(listData);
            Notification.show('Lista criada com sucesso!', 'success');
            document.getElementById('modal').classList.remove('active');
            loadLists();
        } catch (error) {
            Notification.show(error.message, 'error');
        }
    }

    async handleUpdate(listData) {
        try {
            await API.updateList(this.list.id, listData);
            Notification.show('Lista atualizada com sucesso!', 'success');
            document.getElementById('modal').classList.remove('active');
            loadLists();
        } catch (error) {
            Notification.show(error.message, 'error');
        }
    }
}

// Main App Logic
const modal = new Modal();

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        showMainApp();
    } else {
        showAuth();
    }
}

// Show auth screen
function showAuth() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

// Show main app
function showMainApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').textContent = user.username;
    
    loadLists();
}

// Load lists
async function loadLists() {
    try {
        const lists = await API.getLists();
        renderLists(lists);
    } catch (error) {
        Notification.show('Erro ao carregar listas', 'error');
        if (error.message.includes('token')) {
            logout();
        }
    }
}

// Render lists
function renderLists(lists) {
    const container = document.getElementById('listsContainer');
    
    if (lists.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>Você ainda não tem nenhuma lista</p>
                <p>Clique no botão + para criar sua primeira lista</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lists.map(list => `
        <div class="list-card" style="--color: ${list.color}" onclick="viewList(${list.id})">
            <h3>${list.title}</h3>
            <p>${list.description || 'Sem descrição'}</p>
            <div class="list-stats">
                <div class="progress-bar">
                    <div class="progress" style="width: ${list.total_tasks ? (list.completed_tasks / list.total_tasks * 100) : 0}%"></div>
                </div>
                <span>${list.completed_tasks || 0}/${list.total_tasks || 0}</span>
            </div>
            <div class="list-actions">
                <button class="action-btn" onclick="event.stopPropagation(); editList(${JSON.stringify(list).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-danger" onclick="event.stopPropagation(); deleteList(${list.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// View list tasks
async function viewList(listId) {
    try {
        const tasks = await API.getTasks(listId);
        renderTasks(tasks, listId);
        
        document.getElementById('listsView').style.display = 'none';
        document.getElementById('tasksView').style.display = 'block';
    } catch (error) {
        Notification.show('Erro ao carregar tarefas', 'error');
    }
}

// Render tasks
function renderTasks(tasks, listId) {
    const container = document.getElementById('tasksList');
    const listInfo = document.getElementById('currentListTitle');
    
    listInfo.textContent = 'Tarefas da Lista';

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>Nenhuma tarefa nesta lista</p>
                <button class="btn" onclick="showAddTaskModal(${listId})">Adicionar Tarefa</button>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id}, ${!task.completed})">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    ${task.priority ? `
                        <span class="priority-badge priority-${task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}">
                            ${task.priority === 3 ? 'Alta' : task.priority === 2 ? 'Média' : 'Baixa'}
                        </span>
                    ` : ''}
                    ${task.due_date ? `
                        <span><i class="far fa-calendar"></i> ${new Date(task.due_date).toLocaleDateString()}</span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn" onclick="showEditTaskModal(${listId}, ${JSON.stringify(task).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-danger" onclick="deleteTask(${task.id}, ${listId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Toggle task completion
async function toggleTask(taskId, completed) {
    try {
        await API.updateTask(taskId, { completed });
        Notification.show('Tarefa atualizada!', 'success');
        
        // Recarregar tarefas da lista atual
        const listId = document.querySelector('[data-list-id]')?.dataset.listId;
        if (listId) {
            const tasks = await API.getTasks(listId);
            renderTasks(tasks, listId);
        }
    } catch (error) {
        Notification.show('Erro ao atualizar tarefa', 'error');
    }
}

// Show add list modal
function showAddListModal() {
    const form = new ListForm().render();
    modal.show('Nova Lista', form);
}

// Show edit list modal
function editList(list) {
    const form = new ListForm(list).render();
    modal.show('Editar Lista', form);
}

// Delete list
async function deleteList(listId) {
    if (confirm('Tem certeza que deseja deletar esta lista?')) {
        try {
            await API.deleteList(listId);
            Notification.show('Lista deletada com sucesso!', 'success');
            loadLists();
        } catch (error) {
            Notification.show('Erro ao deletar lista', 'error');
        }
    }
}

// Show add task modal
function showAddTaskModal(listId) {
    const form = new TaskForm(listId).render();
    modal.show('Nova Tarefa', form);
}

// Show edit task modal
function showEditTaskModal(listId, task) {
    const form = new TaskForm(listId, task).render();
    modal.show('Editar Tarefa', form);
}

// Delete task
async function deleteTask(taskId, listId) {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        try {
            await API.deleteTask(taskId);
            Notification.show('Tarefa deletada com sucesso!', 'success');
            
            // Recarregar tarefas
            const tasks = await API.getTasks(listId);
            renderTasks(tasks, listId);
        } catch (error) {
            Notification.show('Erro ao deletar tarefa', 'error');
        }
    }
}

// Go back to lists
function backToLists() {
    document.getElementById('listsView').style.display = 'block';
    document.getElementById('tasksView').style.display = 'none';
}

// Auth functions
async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await API.register(userData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        Notification.show('Registro realizado com sucesso!', 'success');
        showMainApp();
    } catch (error) {
        Notification.show(error.message, 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const credentials = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await API.login(credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        Notification.show('Login realizado com sucesso!', 'success');
        showMainApp();
    } catch (error) {
        Notification.show(error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuth();
    Notification.show('Logout realizado com sucesso!', 'info');
}

// Tab switching
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('.tab-btn:first-child');
    const registerTab = document.querySelector('.tab-btn:last-child');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Adicionar event listeners para forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Adicionar listener para botão flutuante
    document.querySelector('.floating-btn').addEventListener('click', showAddListModal);
});

// Tornar funções globais
window.viewList = viewList;
window.editList = editList;
window.deleteList = deleteList;
window.showAddTaskModal = showAddTaskModal;
window.showEditTaskModal = showEditTaskModal;
window.deleteTask = deleteTask;
window.backToLists = backToLists;
window.toggleTask = toggleTask;
window.switchTab = switchTab;
window.logout = logout;