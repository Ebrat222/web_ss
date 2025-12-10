import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (inputValue.trim() === '') return;
    
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      });
      
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Search todos
  const searchTodos = async () => {
    if (searchQuery.trim() === '') {
      fetchTodos(); // If search is empty, show all todos
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/todos/search/${searchQuery}`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error searching todos:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchTodos();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h1>Todo List App</h1>
            </div>
            <div className="card-body">
              {/* Add Todo Form */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a new todo..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Add Todo
                  </button>
                </div>
              </form>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search todos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-secondary" type="submit">
                    Search
                  </button>
                </div>
              </form>

              {/* Todo List */}
              <ul className="list-group">
                {todos.map((todo) => (
                  <li 
                    key={todo._id} 
                    className={`list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'list-group-item-success' : ''}`}
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id, todo.completed)}
                        className="me-2"
                      />
                      <span className={todo.completed ? 'text-decoration-line-through' : ''}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTodo(todo._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              
              {todos.length === 0 && (
                <div className="text-center mt-3">
                  <p>No todos found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
