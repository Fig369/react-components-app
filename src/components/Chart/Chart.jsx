import { useRef, useEffect, useState, useMemo, useId, forwardRef, useImperativeHandle } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  ArcElement,
  DoughnutController,
  RadarController,
  RadialLinearScale,
  PolarAreaController,
  ScatterController,
} from 'chart.js';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Chart.module.scss';

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  RadialLinearScale,
  PolarAreaController,
  ScatterController
);

/**
 * Dynamic Chart Component with full accessibility and theme support
 * Supports all Chart.js chart types with proper ARIA labels and keyboard navigation
 */
const Chart = forwardRef(({
  type = 'bar',
  data,
  options = {},
  variant = 'default',
  size = 'medium',
  responsive = true,
  maintainAspectRatio = true,
  loading = false,
  error = null,
  title,
  description,
  className = '',
  ariaLabel,
  ariaDescription,
  onChartClick,
  onDatasetClick,
  onElementClick,
  height,
  width,
  ...props
}, ref) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const chartId = useId();
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(loading);
  
  // Theme-aware color palette
  const getThemeColors = useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    
    return {
      primary: isDark ? 'hsl(211, 100%, 60%)' : 'hsl(211, 100%, 50%)',
      success: isDark ? 'hsl(142, 71%, 50%)' : 'hsl(142, 71%, 45%)',
      danger: isDark ? 'hsl(354, 70%, 60%)' : 'hsl(354, 70%, 54%)',
      warning: isDark ? 'hsl(45, 93%, 55%)' : 'hsl(45, 93%, 47%)',
      info: isDark ? 'hsl(198, 89%, 55%)' : 'hsl(198, 89%, 48%)',
      secondary: isDark ? 'hsl(0, 0%, 60%)' : 'hsl(0, 0%, 45%)',
      text: isDark ? 'hsl(0, 0%, 90%)' : 'hsl(0, 0%, 10%)',
      textSecondary: isDark ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 45%)',
      border: isDark ? 'hsl(0, 0%, 25%)' : 'hsl(0, 0%, 90%)',
      gridLines: isDark ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 85%)',
      background: isDark ? 'hsl(0, 0%, 9%)' : 'hsl(0, 0%, 100%)',
      // Chart-specific color palette with distinct dark mode colors
      palette: isDark ? [
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
      ]
    };
  }, [resolvedTheme]);

  // Apply theme-aware styling to chart data
  const processedData = useMemo(() => {
    if (!data) return null;

    const processedChartData = { ...data };
    
    // Apply colors to datasets if not provided
    if (processedChartData.datasets) {
      processedChartData.datasets = processedChartData.datasets.map((dataset, index) => {
        const colorIndex = index % getThemeColors.palette.length;
        const baseColor = getThemeColors.palette[colorIndex];
        
        return {
          ...dataset,
          backgroundColor: dataset.backgroundColor || (
            type === 'line' ? `${baseColor}20` : baseColor
          ),
          borderColor: dataset.borderColor || baseColor,
          pointBackgroundColor: dataset.pointBackgroundColor || baseColor,
          pointBorderColor: dataset.pointBorderColor || baseColor,
          borderWidth: dataset.borderWidth || (type === 'line' ? 2 : 1),
        };
      });
    }

    return processedChartData;
  }, [data, getThemeColors, type]);

  // Theme-aware default options with responsive enhancements
  const defaultOptions = useMemo(() => {
    // Detect screen size for responsive adjustments
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
    
    return {
      responsive,
      maintainAspectRatio,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      plugins: {
        legend: {
          display: !isSmallMobile || type === 'pie' || type === 'doughnut',
          position: isMobile ? 'bottom' : 'top',
          labels: {
            color: getThemeColors.text,
            font: {
              family: 'system-ui, -apple-system, sans-serif',
              size: isSmallMobile ? 10 : isMobile ? 11 : 12,
            },
            padding: isMobile ? 15 : 20,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: getThemeColors.background,
          titleColor: getThemeColors.text,
          bodyColor: getThemeColors.text,
          borderColor: getThemeColors.border,
          borderWidth: 1,
          titleFont: {
            size: isSmallMobile ? 12 : 14,
          },
          bodyFont: {
            size: isSmallMobile ? 11 : 13,
          },
          padding: isMobile ? 8 : 12,
          cornerRadius: 6,
          displayColors: true,
          // Mobile-friendly tooltip positioning
          position: isMobile ? 'nearest' : 'average',
        },
      },
      scales: type === 'pie' || type === 'doughnut' || type === 'polarArea' || type === 'radar' ? {} : {
        x: {
          grid: {
            color: getThemeColors.gridLines,
            lineWidth: isMobile ? 0.5 : 1,
          },
          ticks: {
            color: getThemeColors.textSecondary,
            font: {
              size: isSmallMobile ? 9 : isMobile ? 10 : 11,
            },
            maxRotation: isMobile ? 45 : 0,
            minRotation: isMobile ? 45 : 0,
            // Reduce label density on mobile
            maxTicksLimit: isSmallMobile ? 6 : isMobile ? 8 : undefined,
          },
        },
        y: {
          grid: {
            color: getThemeColors.gridLines,
            lineWidth: isMobile ? 0.5 : 1,
          },
          ticks: {
            color: getThemeColors.textSecondary,
            font: {
              size: isSmallMobile ? 9 : isMobile ? 10 : 11,
            },
            // Reduce tick density on mobile
            maxTicksLimit: isSmallMobile ? 5 : isMobile ? 6 : undefined,
          },
        },
      },
      onClick: onChartClick,
      onHover: (event, elements) => {
        if (event.native && event.native.target) {
          event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      },
      // Enhanced interaction for mobile
      interaction: {
        mode: isMobile ? 'nearest' : 'index',
        intersect: !isMobile,
        includeInvisible: false,
      },
      // Animation optimization for mobile
      animation: {
        duration: isMobile ? 750 : 1000,
        easing: 'easeOutQuart',
      },
      // Touch-friendly elements
      elements: {
        point: {
          radius: isMobile ? 4 : 3,
          hoverRadius: isMobile ? 6 : 5,
          hitRadius: isMobile ? 15 : 10, // Larger touch targets
        },
        bar: {
          borderWidth: isMobile ? 1 : 2,
          hoverBorderWidth: isMobile ? 2 : 3,
        },
      },
    };
  }, [
    responsive,
    maintainAspectRatio,
    getThemeColors,
    type,
    onChartClick,
  ]);

  // Merge provided options with defaults
  const mergedOptions = useMemo(() => {
    return {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins,
      },
      scales: {
        ...defaultOptions.scales,
        ...options.scales,
      },
    };
  }, [defaultOptions, options]);

  // Initialize and update chart
  useEffect(() => {
    if (!canvasRef.current || !processedData) return;

    setIsLoading(true);
    
    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    try {
      // Create new chart
      chartRef.current = new ChartJS(canvasRef.current, {
        type,
        data: processedData,
        options: mergedOptions,
      });

      // Set up event listeners
      if (onDatasetClick || onElementClick) {
        canvasRef.current.onclick = (event) => {
          const elements = chartRef.current.getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            true
          );

          if (elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const index = element.index;
            const dataset = processedData.datasets[datasetIndex];
            const value = dataset.data[index];

            if (onElementClick) {
              onElementClick(event, element, { datasetIndex, index, value, dataset });
            }

            if (onDatasetClick) {
              onDatasetClick(event, dataset, datasetIndex);
            }
          }
        };
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Chart creation failed:', err);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type, processedData, mergedOptions, onDatasetClick, onElementClick, resolvedTheme]);

  // Expose chart methods through ref for parent components
  useImperativeHandle(ref, () => ({
    // Export chart as optimized PNG with custom filename and quality options
    exportToPNG: (filename, options = {}) => {
      if (!chartRef.current) {
        console.warn('Chart instance not available for export');
        return false;
      }
      
      try {
        const {
          width = null,          // Custom export width (null = current size)
          height = null,         // Custom export height (null = current size)
          quality = 1,           // PNG quality (0.1 to 1.0)
          pixelRatio = 2,        // Higher for retina displays
          backgroundColor = getThemeColors.background // Background color
        } = options;

        const canvas = canvasRef.current;
        
        // Calculate optimal dimensions
        const currentRect = canvas.getBoundingClientRect();
        const exportWidth = width || Math.min(currentRect.width, 1920); // Max 1920px wide
        const exportHeight = height || Math.min(currentRect.height, 1080); // Max 1080px tall
        
        // Create a high-resolution canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set high-resolution canvas dimensions
        exportCanvas.width = exportWidth * pixelRatio;
        exportCanvas.height = exportHeight * pixelRatio;
        exportCanvas.style.width = `${exportWidth}px`;
        exportCanvas.style.height = `${exportHeight}px`;
        
        // Scale context for high DPI
        exportCtx.scale(pixelRatio, pixelRatio);
        
        // Set background color
        exportCtx.fillStyle = backgroundColor;
        exportCtx.fillRect(0, 0, exportWidth, exportHeight);
        
        // Draw the current chart onto the export canvas
        exportCtx.drawImage(canvas, 0, 0, exportWidth, exportHeight);
        
        // Get the data URL
        const url = exportCanvas.toDataURL('image/png', quality);
        
        // Create and trigger download
        const link = document.createElement('a');
        link.download = filename || `chart-${exportWidth}x${exportHeight}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Chart exported: ${exportWidth}x${exportHeight} at ${quality * 100}% quality`);
        return true;
        
      } catch (error) {
        console.error('Failed to export chart:', error);
        
        // Fallback: Use Chart.js built-in export
        try {
          const url = chartRef.current.toBase64Image('image/png', 1);
          const link = document.createElement('a');
          link.download = filename || `chart-${new Date().toISOString().split('T')[0]}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('Chart exported using fallback method');
          return true;
        } catch (fallbackError) {
          console.error('Fallback export also failed:', fallbackError);
          return false;
        }
      }
    },
    
    // Get direct access to Chart.js instance
    getChartInstance: () => chartRef.current,
    
    // Get canvas element for custom operations
    getCanvas: () => canvasRef.current,
    
    // Get chart as base64 data URL without triggering download
    toDataURL: (type = 'image/png', quality = 1) => {
      if (!chartRef.current) return null;
      try {
        return chartRef.current.toBase64Image(type, quality);
      } catch (error) {
        console.error('Failed to get chart data URL:', error);
        return null;
      }
    },
    
    // Update chart data programmatically
    updateData: (newData) => {
      if (!chartRef.current) return false;
      try {
        chartRef.current.data = newData;
        chartRef.current.update();
        return true;
      } catch (error) {
        console.error('Failed to update chart data:', error);
        return false;
      }
    }
  }), [getThemeColors.background]);

  // Handle loading state
  if (isLoading || loading) {
    return (
      <div 
        className={`${styles.chart} ${styles.loading} ${className}`}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        <div className={styles.loadingSpinner} role="status" aria-label="Loading chart">
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Loading chart...</span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div 
        className={`${styles.chart} ${styles.error} ${className}`}
        data-variant={variant}
        data-size={size}
        role="alert"
        {...props}
      >
        <div className={styles.errorContent}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!processedData || !processedData.datasets || processedData.datasets.length === 0) {
    return (
      <div 
        className={`${styles.chart} ${styles.noData} ${className}`}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        <div className={styles.noDataContent}>
          <span className={styles.noDataIcon}>📊</span>
          <p className={styles.noDataMessage}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`${styles.chart} ${className}`}
      data-variant={variant}
      data-size={size}
      data-type={type}
      {...props}
    >
      {title && (
        <h3 
          id={`${chartId}-title`}
          className={styles.chartTitle}
        >
          {title}
        </h3>
      )}
      
      {description && (
        <p 
          id={`${chartId}-description`}
          className={styles.chartDescription}
        >
          {description}
        </p>
      )}
      
      <div 
        className={styles.chartContainer}
        style={{ height, width }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaLabel || title || `${type} chart`}
          aria-describedby={
            [
              ariaDescription && `${chartId}-aria-desc`,
              description && `${chartId}-description`,
              title && `${chartId}-title`,
              `${chartId}-theme-info`
            ].filter(Boolean).join(' ') || undefined
          }
          aria-live="polite"
          aria-atomic="true"
        />
        
        {/* Hidden descriptions for screen readers */}
        {ariaDescription && (
          <div 
            id={`${chartId}-aria-desc`}
            className={styles.srOnly}
          >
            {ariaDescription}
          </div>
        )}
        
        {/* Theme information for accessibility */}
        <div 
          id={`${chartId}-theme-info`}
          className={styles.srOnly}
          aria-live="polite"
        >
          Chart styled for {resolvedTheme} theme
        </div>
      </div>
    </div>
  );
});

Chart.displayName = 'Chart';

// Chart variants for common use cases
export const BarChart = (props) => <Chart type="bar" {...props} />;
export const LineChart = (props) => <Chart type="line" {...props} />;
export const PieChart = (props) => <Chart type="pie" {...props} />;
export const DoughnutChart = (props) => <Chart type="doughnut" {...props} />;
export const RadarChart = (props) => <Chart type="radar" {...props} />;
export const PolarAreaChart = (props) => <Chart type="polarArea" {...props} />;
export const ScatterChart = (props) => <Chart type="scatter" {...props} />;

export default Chart;