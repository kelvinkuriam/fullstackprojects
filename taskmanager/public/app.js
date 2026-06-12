const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCountEl = document.getElementById('task-count');
const inputError = document.getElementById('input-error');
const filterBtns = document.querySelectorAll('.filter-btn');

const API_BASE = '/api';
let currentFilter = 'all';
let allTasks = [];


// ====================================================
// 1. API FUNCTIONS
// ====================================================

async function fetchTasks() {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return data.tasks;
}

async function createTask(title) {
    const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message || 'Failed to create task');
    }
    return res.json();
}

async function updateTask(id, isCompleted) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',                                          // FIX 1: was bare PUT (ReferenceError)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: isCompleted }),
    });
    if (!res.ok) { throw new Error(`Failed to update task ${id}`); }
    return res.json();
}

async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) { throw new Error(`Failed to delete task ${id}`); }
}


// ====================================================
// 2. DOM HELPERS
// ====================================================

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.is_completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';                      // FIX 3a: added class for delegation
    checkbox.checked = Boolean(task.is_completed);
    checkbox.dataset.taskId = task.id;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';                    // kept as-is; delegation fixed below
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.taskId = task.id;

    li.appendChild(checkbox);
    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);

    return li;
}

function renderTasks() {
    const filtered = allTasks.filter(task => {
        if (currentFilter === 'completed') return task.is_completed;
        if (currentFilter === 'pending') return !task.is_completed;
        return true;
    });

    taskList.querySelectorAll('.task-item:not(#empty-state)').forEach(el => el.remove());

    const pending = allTasks.filter(t => !t.is_completed).length;
    taskCountEl.textContent = `${pending} pending`;

    if (filtered.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        const fragment = document.createDocumentFragment();
        filtered.forEach(task => fragment.appendChild(createTaskElement(task)));
        taskList.appendChild(fragment);
    }
}

function showError(msg) { inputError.textContent = msg; }
function clearError() { inputError.textContent = ''; }


// ====================================================
// 3. EVENT HANDLERS
// ====================================================

async function handleAddTask() {
    const title = taskInput.value.trim();
    if (!title) { showError('Task title cannot be empty.'); taskInput.focus(); return; }
    if (title.length > 200) { showError('Title must be 200 characters or fewer.'); return; }
    clearError();
    addBtn.disabled = true;
    addBtn.textContent = 'Adding...';
    try {
        const result = await createTask(title);
        allTasks.unshift(result.task);
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    } catch (e) {
        showError(e.message || 'Could not add task.');
    } finally {                                                 // FIX 2: was "nally {" (SyntaxError)
        addBtn.disabled = false;
        addBtn.textContent = '+ Add Task';
    }
}                                                               // FIX 4: closing brace was missing

async function handleToggleTask(id, isCompleted) {
    // Optimistic UI: update local state immediately, then sync to server.
    const task = allTasks.find(t => t.id === parseInt(id));
    if (!task) return;
    task.is_completed = isCompleted;
    renderTasks();
    try {
        await updateTask(id, isCompleted);
    } catch (e) {
        task.is_completed = !isCompleted;                      // Roll back on failure
        renderTasks();
        showError('Could not update task.');
    }
}

async function handleDeleteTask(id) {
    const el = taskList.querySelector(`[data-task-id='${id}']`);
    if (el) el.style.opacity = '0.4';
    try {
        await deleteTask(id);
        allTasks = allTasks.filter(t => t.id !== parseInt(id));
        renderTasks();
    } catch (e) {
        if (el) el.style.opacity = '1';
        showError('Could not delete task.');
    }
}


// ====================================================
// 4. EVENT LISTENERS
// ====================================================

addBtn.addEventListener('click', handleAddTask);

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddTask();
    if (e.key === 'Escape') { taskInput.value = ''; clearError(); }
});

taskInput.addEventListener('input', clearError);

// Event delegation: one listener handles all task clicks
taskList.addEventListener('click', (e) => {
    const id = e.target.dataset.taskId;
    if (!id) return;
    if (e.target.classList.contains('delete-btn')) handleDeleteTask(id);    // FIX 3b: was 'btn-delete'
    if (e.target.classList.contains('task-checkbox')) handleToggleTask(id, e.target.checked); // FIX 3c: was 'task-checkbox' missing from element
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});


// ====================================================
// 5. INITIALISATION
// ====================================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        allTasks = await fetchTasks();
        renderTasks();
    } catch (e) {
        showError('Could not load tasks. Is the server running?');
    }
});