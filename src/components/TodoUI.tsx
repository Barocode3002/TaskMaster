import { useState, useEffect, useCallback, useRef } from 'react'; // React hooks for state, lifecycle, memoized callbacks, and DOM refs
import { Plus, RotateCcw } from 'lucide-react'; // Icons from lucide-react

import { type TodoScreenProps, type Todo } from '../utils/types'; // Types for props and todo object
import { saveTodos, loadTodos } from '../utils/todoStorage'; // Local storage save/load functions
import { addRecentlyDeletedTodo } from '../utils/recentlyDeletedStorage'; // Local storage for recently deleted todos
import SwipeableTodoItem from './SwipeableTodoItem'; // Mobile-responsive todo item with swipe gestures
import * as styles from './styles/todoUIStyle';

// Note: Styles are now handled directly in JSX for better mobile responsiveness

function TodoUI({ userName, onResetApp, onRestoreTodo }: TodoScreenProps) { // Main TodoUI component
  const [todos, setTodos] = useState<Todo[]>([]); // State for todo list
  const [newTodo, setNewTodo] = useState(''); // State for input when adding new todo
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all'); // State for current filter
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [editingId, setEditingId] = useState<number | null>(null); // State for the todo currently being edited
  const [editText, setEditText] = useState(''); // State for edit input text
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set()); // State for todos that are animating toggle
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set()); // State for todos that are being deleted
  const editRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks during editing

  useEffect(() => { // Load todos on first render
    setIsLoading(true); // Show loading
    try {
      setTodos(loadTodos()); // Load todos from storage
    } catch (error) {
      console.error('Error loading todos:', error); // Log if failed
    } finally {
      setIsLoading(false); // Hide loading
    }
  }, []);

  const autoSave = useCallback((updatedTodos: Todo[]) => { // Save todos to storage automatically
    if (!saveTodos(updatedTodos)) {
      console.error('Failed to save todos automatically'); // Log if save failed
    }
  }, []);

  const updateTodos = useCallback( // Update todos state and save
    (updatedTodos: Todo[]) => {
      setTodos(updatedTodos); // Set state
      autoSave(updatedTodos); // Save to storage
    },
    [autoSave]
  );

  const addTodo = (e?: React.FormEvent) => { // Add a new todo
    if (e) e.preventDefault(); // Prevent form submission reload
    if (!newTodo.trim()) return; // Prevent adding empty
    const todo: Todo = { // Create todo object
      id: Date.now(), // Unique ID
      text: newTodo.trim(), // Text from input
      completed: false, // Default incomplete
      createdAt: new Date().toISOString(), // Creation timestamp
    };
    updateTodos([...todos, todo]); // Append to list
    setNewTodo(''); // Clear input
  };

  const toggleTodo = (id: number) => { // Toggle completed state
    setAnimatingIds((prev) => new Set(prev).add(id)); // Trigger animation
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed, // Flip completed
            completedAt: !todo.completed ? new Date().toISOString() : undefined, // Set/remove completion date
          }
        : todo
    );
    updateTodos(updatedTodos); // Save updated list
    setTimeout( // Remove animation after duration
      () => setAnimatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      }),
      300 // Reduced animation time
    );
  };

  const deleteTodo = (id: number) => { // Delete a todo with improved error handling
    const todoToDelete = todos.find((t) => t.id === id); // Find the todo
    if (todoToDelete) {
      // Add to recently deleted with better error handling
      if (!addRecentlyDeletedTodo(todoToDelete)) {
        console.error('Failed to save todo to recently deleted');
        // Still proceed with deletion even if recently deleted fails
      }
    }
    
    setDeletingIds((prev) => new Set(prev).add(id)); // Trigger fade animation
    setTimeout(() => {
      updateTodos(todos.filter((t) => t.id !== id)); // Remove from list
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300); // Matches fade animation time
  };

  const startEditing = (id: number, text: string) => { // Begin editing mode
    setEditingId(id); // Set ID of editing todo
    setEditText(text); // Pre-fill text field
  };

  const saveEdit = () => { // Save edited todo text
    if (!editText.trim()) return cancelEdit(); // Cancel if empty
    updateTodos(
      todos.map((t) =>
        t.id === editingId ? { ...t, text: editText.trim() } : t // Update matching todo
      )
    );
    cancelEdit(); // Exit edit mode
  };

  const cancelEdit = useCallback(() => { // Cancel editing
    setEditingId(null); // Clear edit ID
    setEditText(''); // Clear text
  }, []);

  useEffect(() => { // Click-outside-to-cancel logic
    if (editingId !== null) {
      const handleClickAnyWhere = (e: MouseEvent) => {
        if (editRef.current && !editRef.current.contains(e.target as Node)) {
          cancelEdit(); // Cancel if clicked outside
        }
      };
      document.addEventListener('mousedown', handleClickAnyWhere); // Listen for clicks
      return () => document.removeEventListener('mousedown', handleClickAnyWhere); // Clean up
    }
  }, [editingId, cancelEdit]);

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { // Handle keyboard in edit mode
    if (e.key === 'Enter') saveEdit(); // Save on Enter
    if (e.key === 'Escape') cancelEdit(); // Cancel on Escape
  };

  const restoreTodo = useCallback((todo: Todo) => { // Restore a todo to the main list
    // Check if todo already exists to avoid duplicates
    const exists = todos.some(t => t.id === todo.id);
    if (!exists) {
      updateTodos([...todos, todo]);
    }
  }, [todos, updateTodos]);

  // Expose restoreTodo function to parent component
  useEffect(() => {
    if (onRestoreTodo) {
      onRestoreTodo(restoreTodo);
    }
  }, [onRestoreTodo, restoreTodo]);

  const clearCompleted = () => { // Remove all completed todos with recently deleted support
    const completedTodos = todos.filter((t) => t.completed);
    
    // Add all completed todos to recently deleted
    completedTodos.forEach(todo => {
      addRecentlyDeletedTodo(todo);
    });
    
    // Remove from main list
    updateTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => { // Apply filter
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length; // Count completed todos

  const formatDate = (dateString: string) => { // Format date string
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date'; // Fallback
    }
  };

  if (isLoading) { // Loading screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 px-2 sm:px-4 py-4 sm:py-8 flex items-center justify-center">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading your todos...</p>
        </div>
      </div>
    );
  }

  const renderEmptyState = () => // UI for when no todos
    todos.length === 0 ? (
      <>
        <div className="text-6xl mb-4 animate-bounce">📝</div>
        <p>No todos yet! 📭</p>
      </>
    ) : (
      <>
        <div className="text-6xl mb-4 animate-pulse">
          {filter === 'active' ? '✅' : '🔍'}
        </div>
        <p>No {filter} tasks found.</p>
      </>
    );

  const renderTodoItem = (todo: Todo) => { // Render a single todo
    return (
      <SwipeableTodoItem
        key={todo.id}
        todo={todo}
        isEditing={editingId === todo.id}
        editText={editText}
        isAnimating={animatingIds.has(todo.id)}
        isDeleting={deletingIds.has(todo.id)}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onStartEdit={startEditing}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
        onEditTextChange={setEditText}
        onEditKeyDown={handleEditKeyDown}
        editRef={editRef}
        formatDate={formatDate}
      />
    );
  };

  const renderFilterTabs = () => // Tabs for filter switching
    todos.length > 0 && (
      <div className="px-3 sm:px-6 py-3 border-b border-gray-200 bg-white dark:bg-red-950 dark:border-red-700">
        <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-red-900">
          {(['all', 'active', 'completed'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`
                flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors
                ${filter === option 
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-red-700 dark:text-white' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-red-200 dark:hover:text-white'
                }
              `}
            >
              <span className="capitalize">{option}</span>
            </button>
          ))}
        </div>
      </div>
    );

  return ( // Render main UI
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.todoContainer}>
          {/* Header */}
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <h1 className={styles.welcomeTitle}>
                Welcome back, {userName}!
              </h1>
              <button
                onClick={onResetApp}
                className={styles.resetButton}
              >
                <RotateCcw className={styles.resetIcon} />
                <span className={styles.resetTextLarge}>Reset App</span>
                <span className={styles.resetTextSmall}>Reset</span>
              </button>
            </div>

            {/* Add Todo Form */}
            <form onSubmit={(e) => addTodo(e)} className={styles.addTodoForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className={styles.todoInput}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!newTodo.trim() || isLoading}
                  className={styles.addButton}
                >
                  <Plus className={styles.addButtonIcon} />
                  <span className={styles.addButtonTextLarge}>Add Task</span>
                  <span className={styles.addButtonTextSmall}>Add</span>
                </button>
              </div>
            </form>
          </div>

          {/* Filter Tabs */}
          {renderFilterTabs()}

          {/* Todo List */}
          <div className={styles.todoListContainer}>
            {filteredTodos.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                {renderEmptyState()}
              </div>
            ) : (
              filteredTodos.map((todo) => renderTodoItem(todo))
            )}
          </div>

          {/* Footer Actions */}
          {completedCount > 0 && (
            <div className={styles.footerContainer}>
              <button 
                onClick={clearCompleted} 
                className={styles.clearCompletedButton}
              >
                Clear Completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoUI;