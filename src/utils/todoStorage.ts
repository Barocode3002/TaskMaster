import { type Todo, STORAGE_KEYS } from './types';

/**
 * Utility functions for managing todos in localStorage
 */

// Save todos to localStorage with error handling and backup
export const saveTodos = (todos: Todo[]): boolean => {
    try {
        const todosData = {
            todos,
            lastSaved: new Date().toISOString(),
            version: '1.0'
        };

        localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todosData));
        localStorage.setItem(STORAGE_KEYS.LAST_SAVE, todosData.lastSaved);

        // Optional: Create a backup in case of corruption
        localStorage.setItem(`${STORAGE_KEYS.TODOS}_backup`, JSON.stringify(todosData));

        console.log(`✅ Todos saved successfully at ${todosData.lastSaved}`);
        return true;
    } catch (error) {
        console.error('❌ Error saving todos to localStorage:', error);
        return false;
    }
};

// Load todos from localStorage with fallback to backup
export const loadTodos = (): Todo[] => {
    try {
        // Try to load main todos
        const savedData = localStorage.getItem(STORAGE_KEYS.TODOS);

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Handle different data formats (backward compatibility)
            if (Array.isArray(parsedData)) {
                // Old format: direct array
                console.log('📦 Loading todos (old format)');
                return parsedData;
            } else if (parsedData.todos && Array.isArray(parsedData.todos)) {
                // New format: object with metadata
                console.log(`📦 Loading todos (saved: ${parsedData.lastSaved})`);
                return parsedData.todos;
            }
        }

        // Try backup if main data fails
        const backupData = localStorage.getItem(`${STORAGE_KEYS.TODOS}_backup`);
        if (backupData) {
            const parsedBackup = JSON.parse(backupData);
            console.log('🔄 Loading todos from backup');

            if (Array.isArray(parsedBackup)) {
                return parsedBackup;
            } else if (parsedBackup.todos) {
                return parsedBackup.todos;
            }
        }

    } catch (error) {
        console.error('❌ Error loading todos from localStorage:', error);
    }

    console.log('🆕 No todos found, starting fresh');
    return [];
};

// Save user name
export const saveUserName = (name: string): boolean => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
        console.log(`✅ User name saved: ${name}`);
        return true;
    } catch (error) {
        console.error('❌ Error saving user name:', error);
        return false;
    }
};

// Load user name
export const loadUserName = (): string | null => {
    try {
        const name = localStorage.getItem(STORAGE_KEYS.USER_NAME);
        if (name) {
            console.log(`📦 User name loaded: ${name}`);
        }
        return name;
    } catch (error) {
        console.error('❌ Error loading user name:', error);
        return null;
    }
};

// Clear all app data
export const clearAllData = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER_NAME);
        localStorage.removeItem(STORAGE_KEYS.TODOS);
        localStorage.removeItem(STORAGE_KEYS.LAST_SAVE);
        localStorage.removeItem(`${STORAGE_KEYS.TODOS}_backup`);
        console.log('🧹 All app data cleared');
    } catch (error) {
        console.error('❌ Error clearing app data:', error);
    }
};

// Get storage statistics
export const getStorageStats = () => {
    try {
        const userName = loadUserName();
        const todos = loadTodos();
        const lastSave = localStorage.getItem(STORAGE_KEYS.LAST_SAVE);

        return {
            hasUser: !!userName,
            userName,
            todosCount: todos.length,
            completedCount: todos.filter(t => t.completed).length,
            lastSave: lastSave ? new Date(lastSave) : null
        };
    } catch (error) {
        console.error('❌ Error getting storage stats:', error);
        return null;
    }
};