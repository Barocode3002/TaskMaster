import { useState, useEffect } from "react";
import {
  getRecentlyDeletedTodos,
  clearRecentlyDeletedTodos,
  restoreDeletedTodo,
  permanentlyDeleteTodo, // fix: correct function name
  getDeletedTodosCount,
  type DeletedTodo
} from "../utils/recentlyDeletedStorage";
import { type Todo } from "../utils/types";
import { RotateCcw, Trash2, Clock, X } from 'lucide-react';

interface NavBarUIProps {
  onRestoreTodo?: (todo: Todo) => void;
}

function NavBarUI({ onRestoreTodo }: NavBarUIProps = {}) {
  const [showDeletedLog, setShowDeletedLog] = useState(false);
  const [deletedTodos, setDeletedTodos] = useState<DeletedTodo[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);

  // Load deleted todos and count
  const loadDeletedTodos = () => {
    const todos = getRecentlyDeletedTodos();
    setDeletedTodos(todos);
    setDeletedCount(todos.length);
  };

  // Open deleted log modal
  const openDeletedLog = () => {
    loadDeletedTodos();
    setShowDeletedLog(true);
  };

  // Clear all deleted todos
  const handleClearLog = () => {
    if (window.confirm('Clear all recently deleted todos? This action cannot be undone.')) {
      if (clearRecentlyDeletedTodos()) {
        loadDeletedTodos();
      }
    }
  };

  // Restore a specific todo
  const handleRestore = (deletedTodo: DeletedTodo) => {
    const result = restoreDeletedTodo(deletedTodo);
    if (result.success && result.todo) {
      loadDeletedTodos(); // Refresh the list
      if (onRestoreTodo) {
        onRestoreTodo(result.todo);
      }
    }
  };

  // Permanently delete a specific todo
  const handlePermanentDelete = (todoId: number) => {
    if (window.confirm('Permanently delete this todo? This action cannot be undone.')) {
      if (permanentlyDeleteTodo(todoId)) { // fix: correct function name
        loadDeletedTodos();
      }
    }
  };

  // Format deletion time
  const formatDeletionTime = (deletedAt: string): string => {
    try {
      const deleted = new Date(deletedAt);
      const now = new Date();
      const diffInHours = (now.getTime() - deleted.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return minutes <= 0 ? 'Just now' : `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
      }
    } catch {
      return 'Unknown time';
    }
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (deletedAt: string): number => {
    try {
      const deleted = new Date(deletedAt);
      const now = new Date();
      const daysSinceDeleted = (now.getTime() - deleted.getTime()) / (1000 * 60 * 60 * 24);
      return Math.max(0, 7 - Math.floor(daysSinceDeleted));
    } catch {
      return 0;
    }
  };

  // Periodically clean up and update count
  useEffect(() => {
    // Initial load
    setDeletedCount(getDeletedTodosCount());

    // Set up periodic cleanup every hour
    const interval = setInterval(() => {
      const newCount = getDeletedTodosCount();
      setDeletedCount(newCount);
      
      // If modal is open, refresh the list
      if (showDeletedLog) {
        loadDeletedTodos();
      }
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [showDeletedLog]);

  return (
    <nav className="bg-red-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold tracking-wide">
        TaskMaster
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={openDeletedLog}
          className="bg-white text-red-700 px-4 py-2 rounded hover:bg-red-100 font-medium relative"
        >
          Recently Deleted
          {deletedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {deletedCount > 99 ? '99+' : deletedCount}
            </span>
          )}
        </button>
      </div>
      
      {showDeletedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
              <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Recently Deleted Todos ({deletedTodos.length})
              </h2>
              <button
                onClick={() => setShowDeletedLog(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {deletedTodos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🗑️</div>
                  <p className="text-gray-500 text-lg">No recently deleted todos</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Deleted todos are automatically removed after 7 days
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Info banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Todos are automatically removed after 7 days
                  </div>

                  {/* Deleted todos list */}
                  {deletedTodos.map((todo) => {
                    const daysLeft = getDaysUntilExpiry(todo.deletedAt);
                    
                    return (
                      <div
                        key={todo.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Todo text */}
                            <p className="font-medium text-gray-700 line-through mb-2">
                              {todo.text}
                            </p>
                            
                            {/* Metadata */}
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center gap-4 flex-wrap">
                                <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                                <span className="font-medium">
                                  Deleted: {formatDeletionTime(todo.deletedAt)}
                                </span>
                              </div>
                              
                              <div className="text-xs">
                                {daysLeft > 0 ? (
                                  <span className="text-orange-600 font-medium">
                                    Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium">
                                    Expires today
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleRestore(todo)}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors flex items-center gap-1"
                              title="Restore todo"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restore
                            </button>
                            
                            <button
                              onClick={() => handlePermanentDelete(todo.id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors flex items-center gap-1"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {deletedTodos.length > 0 && (
                  <span>
                    {deletedTodos.length} todo{deletedTodos.length === 1 ? '' : 's'} in recently deleted
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                {deletedTodos.length > 0 && (
                  <button
                    onClick={handleClearLog}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowDeletedLog(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBarUI;