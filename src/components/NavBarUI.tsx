import { useState, useEffect } from "react";
import {
  getRecentlyDeletedTodos,
  clearRecentlyDeletedTodos,
  restoreDeletedTodo,
  permanentlyDeleteTodo,
  getDeletedTodosCount,
  type DeletedTodo
} from "../utils/recentlyDeletedStorage";
import { type Todo } from "../utils/types";
import { Trash2, Clock, X } from 'lucide-react';
import * as styles from './styles/navBarStyle';

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

  const handleRestoreAll = () => {
    if (window.confirm('Restore all recently deleted todos?')) {
      const todosToRestore = [...deletedTodos]; // Create a copy to avoid mutation during iteration
      let restoredCount = 0;
      
      todosToRestore.forEach(deletedTodo => {
        const result = restoreDeletedTodo(deletedTodo);
        if (result.success && result.todo && onRestoreTodo) {
          onRestoreTodo(result.todo);
          restoredCount++;
        }
      });
      
      loadDeletedTodos(); // Refresh the list
      
      if (restoredCount > 0) {
        alert(`Successfully restored ${restoredCount} todo${restoredCount === 1 ? '' : 's'}`);
      }
    }
  }


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
    <nav className={styles.navBarContainer}>
      <div className={styles.appName}>
        TaskMaster
      </div>
      <div className={styles.navBarButtonContainer}>
        <button
          onClick={openDeletedLog}
          className={styles.deletedButton}
        >
          <span className={styles.deletedButtonTextLarge}>Recently Deleted</span>
          <span className={styles.deletedButtonTextSmall}>Deleted</span>
          {deletedCount > 0 && (
            <span className={styles.deletedCountBadge}>
              {deletedCount > 99 ? '99+' : deletedCount}
            </span>
          )}
        </button>
      </div>
      
      {showDeletedLog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Trash2 className={styles.modalTitleIcon} />
                <span className={styles.modalTitleTextLarge}>Recently Deleted Todos ({deletedTodos.length})</span>
                <span className={styles.modalTitleTextSmall}>Deleted ({deletedTodos.length})</span>
              </h2>
              <button
                onClick={() => setShowDeletedLog(false)}
                className={styles.modalCloseButton}
              >
                <X className={styles.modalCloseIcon} />
              </button>
            </div>

            {/* Content */}
            <div className={styles.modalContent}>
              {deletedTodos.length === 0 ? (
                <div className={styles.emptyStateContainer}>
                  <div className={styles.emptyStateIcon}>🗑️</div>
                  <p className={styles.emptyStateText}>No recently deleted todos</p>
                  <p className={styles.emptyStateSubtext}>
                    Deleted todos are automatically removed after 7 days
                  </p>
                </div>
              ) : (
                <div className={styles.todosList}>
                  {/* Info banner */}
                  <div className={styles.infoBanner}>
                    <Clock className={styles.infoBannerIcon} />
                    <span className={styles.infoBannerText}>Auto-removed after 7 days</span>
                  </div>

                  {/* Deleted todos list */}
                  {deletedTodos.map((todo) => {
                    const daysLeft = getDaysUntilExpiry(todo.deletedAt);
                    
                    return (
                      <div
                        key={todo.id}
                        className={styles.todoItem}
                      >
                        <div className={styles.todoItemContent}>
                          <div className={styles.todoItemText}>
                            {/* Todo text */}
                            <p className={styles.todoText}>
                              {todo.text}
                            </p>
                            
                            {/* Metadata */}
                            <div className={styles.todoMetadata}>
                              <div className={styles.todoMetadataRow}>
                                <span className={styles.todoCreatedText}>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                                <span className={styles.todoDeletedText}>
                                  Deleted: {formatDeletionTime(todo.deletedAt)}
                                </span>
                              </div>
                              
                              <div className={styles.todoExpiryText}>
                                {daysLeft > 0 ? (
                                  <span className={styles.todoExpiryActive}>
                                    Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                                  </span>
                                ) : (
                                  <span className={styles.todoExpiryToday}>
                                    Expires today
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className={styles.actionButtonsContainer}>
                            <div className={styles.restoreButtonContainer}>
                              <button
                                onClick={() => handleRestore(todo)}
                                className={styles.restoreButton}
                              >
                                <span className={styles.restoreButtonTextLarge}>Restore</span>
                                <span className={styles.restoreButtonTextSmall}>↻</span>
                              </button>
                            </div>
                            <button
                              onClick={() => handlePermanentDelete(todo.id)}
                              className={styles.deleteButton}
                              title="Delete permanently"
                            >
                              <Trash2 className={styles.deleteButtonIcon} />
                              <span className={styles.deleteButtonText}>Delete</span>
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
            <div className={styles.modalFooter}>
              <div className={styles.modalFooterText}>
                {deletedTodos.length > 0 && (
                  <span>
                    {deletedTodos.length} todo{deletedTodos.length === 1 ? '' : 's'} in recently deleted
                  </span>
                )}
              </div>
              
              <div className={styles.modalFooterActions}>
                {deletedTodos.length > 0 && (
                  <button
                    onClick={handleRestoreAll}
                    className={styles.restoreAllButton}
                  >
                    Restore All
                  </button>
                )}
                {deletedTodos.length > 0 && (
                  <button
                    onClick={handleClearLog}
                    className={styles.clearAllButton}
                  >
                    <span className={styles.clearAllButtonTextLarge}>Clear All</span>
                    <span className={styles.clearAllButtonTextSmall}>Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDeletedLog(false)}
                  className={styles.closeButton}
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