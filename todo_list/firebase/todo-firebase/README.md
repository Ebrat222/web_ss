A comprehensive To-do List application with Firebase Realtime Database CRUD operations, sorting, and search functionality.

Project Structure

```
todo-firebase/
├── public/
│   ├── index.html
│   └── css/
│       └── style.css
├── js/
│   ├── firebase-config.js
│   ├── todo.js
│   └── auth.js
└── README.md
```

1. Firebase Setup & Configuration

First, create a Firebase project at console.firebase.google.com

firebase-config.js:

```javascript
// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Initialize FirebaseUI for authentication
const uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};
```

2. HTML Structure

index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List with Firebase</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Firebase and FirebaseUI -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
</head>
<body>
    <div class="container">
        <!-- Auth Section -->
        <div id="auth-section" class="auth-section">
            <div class="auth-container">
                <h1><i class="fas fa-tasks"></i> Todo List</h1>
                <p>Sign in to manage your todos</p>
                <div id="firebaseui-auth-container"></div>
            </div>
        </div>

        <!-- Main App (hidden until authenticated) -->
        <div id="app" class="app-container hidden">
            <!-- Header -->
            <header class="app-header">
                <h1><i class="fas fa-tasks"></i> Todo List</h1>
                <div class="user-info">
                    <img id="user-photo" src="" alt="User Photo" class="user-photo">
                    <span id="user-name"></span>
                    <button id="sign-out" class="btn btn-secondary">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </header>

            <!-- Controls Section -->
            <div class="controls">
                <!-- Add Todo Form -->
                <div class="add-todo-card">
                    <h3><i class="fas fa-plus-circle"></i> Add New Task</h3>
                    <form id="todo-form">
                        <div class="form-group">
                            <input type="text" id="title" placeholder="Task Title" required>
                        </div>
                        <div class="form-group">
                            <textarea id="description" placeholder="Task Description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="dueDate"><i class="fas fa-calendar"></i> Due Date:</label>
                            <input type="date" id="dueDate">
                        </div>
                        <div class="form-group">
                            <label for="priority"><i class="fas fa-flag"></i> Priority:</label>
                            <select id="priority">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Task
                        </button>
                    </form>
                </div>

                <!-- Search and Sort Controls -->
                <div class="filter-controls">
                    <!-- Search -->
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="search-input" placeholder="Search tasks...">
                    </div>

                    <!-- Sort Options -->
                    <div class="sort-options">
                        <label><i class="fas fa-sort"></i> Sort By:</label>
                        <select id="sort-select">
                            <option value="date-newest">Date (Newest First)</option>
                            <option value="date-oldest">Date (Oldest First)</option>
                            <option value="name-az">Name (A-Z)</option>
                            <option value="name-za">Name (Z-A)</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>

                    <!-- Filter by Priority -->
                    <div class="priority-filter">
                        <button class="filter-btn active" data-priority="all">All</button>
                        <button class="filter-btn" data-priority="high">High</button>
                        <button class="filter-btn" data-priority="medium">Medium</button>
                        <button class="filter-btn" data-priority="low">Low</button>
                    </div>
                </div>
            </div>

            <!-- Todo List -->
            <div class="todo-list-container">
                <h2><i class="fas fa-list-check"></i> Your Tasks</h2>
                <div id="todo-list" class="todo-list">
                    <!-- Todos will be loaded here -->
                </div>
            </div>

            <!-- Stats -->
            <div class="stats">
                <div class="stat-card">
                    <i class="fas fa-tasks"></i>
                    <span class="stat-count" id="total-tasks">0</span>
                    <span class="stat-label">Total Tasks</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle"></i>
                    <span class="stat-count" id="completed-tasks">0</span>
                    <span class="stat-label">Completed</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <span class="stat-count" id="pending-tasks">0</span>
                    <span class="stat-label">Pending</span>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div id="edit-modal" class="modal hidden">
            <div class="modal-content">
                <h3><i class="fas fa-edit"></i> Edit Task</h3>
                <form id="edit-form">
                    <input type="hidden" id="edit-id">
                    <div class="form-group">
                        <input type="text" id="edit-title" placeholder="Task Title" required>
                    </div>
                    <div class="form-group">
                        <textarea id="edit-description" placeholder="Task Description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-dueDate"><i class="fas fa-calendar"></i> Due Date:</label>
                        <input type="date" id="edit-dueDate">
                    </div>
                    <div class="form-group">
                        <label for="edit-priority"><i class="fas fa-flag"></i> Priority:</label>
                        <select id="edit-priority">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Update Task</button>
                        <button type="button" id="cancel-edit" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
    <script src="js/firebase-config.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/todo.js"></script>
</body>
</html>
```

3. CSS Styling

css/style.css:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Auth Section */
.auth-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.auth-container {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.auth-container h1 {
    color: #667eea;
    margin-bottom: 10px;
    font-size: 2.5rem;
}

.auth-container p {
    color: #666;
    margin-bottom: 30px;
}

/* App Container */
.app-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    overflow: hidden;
}

.hidden {
    display: none !important;
}

/* Header */
.app-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.app-header h1 {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid white;
}

/* Controls Section */
.controls {
    padding: 30px 40px;
    background: #f8f9fa;
}

.add-todo-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    margin-bottom: 30px;
}

.add-todo-card h3 {
    color: #667eea;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

input, textarea, select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 16px;
    transition: border-color 0.3s;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #667eea;
}

textarea {
    min-height: 100px;
    resize: vertical;
}

/* Filter Controls */
.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
}

.search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
}

.search-box input {
    padding-left: 45px;
}

.sort-options, .priority-filter {
    display: flex;
    align-items: center;
    gap: 10px;
}

.sort-options label {
    color: #555;
    font-weight: 500;
}

.priority-filter {
    background: white;
    padding: 10px;
    border-radius: 10px;
}

.filter-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    background: #f0f2f5;
    color: #555;
    cursor: pointer;
    transition: all 0.3s;
}

.filter-btn.active {
    background: #667eea;
    color: white;
}

/* Todo List */
.todo-list-container {
    padding: 30px 40px;
}

.todo-list-container h2 {
    color: #333;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.todo-list {
    display: grid;
    gap: 20px;
}

.todo-item {
    background: white;
    border-left: 5px solid #e1e5e9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    transition: all 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.todo-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.todo-item.high {
    border-left-color: #ff6b6b;
}

.todo-item.medium {
    border-left-color: #ffd93d;
}

.todo-item.low {
    border-left-color: #6bcf7f;
}

.todo-item.completed {
    opacity: 0.7;
    background: #f8f9fa;
}

.todo-item.completed .todo-content h3 {
    text-decoration: line-through;
    color: #888;
}

.todo-content {
    flex: 1;
}

.todo-content h3 {
    color: #333;
    margin-bottom: 5px;
    font-size: 1.2rem;
}

.todo-content p {
    color: #666;
    margin-bottom: 10px;
    font-size: 0.95rem;
}

.todo-meta {
    display: flex;
    gap: 15px;
    font-size: 0.85rem;
    color: #888;
}

.todo-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.todo-actions {
    display: flex;
    gap: 10px;
}

/* Buttons */
.btn {
    padding: 12px 25px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: #667eea;
    color: white;
}

.btn-primary:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #f0f2f5;
    color: #555;
}

.btn-secondary:hover {
    background: #e1e5e9;
}

.btn-small {
    padding: 8px 12px;
    font-size: 14px;
}

.btn-success {
    background: #6bcf7f;
    color: white;
}

.btn-success:hover {
    background: #5bbd6f;
}

.btn-warning {
    background: #ffd93d;
    color: #333;
}

.btn-warning:hover {
    background: #e6c437;
}

.btn-danger {
    background: #ff6b6b;
    color: white;
}

.btn-danger:hover {
    background: #ff5252;
}

/* Stats */
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 30px 40px;
    background: #f8f9fa;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.stat-card i {
    font-size: 2.5rem;
    color: #667eea;
    margin-bottom: 15px;
}

.stat-count {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h3 {
    color: #667eea;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .app-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .controls, .todo-list-container, .stats {
        padding: 20px;
    }

    .filter-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .todo-item {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }

    .todo-actions {
        justify-content: center;
    }

    .stats {
        grid-template-columns: 1fr;
    }
}
```

4. Authentication Module

js/auth.js:

```javascript
// Initialize FirebaseUI
let firebaseUi;
let firebaseUiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true
        }
    ],
    tosUrl: '<your-terms-of-service-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// Initialize FirebaseUI if we're in the right context
if (typeof firebaseui !== 'undefined') {
    firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());
}

// Auth State Observer
firebase.auth().onAuthStateChanged((user) => {
    const authSection = document.getElementById('auth-section');
    const app = document.getElementById('app');
    
    if (user) {
        // User is signed in
        authSection.classList.add('hidden');
        app.classList.remove('hidden');
        
        // Update user info
        document.getElementById('user-name').textContent = user.displayName || user.email;
        const userPhoto = document.getElementById('user-photo');
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.classList.remove('hidden');
        } else {
            userPhoto.classList.add('hidden');
        }
        
        // Load user's todos
        loadTodos(user.uid);
    } else {
        // User is signed out
        authSection.classList.remove('hidden');
        app.classList.add('hidden');
        
        // Start FirebaseUI auth
        if (firebaseUi) {
            firebaseUi.start('#firebaseui-auth-container', firebaseUiConfig);
        }
    }
});

// Sign out
document.getElementById('sign-out')?.addEventListener('click', () => {
    firebase.auth().signOut().catch((error) => {
        console.error('Sign out error:', error);
    });
});
```

5. Todo CRUD Operations

js/todo.js:

```javascript
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
```

6. Deployment Instructions

1. Set up Firebase Project:
   · Go to Firebase Console
   · Create a new project
   · Enable Authentication (Email/Password and Google)
   · Create a Realtime Database
2. Update Firebase Configuration:
   · Go to Project Settings
   · Copy your Firebase config
   · Update firebase-config.js with your actual credentials
3. Database Rules:
   Set these rules in your Realtime Database:
   ```json
   {
     "rules": {
       "todos": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```
4. Deploy:
   · You can host this on Firebase Hosting:
     ```bash
     # Install Firebase CLI
     npm install -g firebase-tools
     
     # Login
     firebase login
     
     # Initialize project
     firebase init
     
     # Deploy
     firebase deploy
     ```
   · Or host on any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

Features Implemented:

1. Complete CRUD Operations:
   · Create: Add new todos with title, description, due date, and priority
   · Read: Load and display todos in real-time
   · Update: Edit existing todos
   · Delete: Remove todos
2. Sorting Options:
   · Date (Newest First)
   · Date (Oldest First)
   · Name (A-Z)
   · Name (Z-A)
   · Priority (High to Low)
3. Search Functionality:
   · Search by title
   · Search by description
4. Additional Features:
   · Priority filtering (High/Medium/Low/All)
   · Real-time updates
   · User authentication
   · Statistics dashboard
   · Responsive design
   · Priority-based color coding

The application provides a complete, production-ready todo list with Firebase integration, real-time updates, and a modern user interface.