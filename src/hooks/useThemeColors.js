import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook for generating theme-aware color palettes
 * Provides consistent colors that adapt to light/dark themes
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeAlpha - Whether to include alpha variations
 * @param {string} options.contrastLevel - 'normal' | 'high' for accessibility
 * @returns {Object} Theme-aware color object
 */
export const useThemeColors = (options = {}) => {
  const { resolvedTheme } = useTheme();
  const { includeAlpha = false, contrastLevel = 'normal' } = options;
  
  const colors = useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    const isHighContrast = contrastLevel === 'high';
    
    // Base semantic colors
    const baseColors = {
      primary: isDark 
        ? (isHighContrast ? 'hsl(211, 100%, 70%)' : 'hsl(211, 100%, 60%)')
        : (isHighContrast ? 'hsl(211, 100%, 40%)' : 'hsl(211, 100%, 50%)'),
      
      success: isDark 
        ? (isHighContrast ? 'hsl(142, 71%, 60%)' : 'hsl(142, 71%, 50%)')
        : (isHighContrast ? 'hsl(142, 71%, 35%)' : 'hsl(142, 71%, 45%)'),
      
      danger: isDark 
        ? (isHighContrast ? 'hsl(354, 70%, 70%)' : 'hsl(354, 70%, 60%)')
        : (isHighContrast ? 'hsl(354, 70%, 44%)' : 'hsl(354, 70%, 54%)'),
      
      warning: isDark 
        ? (isHighContrast ? 'hsl(45, 93%, 65%)' : 'hsl(45, 93%, 55%)')
        : (isHighContrast ? 'hsl(45, 93%, 37%)' : 'hsl(45, 93%, 47%)'),
      
      info: isDark 
        ? (isHighContrast ? 'hsl(198, 89%, 65%)' : 'hsl(198, 89%, 55%)')
        : (isHighContrast ? 'hsl(198, 89%, 38%)' : 'hsl(198, 89%, 48%)'),
      
      secondary: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 60%)')
        : (isHighContrast ? 'hsl(0, 0%, 35%)' : 'hsl(0, 0%, 45%)')
    };

    // Text and surface colors
    const surfaceColors = {
      text: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 90%)')
        : (isHighContrast ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 10%)'),
      
      textSecondary: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 85%)' : 'hsl(0, 0%, 70%)')
        : (isHighContrast ? 'hsl(0, 0%, 15%)' : 'hsl(0, 0%, 45%)'),
      
      textTertiary: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 55%)')
        : (isHighContrast ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 60%)'),
      
      border: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 40%)' : 'hsl(0, 0%, 25%)')
        : (isHighContrast ? 'hsl(0, 0%, 60%)' : 'hsl(0, 0%, 90%)'),
      
      gridLines: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 45%)' : 'hsl(0, 0%, 30%)')
        : (isHighContrast ? 'hsl(0, 0%, 55%)' : 'hsl(0, 0%, 85%)'),
      
      background: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 9%)')
        : (isHighContrast ? 'hsl(0, 0%, 100%)' : 'hsl(0, 0%, 100%)'),
      
      surface: isDark 
        ? (isHighContrast ? 'hsl(0, 0%, 5%)' : 'hsl(0, 0%, 15%)')
        : (isHighContrast ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 100%)')
    };

    // Chart-specific color palette
    const chartPalette = isDark ? [
      'hsl(211, 85%, 65%)',    // Bright blue
      'hsl(142, 65%, 55%)',    // Bright green
      'hsl(354, 75%, 65%)',    // Bright red
      'hsl(45, 90%, 60%)',     // Bright yellow
      'hsl(198, 85%, 60%)',    // Bright cyan
      'hsl(280, 85%, 75%)',    // Bright purple
      'hsl(15, 90%, 65%)',     // Bright orange
      'hsl(180, 85%, 55%)',    // Bright teal
      'hsl(120, 75%, 60%)',    // Bright lime
      'hsl(300, 80%, 70%)',    // Bright magenta
    ] : [
      'hsl(211, 100%, 45%)',   // Deep blue
      'hsl(142, 71%, 40%)',    // Deep green
      'hsl(354, 70%, 48%)',    // Deep red
      'hsl(45, 93%, 42%)',     // Deep yellow
      'hsl(198, 89%, 43%)',    // Deep cyan
      'hsl(280, 100%, 45%)',   // Deep purple
      'hsl(15, 100%, 45%)',    // Deep orange
      'hsl(180, 100%, 35%)',   // Deep teal
      'hsl(120, 75%, 35%)',    // Deep lime
      'hsl(300, 80%, 40%)',    // Deep magenta
    ];

    // Combine all colors
    const allColors = {
      ...baseColors,
      ...surfaceColors,
      palette: chartPalette
    };

    // Add alpha variations if requested
    if (includeAlpha) {
      const alphaColors = {};
      Object.entries(baseColors).forEach(([key, value]) => {
        alphaColors[`${key}Alpha`] = {
          10: value.replace('hsl(', 'hsla(').replace(')', ', 0.1)'),
          20: value.replace('hsl(', 'hsla(').replace(')', ', 0.2)'),
          30: value.replace('hsl(', 'hsla(').replace(')', ', 0.3)'),
          50: value.replace('hsl(', 'hsla(').replace(')', ', 0.5)'),
          70: value.replace('hsl(', 'hsla(').replace(')', ', 0.7)'),
          90: value.replace('hsl(', 'hsla(').replace(')', ', 0.9)')
        };
      });
      
      return { ...allColors, alpha: alphaColors };
    }

    return allColors;
  }, [resolvedTheme, includeAlpha, contrastLevel]);

  // Helper function to get color by index from palette
  const getColorByIndex = (index) => {
    return colors.palette[index % colors.palette.length];
  };

  // Helper function to generate color variations
  const getColorVariations = (baseColor, steps = 5) => {
    const variations = [];
    const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      const lightness = parseInt(l);
      const stepSize = Math.floor(lightness / (steps + 1));
      
      for (let i = 0; i <= steps; i++) {
        const newLightness = Math.max(5, Math.min(95, lightness + (i - Math.floor(steps / 2)) * stepSize));
        variations.push(`hsl(${h}, ${s}%, ${newLightness}%)`);
      }
    }
    
    return variations;
  };

  return {
    ...colors,
    theme: resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isHighContrast: contrastLevel === 'high',
    getColorByIndex,
    getColorVariations
  };
};

export default useThemeColors;