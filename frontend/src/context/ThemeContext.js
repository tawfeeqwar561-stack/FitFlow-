import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage first (user's explicit choice)
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // ✅ ADDED: 2. Fall back to OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Apply theme to <html> element and save to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // ✅ ADDED: Also set color-scheme for native browser elements
    //           (scrollbars, inputs, selects match the theme)
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // ✅ ADDED: Listen for OS theme changes
  //           Only applies if user hasn't set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      const hasUserPreference = localStorage.getItem('theme');
      if (!hasUserPreference) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ✅ ADDED: Reset to OS preference
  const resetTheme = () => {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      resetTheme,                      // ✅ exposed for settings page
      isDark: theme === 'dark',         // ✅ convenience boolean
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};