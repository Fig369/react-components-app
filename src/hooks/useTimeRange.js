import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing time range selection and data filtering
 * Handles different time periods and provides utilities for date operations
 * 
 * @param {string} initialRange - Initial time range ('1', '3', '6', '12', 'all')
 * @param {Function} onRangeChange - Callback when range changes
 * @returns {Object} Time range state and utilities
 */
export const useTimeRange = (initialRange = '6', onRangeChange) => {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  // Available time range options
  const timeRanges = useMemo(() => ({
    '1': { label: '1 Month', months: 1 },
    '3': { label: '3 Months', months: 3 },
    '6': { label: '6 Months', months: 6 },
    '12': { label: '12 Months', months: 12 },
    'all': { label: 'All Time', months: null }
  }), []);

  // Set time range
  const setTimeRange = useCallback((range) => {
    if (timeRanges[range]) {
      setSelectedRange(range);
      if (onRangeChange) {
        onRangeChange(range, timeRanges[range]);
      }
    }
  }, [timeRanges, onRangeChange]);

  // Get date range for current selection
  const getDateRange = useCallback(() => {
    const now = new Date();
    const currentRange = timeRanges[selectedRange];
    
    if (!currentRange.months) {
      // All time - return null to indicate no filtering
      return { start: null, end: now };
    }
    
    const start = new Date(now);
    start.setMonth(start.getMonth() - currentRange.months);
    
    return { start, end: now };
  }, [selectedRange, timeRanges]);

  // Generate month labels for selected range
  const getMonthLabels = useCallback(() => {
    const { start, end } = getDateRange();
    
    if (!start) {
      // For "all time", generate last 12 months
      const labels = [];
      const current = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(current);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      return labels;
    }
    
    const labels = [];
    const current = new Date(start);
    
    while (current <= end) {
      labels.push(current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      current.setMonth(current.getMonth() + 1);
    }
    
    return labels;
  }, [getDateRange]);

  // Filter data by date range
  const filterDataByRange = useCallback((data, dateField = 'date') => {
    const { start } = getDateRange();
    
    if (!start) {
      return data; // Return all data for "all time"
    }
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start;
    });
  }, [getDateRange]);

  // Check if date is within current range
  const isDateInRange = useCallback((date) => {
    const { start, end } = getDateRange();
    const checkDate = new Date(date);
    
    if (!start) return true; // All time includes everything
    
    return checkDate >= start && checkDate <= end;
  }, [getDateRange]);

  // Get relative time string
  const getRelativeTimeString = useCallback(() => {
    const currentRange = timeRanges[selectedRange];
    
    if (!currentRange.months) {
      return 'All available data';
    }
    
    if (currentRange.months === 1) {
      return 'Last month';
    }
    
    return `Last ${currentRange.months} months`;
  }, [selectedRange, timeRanges]);

  // Generate date series for charts
  const generateDateSeries = useCallback((dataPoints = 30) => {
    const { start, end } = getDateRange();
    const dates = [];
    
    if (!start) {
      // For all time, generate last year of data
      const current = new Date();
      for (let i = dataPoints - 1; i >= 0; i--) {
        const date = new Date(current);
        date.setDate(date.getDate() - i);
        dates.push(new Date(date));
      }
      return dates;
    }
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const stepSize = Math.max(1, Math.floor(totalDays / dataPoints));
    
    const current = new Date(start);
    while (current <= end && dates.length < dataPoints) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + stepSize);
    }
    
    return dates;
  }, [getDateRange]);

  return {
    // State
    selectedRange,
    timeRanges,
    
    // Current range info
    currentRange: timeRanges[selectedRange],
    dateRange: getDateRange(),
    monthLabels: getMonthLabels(),
    relativeTimeString: getRelativeTimeString(),
    
    // Actions
    setTimeRange,
    
    // Utilities
    filterDataByRange,
    isDateInRange,
    generateDateSeries
  };
};

export default useTimeRange;