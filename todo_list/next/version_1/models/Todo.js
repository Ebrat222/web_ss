import { connectToDatabase } from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export async function getAllTodos(searchQuery = '') {
  const { db } = await connectToDatabase();
  
  let query = {};
  if (searchQuery) {
    query = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    };
  }
  
  const todos = await db.collection('todos').find(query).sort({ createdAt: -1 }).toArray();
  return todos;
}

export async function getTodoById(id) {
  const { db } = await connectToDatabase();
  const todo = await db.collection('todos').findOne({ _id: new ObjectId(id) });
  return todo;
}

export async function createTodo(todoData) {
  const { db } = await connectToDatabase();
  
  const newTodo = {
    ...todoData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('todos').insertOne(newTodo);
  return result.insertedId;
}

export async function updateTodo(id, todoData) {
  const { db } = await connectToDatabase();
  
  const updatedTodo = {
    ...todoData,
    updatedAt: new Date()
  };
  
  const result = await db.collection('todos').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedTodo }
  );
  
  return result.modifiedCount > 0;
}

export async function deleteTodo(id) {
  const { db } = await connectToDatabase();
  const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}