import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Button';
import styles from './ThemeToggle.module.scss';

/**
 * Theme Toggle Component - Allows users to switch between light/dark/auto themes
 * Uses the ThemeContext for state management and persistence
 */
const ThemeToggle = ({ 
  showLabel = true, 
  variant = 'ghost',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const { theme, setTheme, themes, resolvedTheme } = useTheme();

  const handleThemeChange = () => {
    // Cycle through themes: light -> dark -> auto -> light
    const themeOrder = ['light', 'dark', 'auto'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const currentThemeConfig = themes[theme];
  const resolvedThemeConfig = themes[resolvedTheme];

  return (
    <div className={`${styles.themeToggle} ${className}`} {...props}>
      <Button
        variant={variant}
        size={size}
        onClick={handleThemeChange}
        leftIcon={<span className={styles.themeIcon}>{currentThemeConfig?.icon}</span>}
        ariaLabel={`Switch theme. Current: ${currentThemeConfig?.displayName}`}
        ariaPressed={theme !== 'auto'}
        className={styles.toggleButton}
        data-theme={resolvedTheme}
        data-seo-element="theme-toggle-button"
        tabIndex={0}
      >
        {showLabel && (
          <span className={styles.themeLabel}>
            {currentThemeConfig?.displayName}
          </span>
        )}
      </Button>
      
      {theme === 'auto' && (
        <span className={styles.systemIndicator} aria-label="Following system preference">
          <span className={styles.systemIcon}>{resolvedThemeConfig?.icon}</span>
        </span>
      )}
    </div>
  );
};

// Dropdown version for more detailed theme selection
export const ThemeSelector = ({ 
  className = '',
  ...props 
}) => {
  const { theme, setTheme, themes, resolvedTheme } = useTheme();

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className={`${styles.themeSelector} ${className}`} {...props}>
      <div className={styles.selectorLabel}>Theme</div>
      <div className={styles.themeOptions}>
        {Object.entries(themes).map(([themeKey, themeConfig]) => (
          <Button
            key={themeKey}
            variant={theme === themeKey ? 'primary' : 'ghost'}
            size="small"
            onClick={() => handleThemeSelect(themeKey)}
            leftIcon={<span className={styles.themeIcon} aria-hidden="true">{themeConfig.icon}</span>}
            className={styles.themeOption}
            data-active={theme === themeKey}
            data-seo-element={`theme-option-${themeKey}`}
            tabIndex={0}
            aria-pressed={theme === themeKey}
          >
            {themeConfig.displayName}
            {themeKey === 'auto' && (
              <span className={styles.autoIndicator}>
                ({themes[resolvedTheme]?.icon})
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Compact toggle for headers/navbars
export const CompactThemeToggle = ({ className = '', ...props }) => {
  const { toggleTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="small"
      onClick={toggleTheme}
      iconOnly
      ariaLabel={`Toggle theme. Current: ${resolvedTheme}`}
      ariaPressed={resolvedTheme === 'dark'}
      className={`${styles.compactToggle} ${className}`}
      data-theme={resolvedTheme}
      data-seo-element="compact-theme-toggle"
      tabIndex={0}
      {...props}
    >
      <span className={styles.compactIcon}>
        {resolvedTheme === 'dark' ? '🌙' : '☀️'}
      </span>
    </Button>
  );
};

export default ThemeToggle;