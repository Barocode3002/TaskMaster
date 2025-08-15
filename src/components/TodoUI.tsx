import { useState, useEffect, useCallback, useRef } from 'react'; // React hooks for state, lifecycle, memoized callbacks, and DOM refs
import { Plus, Trash2, CheckCircle, Circle, Calendar, RotateCcw, Edit2, Check, X } from 'lucide-react'; // Icons from lucide-react

import { type TodoScreenProps, type Todo } from '../utils/types'; // Types for props and todo object
import { saveTodos, loadTodos } from '../utils/todoStorage'; // Local storage save/load functions
import { addRecentlyDeletedTodo } from '../utils/recentlyDeletedStorage'; // Local storage for recently deleted todos

// Importing all styles from todoStyle
import {
  screenBg,
  mainContainer, 
  card, 
  headerRow, 
  headerTitle, 
  headerStats, 
  resetButton,
  addInputRow, 
  addInput, 
  addButton, 
  filterTabsRow, 
  filterTabActive, 
  filterTabInactive,
  filterTabActiveCount, 
  filterTabCompletedCount, 
  todoList, 
  todoItemCompleted,
  todoItemActive, 
  todoToggleCompleted, 
  todoToggleActive, 
  todoTextCompleted,
  todoTextActive, 
  todoMeta, 
  deleteButton, 
  footerActions, 
  footerText, 
  footerClearButton,
  storageInfo, 
  editInput, 
  editButton, 
  swipeDownCompleted, 
  swipeUpActive, 
  fadeOut,
} from './styles/todoStyle';

const someStyles = {
  EditBtn: "p-2 text-gray-400 hover:text-green-600 hover:bg-blue-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100" // Tailwind class for edit button hover style
};

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

  const addTodo = () => { // Add a new todo
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
      800 // Matches CSS animation time
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
  const activeCount = todos.length - completedCount; // Count active todos

  const formatDate = (dateString: string) => { // Format date string
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date'; // Fallback
    }
  };

  if (isLoading) { // Loading screen
    return (
      <div className={screenBg}>
        <div className={`${card} text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" /> {/* Spinner */}
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
    const animationClass = animatingIds.has(todo.id) // Animation for toggle
      ? todo.completed
        ? swipeDownCompleted
        : swipeUpActive
      : '';
    const fadeClass = deletingIds.has(todo.id) ? fadeOut : ''; // Animation for delete

    return (
      <div
        key={todo.id}
        data-todo-id={todo.id}
        className={`${todo.completed ? todoItemCompleted : todoItemActive} ${animationClass} ${fadeClass}`} // Conditional styles
      >
        <button
          onClick={() => toggleTodo(todo.id)}
          className={todo.completed ? todoToggleCompleted : todoToggleActive}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? (
            <CheckCircle className="w-6 h-6" /> // Completed icon
          ) : (
            <Circle className="w-6 h-6" /> // Incomplete icon
          )}
        </button>

        {editingId === todo.id ? ( // If in edit mode
          <div ref={editRef} className="flex-1 flex items-center gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className={`${editInput} flex-1`}
              autoFocus
              aria-label="Edit todo text"
            />
            <button
              onClick={saveEdit}
              className={`${editButton} text-green-600`}
              aria-label="Save changes"
            >
              <Check className="w-4 h-4" /> {/* Save icon */}
            </button>
            <button
              onClick={cancelEdit}
              className={`${editButton} text-red-600`}
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" /> {/* Cancel icon */}
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0 group">
            <p
              onClick={() => startEditing(todo.id, todo.text)}
              className={`${todo.completed ? todoTextCompleted : todoTextActive} cursor-pointer`}
            >
              {todo.text}
            </p>
            <p className={todoMeta}>
              Created: {formatDate(todo.createdAt)}
              {todo.completedAt && <> • Completed: {formatDate(todo.completedAt)}</>}
            </p>
          </div>
        )}

        {editingId !== todo.id && ( // Show edit button if not editing
          <button
            onClick={() => startEditing(todo.id, todo.text)}
            className={someStyles.EditBtn}
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => deleteTodo(todo.id)}
          className={deleteButton}
          aria-label="Delete todo"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderFilterTabs = () => // Tabs for filter switching
    todos.length > 0 && (
      <div className={filterTabsRow}>
        {(['all', 'active', 'completed'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={filter === option ? filterTabActive : filterTabInactive}
          >
            {option[0].toUpperCase() + option.slice(1)} {/* Capitalized label */}
            {option === 'active' && activeCount > 0 && (
              <span className={filterTabActiveCount}>{activeCount}</span>
            )}
            {option === 'completed' && completedCount > 0 && (
              <span className={filterTabCompletedCount}>{completedCount}</span>
            )}
          </button>
        ))}
      </div>
    );

  return ( // Render main UI
    <div className={screenBg}>
      <div className={mainContainer}>
        <div className={`${card} animate-fade-in`}>
          <div className={headerRow}>
            <div>
              <h1 className={headerTitle}>Hello, {userName}! 👋</h1>
              <p className={headerStats}>
                <Calendar className="w-4 h-4" />
                {activeCount} active, {completedCount} completed • {todos.length} total
              </p>
            </div>
            <button onClick={onResetApp} className={resetButton}>
              <RotateCcw className="w-4 h-4" /> Reset App
            </button>
          </div>

          <div className={addInputRow}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className={addInput}
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className={addButton}
            >
              <Plus className="w-5 h-5" /> Add Task
            </button>
          </div>

          {renderFilterTabs()}

          <div className={todoList}>
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-500 animate-fade-in">
                {renderEmptyState()}
              </div>
            ) : (
              filteredTodos.map(renderTodoItem)
            )}
          </div>

          {completedCount > 0 && (
            <div className={footerActions}>
              <p className={footerText}>
                You've completed {completedCount} task
                {completedCount !== 1 ? 's' : ''}! 🎉
              </p>
              <button onClick={clearCompleted} className={footerClearButton}>
                Clear Completed
              </button>
            </div>
          )}
        </div>

        <div className={storageInfo}>
          <p className="text-xs text-gray-400 opacity-75">
            💾 All data is automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}

export default TodoUI;