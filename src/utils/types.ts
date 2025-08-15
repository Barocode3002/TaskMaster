// Todo related types
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string;
    // No deletedAt here!
}

// App screen types
export type AppScreen = 'name' | 'todos';

// Component prop types
export interface TodoScreenProps {
    userName: string;
    onResetApp: () => void;
    onRestoreTodo?: (restoreFunction: (todo: Todo) => void) => void;
}

export interface NameInputScreenProps {
    onNameSaved?: (name: string) => void;
    onNavigateToTodos?: () => void;
}

// localStorage keys
export const STORAGE_KEYS = {
    USER_NAME: 'userName',
    TODOS: 'todos',
    LAST_SAVE: 'lastSave'
} as const;