import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

// Theme configuration object for scalability
const THEME_CONFIG = {
  themes: {
    light: {
      name: 'light',
      displayName: 'Light Mode',
      icon: '☀️'
    },
    dark: {
      name: 'dark', 
      displayName: 'Dark Mode',
      icon: '🌙'
    },
    auto: {
      name: 'auto',
      displayName: 'Auto (System)',
      icon: '🔄'
    }
  },
  defaultTheme: 'auto',
  storageKey: 'app-theme-preference'
};

// Create the theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  resolvedTheme: 'light',
  themes: THEME_CONFIG.themes,
  systemTheme: 'light',
  isDark: false,
  isLight: true,
  toggleTheme: () => {}
});

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children, defaultTheme = THEME_CONFIG.defaultTheme }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [systemTheme, setSystemTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey);
    const systemThemeValue = getSystemTheme();
    
    setSystemTheme(systemThemeValue);
    
    if (savedTheme && THEME_CONFIG.themes[savedTheme]) {
      setTheme(savedTheme);
    }
    
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const resolvedTheme = theme === 'auto' ? systemTheme : theme;
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    root.classList.add(`theme-${resolvedTheme}`);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', resolvedTheme);
    
    // Save to localStorage (except for auto which should persist as auto)
    localStorage.setItem(THEME_CONFIG.storageKey, theme);
    
    // Update color-scheme CSS property for better browser integration
    root.style.colorScheme = resolvedTheme;
  }, [theme, systemTheme, mounted]);

  // Calculate derived values
  const resolvedTheme = useMemo(() => {
    return theme === 'auto' ? systemTheme : theme;
  }, [theme, systemTheme]);

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  // Theme setter with validation
  const handleSetTheme = (newTheme) => {
    if (THEME_CONFIG.themes[newTheme]) {
      setTheme(newTheme);
    } else {
      console.warn(`Invalid theme: ${newTheme}. Available themes:`, Object.keys(THEME_CONFIG.themes));
    }
  };

  // Toggle between light and dark (skips auto)
  const toggleTheme = useCallback(() => {
    if (theme === 'light') {
      handleSetTheme('dark');
    } else if (theme === 'dark') {
      handleSetTheme('light');
    } else {
      // If auto, toggle to opposite of current system theme
      handleSetTheme(systemTheme === 'light' ? 'dark' : 'light');
    }
  }, [theme, systemTheme]);

  // Context value
  const contextValue = useMemo(() => ({
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    themes: THEME_CONFIG.themes,
    systemTheme,
    isDark,
    isLight,
    toggleTheme,
    mounted
  }), [theme, resolvedTheme, systemTheme, isDark, isLight, mounted, toggleTheme]);

  // Prevent flash of wrong theme during SSR/hydration
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;