// Hooks barrel export
// Provides a centralized import location for all custom hooks

// Modal and UI state management
export { useModal } from './useModal';
export { useModalState } from './useModalState';

// Form handling
export { useFormState } from './useFormState';

// Selection management
export { useMultiSelect } from './useMultiSelect';

// Theme utilities
export { useThemeColors } from './useThemeColors';

// Time management
export { useTimer, useCountdown, useStopwatch } from './useTimer';
export { useTimeRange } from './useTimeRange';

// Re-export theme context hook for convenience
export { useTheme } from '../contexts/ThemeContext';