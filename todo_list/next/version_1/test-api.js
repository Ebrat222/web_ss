const { getAllTodos, createTodo, getTodoById, updateTodo, deleteTodo } = require('./models/Todo');

async function testAPI() {
  try {
    console.log('Testing Todo API...');
    
    // Test create
    console.log('Creating a new todo...');
    const newTodoId = await createTodo({
      title: 'Test Todo from Script',
      description: 'This is a test todo created from a script'
    });
    console.log('Created todo with ID:', newTodoId);
    
    // Test get all
    console.log('Fetching all todos...');
    const allTodos = await getAllTodos();
    console.log(`Found ${allTodos.length} todos`);
    
    // Test get by ID
    console.log('Fetching todo by ID...');
    const todo = await getTodoById(newTodoId);
    console.log('Found todo:', todo);
    
    // Test update
    console.log('Updating todo...');
    const updated = await updateTodo(newTodoId, {
      title: 'Updated Test Todo from Script',
      description: 'This is an updated test todo created from a script'
    });
    console.log('Update successful:', updated);
    
    // Test delete
    console.log('Deleting todo...');
    const deleted = await deleteTodo(newTodoId);
    console.log('Delete successful:', deleted);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();