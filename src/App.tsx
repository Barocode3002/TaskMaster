import { useState, useEffect, useRef } from 'react';
import type { AppScreen, Todo } from './utils/types';
import { loadUserName, clearAllData, getStorageStats } from './utils/todoStorage';
import NameInputScreen from './components/NameInputUI';
import TodoUI from './components/TodoUI';
import NavBarUI from './components/NavBarUI';
import Footer from './components/Footer';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('name');
  const [userName, setUserName] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const restoreTodoRef = useRef<((todo: Todo) => void) | null>(null);

  // Initialize app and check for existing user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get storage statistics for debugging
        const stats = getStorageStats();
        console.log('📊 Storage Stats:', stats);

        // Check if user already exists
        const savedName = loadUserName();
        
        if (savedName) {
          console.log('👤 Returning user detected:', savedName);
          setUserName(savedName);
          setCurrentScreen('todos');
        } else {
          console.log('🆕 New user detected');
          setCurrentScreen('name');
        }
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        // Fallback to name screen on error
        setCurrentScreen('name');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Handle when user saves their name
  const handleNameSaved = (name: string) => {
    console.log('✅ Name saved in App:', name);
    setUserName(name);
  };

  // Handle navigation to todos screen
  const handleNavigateToTodos = () => {
    console.log('🚀 Navigating to todos screen');
    setCurrentScreen('todos');
  };

  // Handle app reset (clear all data)
  const handleResetApp = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset the app? This will delete all your data including your name and todos.'
    );
    
    if (confirmReset) {
      console.log('🧹 Resetting app...');
      clearAllData();
      setUserName('');
      setCurrentScreen('name');
    }
  };

  // Handle todo restoration from NavBarUI
  const handleRestoreTodo = (todo: Todo) => {
    if (restoreTodoRef.current) {
      restoreTodoRef.current(todo);
    }
  };

  // Receive the restore function from TodoUI
  const handleSetRestoreFunction = (restoreFunction: (todo: Todo) => void) => {
    restoreTodoRef.current = restoreFunction;
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Todo App</h2>
          <p className="text-gray-600">Checking your saved data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBarUI onRestoreTodo={handleRestoreTodo} />
      {currentScreen === 'name' && (
        <NameInputScreen
          onNameSaved={handleNameSaved}
          onNavigateToTodos={handleNavigateToTodos}
        />
      )}
      
      {currentScreen === 'todos' && (
        <TodoUI
          userName={userName}
          onResetApp={handleResetApp}
          onRestoreTodo={handleSetRestoreFunction}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;