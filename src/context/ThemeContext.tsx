'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'lab';

interface ThemeContextType {
  theme: ThemeMode;
  isLabMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with the server-safe default; the real saved value is read after mount
  // (the inline script in layout.tsx already applied the right class before paint).
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fim_theme');
      if (saved === 'lab' || saved === 'dark') setThemeState(saved);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === 'lab') {
      root.classList.remove('dark');
      root.classList.add('lab-mode');
    } else {
      root.classList.remove('lab-mode');
      root.classList.add('dark');
    }
    try {
      localStorage.setItem('fim_theme', theme);
    } catch {}
  }, [theme, hydrated]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'lab' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isLabMode: theme === 'lab', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
