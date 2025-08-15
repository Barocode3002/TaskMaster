import type { Todo } from './types';

const RECENTLY_DELETED_KEY = 'recentlyDeletedTodos';
const DELETION_EXPIRY_DAYS = 7;
const MAX_DELETED_TODOS = 50;

// Extended type to include deletion date
export interface DeletedTodo extends Todo {
  deletedAt: string; // ISO date string when the todo was deleted
}

// Remove todos older than 7 days
function filterRecentTodos(todos: DeletedTodo[]): DeletedTodo[] {
  const now = Date.now();
  const expiryTime = DELETION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Array.isArray(todos)
    ? todos.filter(todo => {
        if (!todo.deletedAt) return false;
        const deletedTime = Date.parse(todo.deletedAt);
        return !isNaN(deletedTime) && (now - deletedTime < expiryTime);
      })
    : [];
}

// Get all recently deleted todos (automatically cleans expired ones)
export function getRecentlyDeletedTodos(): DeletedTodo[] {
  try {
    const data = localStorage.getItem(RECENTLY_DELETED_KEY);
    if (!data) return [];
    const todos = JSON.parse(data);
    if (!Array.isArray(todos)) return [];
    const filtered = filterRecentTodos(todos);
    if (filtered.length !== todos.length) {
      localStorage.setItem(RECENTLY_DELETED_KEY, JSON.stringify(filtered));
    }
    return filtered.sort((a, b) =>
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    );
  } catch (error) {
    console.error('Error loading recently deleted todos:', error);
    localStorage.removeItem(RECENTLY_DELETED_KEY);
    return [];
  }
}

// Add a todo to the recently deleted log, with deletedAt timestamp
export function addRecentlyDeletedTodo(todo: Todo): boolean {
  try {
    const deleted = getRecentlyDeletedTodos();
    if (deleted.some(d => d.id === todo.id)) {
      return true;
    }
    const todoWithDeletedAt: DeletedTodo = {
      ...todo,
      deletedAt: new Date().toISOString()
    };
    deleted.unshift(todoWithDeletedAt);
    const trimmed = deleted.slice(0, MAX_DELETED_TODOS);
    localStorage.setItem(RECENTLY_DELETED_KEY, JSON.stringify(trimmed));
    return true;
  } catch (error) {
    console.error('Error adding recently deleted todo:', error);
    return false;
  }
}

// Clear the recently deleted log
export function clearRecentlyDeletedTodos(): boolean {
  try {
    localStorage.removeItem(RECENTLY_DELETED_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing recently deleted todos:', error);
    return false;
  }
}

// Restore a todo (remove from deleted list)
export function restoreDeletedTodo(deletedTodo: DeletedTodo): { success: boolean; todo?: Todo } {
  try {
    const deleted = getRecentlyDeletedTodos();
    const updatedDeleted = deleted.filter(todo => todo.id !== deletedTodo.id);
    localStorage.setItem(RECENTLY_DELETED_KEY, JSON.stringify(updatedDeleted));
    // Explicitly construct the Todo object without deletedAt
    const originalTodo: Todo = {
      id: deletedTodo.id,
      text: deletedTodo.text,
      completed: deletedTodo.completed,
      createdAt: deletedTodo.createdAt,
      completedAt: deletedTodo.completedAt
    };
    return { success: true, todo: originalTodo };
  } catch (error) {
    console.error('Error restoring deleted todo:', error);
    return { success: false };
  }
}

// Permanently delete a specific todo from recently deleted
export function permanentlyDeleteTodo(todoId: number): boolean {
  try {
    const deleted = getRecentlyDeletedTodos();
    const updatedDeleted = deleted.filter(todo => todo.id !== todoId);
    localStorage.setItem(RECENTLY_DELETED_KEY, JSON.stringify(updatedDeleted));
    return true;
  } catch (error) {
    console.error('Error permanently deleting todo:', error);
    return false;
  }
}

// Get count of recently deleted todos
export function getDeletedTodosCount(): number {
  return getRecentlyDeletedTodos().length;
}

// Manually clean up expired todos (useful for periodic cleanup)
export function cleanupExpiredDeleted(): number {
  try {
    const before = JSON.parse(localStorage.getItem(RECENTLY_DELETED_KEY) || '[]');
    const after = getRecentlyDeletedTodos();
    return Math.max(0, (Array.isArray(before) ? before.length : 0) - after.length);
  } catch {
    return 0;
  }
}