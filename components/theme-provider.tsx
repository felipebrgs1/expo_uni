import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Uniwind } from 'uniwind';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const systemColorScheme = useColorScheme();

  const actualTheme: 'light' | 'dark' = theme === 'system'
    ? ((systemColorScheme ?? 'light') as 'light' | 'dark')
    : theme;

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    Uniwind.setTheme(newTheme);
  };

  useEffect(() => {
    Uniwind.setTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
