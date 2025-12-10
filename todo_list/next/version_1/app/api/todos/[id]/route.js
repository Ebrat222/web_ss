import { getTodoById, updateTodo, deleteTodo } from '@/models/Todo.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const todo = await getTodoById(id);
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ todo }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await updateTodo(id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Todo not found or not updated' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Todo updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const deleted = await deleteTodo(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Todo not found or not deleted' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}