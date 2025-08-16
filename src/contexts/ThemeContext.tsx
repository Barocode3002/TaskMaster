import React, { useState, useEffect } from 'react';
import { ThemeContext, type Theme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Always use system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    // This function is kept for compatibility but does nothing
    console.log('Theme toggle disabled - using system preference');
  };

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement;
    console.log('Applying theme to document:', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('Added dark class to document');
    } else {
      root.classList.remove('dark');
      console.log('Removed dark class from document');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
