import React, { useState, useEffect } from 'react';
import { CheckCircle2, User, Check } from 'lucide-react';
import * as styles from './styles/nameInputStyle';

interface NameInputScreenProps {
  onNameSaved?: (name: string) => void;
  onNavigateToTodos?: () => void;
}

function NameInputScreen({ onNameSaved, onNavigateToTodos }: NameInputScreenProps) {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // Load saved name on component mount and check if user should be redirected
  useEffect(() => {
    const saved = localStorage.getItem('userName');
    if (saved) {
      setSavedName(saved);
      setName(saved);
      setIsReturningUser(true);
      
      // Auto-navigate to todos for returning users
      setTimeout(() => {
        if (onNavigateToTodos) {
          onNavigateToTodos();
        }
      }, 1500); // Small delay to show welcome back message
    }
  }, [onNavigateToTodos]);

  const handleSaveName = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate a brief loading state
    setTimeout(() => {
      try {
        localStorage.setItem('userName', name.trim());
        setSavedName(name.trim());
        setShowSuccess(true);
        
        // Call the callback if provided
        if (onNameSaved) {
          onNameSaved(name.trim());
        }

        // Navigate to todos after successful save
        setTimeout(() => {
          if (onNavigateToTodos) {
            onNavigateToTodos();
          }
        }, 2000); // Wait 2 seconds to show success message
      } catch (error) {
        console.error('Error saving name to localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleClearName = () => {
    localStorage.removeItem('userName');
    setSavedName('');
    setName('');
    setShowSuccess(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
  };

  // Show different content for returning users
  if (isReturningUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900">
        <div className={styles.cardContainer}>
          <div className={styles.inputIconContainer}>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Welcome back, {savedName}!</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-400">Taking you to your todos...</p>
          <div className={styles.inputContainer}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md dark:bg-gray-800">
        <div className={styles.headerSection}>
          <div className={styles.iconContainer}>
            <User className={styles.headerIcon} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Welcome to TaskMaster</h1>
          <p className="text-gray-600 dark:text-gray-400">Let's start by getting to know you</p>
        </div>

        <div className={styles.formSection}>
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              What's your name?
            </label>
            <input
              id="userName"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name..."
              className={styles.nameInput}
              disabled={isLoading}
            />
          </div>

          {savedName && !showSuccess && !isReturningUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-gray-700 dark:border-gray-600">
              <p className={styles.welcomeSubtitle}>
                <strong>Current saved name:</strong> {savedName}
              </p>
            </div>
          )}

          {showSuccess && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center">
              <Check className={styles.saveButtonIcon} />
              <p className="text-green-800 font-medium">Name saved! Redirecting to todos...</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSaveName}
              disabled={!name.trim() || isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save Name'}
            </button>
            
            {savedName && !isReturningUser && (
              <button
                onClick={handleClearName}
                disabled={isLoading}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center dark:text-gray-400">
            Your name will be stored locally on your device
          </p>
        </div>
      </div>
    </div>
  );
}

export default NameInputScreen;