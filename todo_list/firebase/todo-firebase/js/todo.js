let currentUser = null;
let todos = [];
let currentFilter = 'all';
let currentSort = 'date-newest';
let currentSearch = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get current user
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            attachEventListeners();
        }
    });
});

// Event Listeners
function attachEventListeners() {
    // Add todo form
    document.getElementById('todo-form').addEventListener('submit', addTodo);
    
    // Search input
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderTodos();
    });
    
    // Sort select
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTodos();
    });
    
    // Priority filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.priority;
            renderTodos();
        });
    });
    
    // Edit modal cancel
    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementById('edit-modal').classList.add('hidden');
    });
    
    // Edit form submit
    document.getElementById('edit-form').addEventListener('submit', updateTodo);
}

// Load todos from Firebase
function loadTodos(userId) {
    const todosRef = firebase.database().ref(`todos/${userId}`);
    
    todosRef.on('value', (snapshot) => {
        todos = [];
        snapshot.forEach((childSnapshot) => {
            const todo = {
                id: childSnapshot.key,
                ...childSnapshot.val()
            };
            todos.push(todo);
        });
        renderTodos();
        updateStats();
    });
}

// Add new todo
function addTodo(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const newTodo = {
        title,
        description,
        dueDate: dueDate || null,
        priority,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    
    const todosRef = firebase.database().ref(`todos/${currentUser.uid}`);
    todosRef.push(newTodo)
        .then(() => {
            // Clear form
            document.getElementById('todo-form').reset();
            document.getElementById('dueDate').value = '';
        })
        .catch((error) => {
            console.error('Error adding todo:', error);
            alert('Error adding task. Please try again.');
        });
}

// Update todo
function updateTodo(e) {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const description = document.getElementById('edit-description').value.trim();
    const dueDate = document.getElementById('edit-dueDate').value;
    const priority = document.getElementById('edit-priority').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const updates = {
        title,
        description,
        dueDate: dueDate || null,
        priority,
        updatedAt: Date.now()
    };
    
    const todoRef = firebase.database().ref(`todos/${currentUser.uid}/${id}`);
    todoRef.update(updates)
        .then(() => {
            document.getElementById('edit-modal').classList.add('hidden');
        })
        .catch((error) => {
            console.error('Error updating todo:', error);
            alert('Error updating task. Please try again.');
        });
}

// Delete todo
function deleteTodo(id) {
    if (!currentUser || !confirm('Are you sure you want to delete this task?')) return;
    
    const todoRef = firebase.database().ref(`todos/${currentUser.uid}/${id}`);
    todoRef.remove()
        .catch((error) => {
            console.error('Error deleting todo:', error);
            alert('Error deleting task. Please try again.');
        });
}

// Toggle todo completion
function toggleComplete(id, currentStatus) {
    if (!currentUser) return;
    
    const todoRef = firebase.database().ref(`todos/${currentUser.uid}/${id}`);
    todoRef.update({
        completed: !currentStatus,
        updatedAt: Date.now()
    })
    .catch((error) => {
        console.error('Error updating todo:', error);
    });
}

// Open edit modal
function openEditModal(todo) {
    document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.title;
    document.getElementById('edit-description').value = todo.description || '';
    document.getElementById('edit-dueDate').value = todo.dueDate || '';
    document.getElementById('edit-priority').value = todo.priority;
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

// Filter todos
function filterTodos() {
    let filtered = [...todos];
    
    // Apply priority filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(todo => todo.priority === currentFilter);
    }
    
    // Apply search filter
    if (currentSearch) {
        filtered = filtered.filter(todo => 
            todo.title.toLowerCase().includes(currentSearch) ||
            (todo.description && todo.description.toLowerCase().includes(currentSearch))
        );
    }
    
    return filtered;
}

// Sort todos
function sortTodos(todosList) {
    const sorted = [...todosList];
    
    switch (currentSort) {
        case 'date-newest':
            return sorted.sort((a, b) => b.createdAt - a.createdAt);
        case 'date-oldest':
            return sorted.sort((a, b) => a.createdAt - b.createdAt);
        case 'name-az':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'name-za':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        default:
            return sorted;
    }
}

// Render todos
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    const filtered = filterTodos();
    const sorted = sortTodos(filtered);
    
    if (sorted.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list fa-3x"></i>
                <h3>No tasks found</h3>
                <p>${currentSearch ? 'Try adjusting your search' : 'Add your first task to get started!'}</p>
            </div>
        `;
        return;
    }
    
    todoList.innerHTML = sorted.map(todo => `
        <div class="todo-item ${todo.priority} ${todo.completed ? 'completed' : ''}">
            <div class="todo-content">
                <h3>${todo.title}</h3>
                ${todo.description ? `<p>${todo.description}</p>` : ''}
                <div class="todo-meta">
                    ${todo.dueDate ? `
                        <span>
                            <i class="fas fa-calendar"></i>
                            ${formatDate(todo.dueDate)}
                        </span>
                    ` : ''}
                    <span>
                        <i class="fas fa-flag"></i>
                        ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>
                    <span>
                        <i class="fas fa-clock"></i>
                        ${formatDateFromTimestamp(todo.createdAt)}
                    </span>
                </div>
            </div>
            <div class="todo-actions">
                <button onclick="toggleComplete('${todo.id}', ${todo.completed})" 
                        class="btn btn-small ${todo.completed ? 'btn-secondary' : 'btn-success'}">
                    <i class="fas fa-${todo.completed ? 'undo' : 'check'}"></i>
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="openEditModal(${JSON.stringify(todo).replace(/"/g, '&quot;')})" 
                        class="btn btn-small btn-warning">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteTodo('${todo.id}')" class="btn btn-small btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('completed-tasks').textContent = completed;
    document.getElementById('pending-tasks').textContent = pending;
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}