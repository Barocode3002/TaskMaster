import { useState } from 'react';
import { Trash2, Edit3, Check, X, CheckCircle, Circle } from 'lucide-react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { type Todo } from '../utils/types';
import * as styles from './styles/swipeableTodoStyle';

interface SwipeableTodoItemProps {
  todo: Todo;
  isEditing: boolean;
  editText: string;
  isAnimating: boolean;
  isDeleting: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (id: number, text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  editRef: React.RefObject<HTMLDivElement | null>;
  formatDate: (dateString: string) => string;
}

const SwipeableTodoItem = ({
  todo,
  isEditing,
  editText,
  isAnimating,
  isDeleting,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onEditKeyDown,
  editRef,
  formatDate,
}: SwipeableTodoItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const { elementRef } = useSwipeGesture({
    onSwipeLeft: () => setShowActions(true),
    onSwipeRight: () => setShowActions(false),
    threshold: 50,
  });

  // Animation classes
  const getAnimationClass = () => {
    if (isAnimating) {
      return 'animate-subtle-scale';
    }
    return '';
  };

  const getFadeClass = () => {
    return isDeleting ? 'animate-fade-out opacity-0' : '';
  };

  // Mobile-first responsive classes
  const containerClasses = `
    ${styles.todoContainer}
    ${todo.completed ? styles.todoCompleted : styles.todoActive}
    ${getAnimationClass()}
    ${getFadeClass()}
    ${showActions ? styles.todoSwiped : ''}
  `;

  const contentClasses = `
    ${styles.todoContent}
    ${showActions ? styles.todoContentSwiped : ''}
  `;

  const textClasses = `
    ${styles.todoText}
    ${todo.completed ? styles.todoTextCompleted : styles.todoTextActive}
    ${isEditing ? 'hidden' : ''}
  `;

  const metaClasses = `
    text-xs sm:text-sm text-gray-400 mt-1
    ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}
  `;

  const toggleButtonClasses = `
    flex-shrink-0 p-1 rounded-full transition-colors duration-200
    ${todo.completed 
      ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300' 
      : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
    }
  `;

  const actionButtonClasses = `
    ${styles.actionButtons}
    ${showActions ? styles.actionButtonsVisible : styles.actionButtonsHidden}
  `;

  const editInputClasses = styles.editInput;

  const editButtonClasses = `
    p-2 rounded-md transition-colors duration-200
    flex items-center justify-center
    min-w-[36px] min-h-[36px]
  `;

  return (
    <div className={containerClasses}>
      <div
        ref={elementRef}
        className={contentClasses}
        onClick={() => !isEditing && !showActions && setShowActions(false)}
      >
        {/* Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(todo.id);
            setShowActions(false);
          }}
          className={toggleButtonClasses}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? (
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        {/* Content Area */}
        {isEditing ? (
          <div ref={editRef} className="flex-1 flex items-center gap-2">
            <input
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={onEditKeyDown}
              className={editInputClasses}
              autoFocus
              aria-label="Edit todo text"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveEdit();
              }}
              className={`${editButtonClasses} bg-green-100 text-green-600 hover:bg-green-200`}
              aria-label="Save changes"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit();
              }}
              className={`${editButtonClasses} bg-red-100 text-red-600 hover:bg-red-200`}
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={textClasses} onClick={() => onToggle(todo.id)}>
            <p className="text-sm sm:text-base font-medium leading-tight">
              {todo.text}
            </p>
            <p className={metaClasses}>
              {formatDate(todo.createdAt)}
            </p>
          </div>
        )}

        {/* Desktop Edit Button */}
        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit(todo.id, todo.text);
            }}
            className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200 dark:text-gray-500 dark:hover:text-gray-400"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
          className="hidden sm:flex p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors duration-200 dark:text-gray-500 dark:hover:text-red-400"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Swipe Actions */}
      <div className={`${actionButtonClasses} sm:hidden`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit(todo.id, todo.text);
            setShowActions(false);
          }}
          className="p-2 text-white hover:bg-black hover:bg-opacity-20 rounded transition-colors"
          aria-label="Edit todo"
        >
          <Edit3 className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
            setShowActions(false);
          }}
          className="p-2 text-white hover:bg-black hover:bg-opacity-20 rounded transition-colors"
          aria-label="Delete todo"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default SwipeableTodoItem;
