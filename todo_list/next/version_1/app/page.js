'use client';

import { useState, useEffect } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch todos
  const fetchTodos = async (searchQuery = '') => {
    try {
      const res = await fetch(`/api/todos?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setTodos(data.todos);
      } else {
        console.error('Failed to fetch todos:', data.error);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/todos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTodos(search);
      } else {
        console.error('Failed to create todo:', data.error);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Update todo
  const updateTodo = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });

      const data = await res.json();
      if (res.ok) {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
        fetchTodos(search);
      } else {
        console.error('Failed to update todo:', data.error);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        fetchTodos(search);
      } else {
        console.error('Failed to delete todo:', data.error);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTodos(search);
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Todo List App</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search todos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                Search
              </button>
              <button 
                className="btn btn-outline-primary" 
                type="button" 
                onClick={() => {
                  setSearch('');
                  fetchTodos();
                }}
              >
                Clear
              </button>
            </div>
          </form>

          {/* Add Todo Form */}
          <form onSubmit={createTodo} className="mb-4 p-3 border rounded">
            <h3>Add New Todo</h3>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Add Todo</button>
          </form>

          {/* Todo List */}
          <div>
            <h3>Todo List ({todos.length} items)</h3>
            {todos.length === 0 ? (
              <p className="text-muted">No todos found. Add a new todo or try a different search.</p>
            ) : (
              <ul className="list-group">
                {todos.map((todo) => (
                  <li key={todo._id} className="list-group-item">
                    {editingId === todo._id ? (
                      <div>
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          ></textarea>
                        </div>
                        <button 
                          className="btn btn-success btn-sm me-2" 
                          onClick={() => updateTodo(todo._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h5>{todo.title}</h5>
                        <p>{todo.description}</p>
                        <small className="text-muted">
                          Created: {new Date(todo.createdAt).toLocaleString()}
                        </small>
                        <div className="mt-2">
                          <button 
                            className="btn btn-warning btn-sm me-2" 
                            onClick={() => startEditing(todo)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => deleteTodo(todo._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
