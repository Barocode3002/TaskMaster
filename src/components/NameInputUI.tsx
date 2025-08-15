import React, { useState, useEffect } from 'react';
import { User, Check, CheckCircle2 } from 'lucide-react';
import {
  screenBgReturning,
  cardReturning,
  avatarReturning,
  spinnerReturning,
  screenBg,
  card,
  avatar,
  heading,
  subheading,
  label,
  input,
  savedNameBox,
  successBox,
  buttonSave,
  buttonClear,
  infoFooter
} from './styles/nameInputStyle';

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
      <div className={screenBgReturning}>
        <div className={cardReturning}>
          <div className={avatarReturning}>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {savedName}!</h1>
          <p className="text-gray-600 mb-6">Taking you to your todos...</p>
          <div className={spinnerReturning}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={screenBg}>
      <div className={card}>
        <div className="text-center mb-8">
          <div className={avatar}>
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h1 className={heading}>Welcome to Todo App</h1>
          <p className={subheading}>Let's start by getting to know you</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="userName" className={label}>
              What's your name?
            </label>
            <input
              id="userName"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name..."
              className={input}
              disabled={isLoading}
            />
          </div>

          {savedName && !showSuccess && !isReturningUser && (
            <div className={savedNameBox}>
              <p className="text-green-800 text-sm">
                <strong>Current saved name:</strong> {savedName}
              </p>
            </div>
          )}

          {showSuccess && (
            <div className={successBox}>
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Name saved! Redirecting to todos...</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSaveName}
              disabled={!name.trim() || isLoading}
              className={buttonSave}
            >
              {isLoading ? 'Saving...' : 'Save Name'}
            </button>
            
            {savedName && !isReturningUser && (
              <button
                onClick={handleClearName}
                disabled={isLoading}
                className={buttonClear}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className={infoFooter}>
            Your name will be stored locally on your device
          </p>
        </div>
      </div>
    </div>
  );
}

export default NameInputScreen;