// Simple test script to verify API functionality
import fetch from 'node-fetch';

async function testAPI() {
  const baseURL = 'http://localhost:5000/api/todos';
  
  try {
    // Test GET all todos
    console.log('Testing GET /api/todos...');
    let response = await fetch(baseURL);
    let todos = await response.json();
    console.log('All todos:', todos);
    
    // Test POST - Create a new todo
    console.log('\nTesting POST /api/todos...');
    response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Test todo item' }),
    });
    let newTodo = await response.json();
    console.log('Created todo:', newTodo);
    
    // Test PUT - Update the todo
    console.log('\nTesting PUT /api/todos/:id...');
    const todoId = newTodo._id;
    response = await fetch(`${baseURL}/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    });
    let updatedTodo = await response.json();
    console.log('Updated todo:', updatedTodo);
    
    // Test SEARCH
    console.log('\nTesting GET /api/todos/search/:query...');
    response = await fetch(`${baseURL}/search/Test`);
    let searchResults = await response.json();
    console.log('Search results:', searchResults);
    
    // Test DELETE - Remove the todo
    console.log('\nTesting DELETE /api/todos/:id...');
    response = await fetch(`${baseURL}/${todoId}`, {
      method: 'DELETE',
    });
    let deleteResult = await response.json();
    console.log('Delete result:', deleteResult);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();