/**
 * Date Utilities Library
 * Provides constants and utility functions for working with dates, months, and time ranges
 */

// All 12 months with their correct day counts (non-leap year)
export const ALL_MONTHS = [
  { name: 'Jan', fullName: 'January', maxDays: 31, number: 1 },
  { name: 'Feb', fullName: 'February', maxDays: 28, number: 2 },
  { name: 'Mar', fullName: 'March', maxDays: 31, number: 3 },
  { name: 'Apr', fullName: 'April', maxDays: 30, number: 4 },
  { name: 'May', fullName: 'May', maxDays: 31, number: 5 },
  { name: 'Jun', fullName: 'June', maxDays: 30, number: 6 },
  { name: 'Jul', fullName: 'July', maxDays: 31, number: 7 },
  { name: 'Aug', fullName: 'August', maxDays: 31, number: 8 },
  { name: 'Sep', fullName: 'September', maxDays: 30, number: 9 },
  { name: 'Oct', fullName: 'October', maxDays: 31, number: 10 },
  { name: 'Nov', fullName: 'November', maxDays: 30, number: 11 },
  { name: 'Dec', fullName: 'December', maxDays: 31, number: 12 }
];

// Month name constants for easy access
export const MONTH_NAMES = ALL_MONTHS.map(month => month.name);
export const MONTH_FULL_NAMES = ALL_MONTHS.map(month => month.fullName);

// Quarter definitions
export const QUARTERS = {
  Q1: ['Jan', 'Feb', 'Mar'],
  Q2: ['Apr', 'May', 'Jun'],
  Q3: ['Jul', 'Aug', 'Sep'],
  Q4: ['Oct', 'Nov', 'Dec']
};

/**
 * Check if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if the year is a leap year
 */
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Get the number of days in February for a given year
 * @param {number} year - The year to check
 * @returns {number} 28 or 29 days
 */
export const getFebruaryDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

/**
 * Get month data with correct days for a specific year (handles leap years)
 * @param {number} year - The year to get month data for
 * @returns {Array} Array of month objects with correct day counts
 */
export const getMonthsForYear = (year) => {
  return ALL_MONTHS.map(month => ({
    ...month,
    maxDays: month.name === 'Feb' ? getFebruaryDays(year) : month.maxDays
  }));
};

/**
 * Get months based on time range from current date
 * @param {string} range - '3', '6', 'ytd', or 'all'
 * @param {Date} fromDate - Optional starting date (defaults to current date)
 * @returns {Array} Array of month objects for the specified range
 */
export const getMonthsByRange = (range, fromDate = new Date()) => {
  const currentMonth = fromDate.getMonth(); // 0-11
  const currentYear = fromDate.getFullYear();
  const monthsForYear = getMonthsForYear(currentYear);
  
  switch (range) {
    case '3': {
      // Last 3 months
      const months = [];
      for (let i = 2; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        months.push(monthsForYear[monthIndex]);
      }
      return months;
    }
    
    case '6': {
      // Last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        months.push(monthsForYear[monthIndex]);
      }
      return months;
    }
    
    case 'ytd': {
      // Year to date (Jan to current month)
      return monthsForYear.slice(0, currentMonth + 1);
    }
    
    case 'all': {
      // All 12 months
      return monthsForYear;
    }
    
    default:
      return [];
  }
};

/**
 * Get the current month object
 * @param {Date} date - Optional date (defaults to current date)
 * @returns {Object} Current month object
 */
export const getCurrentMonth = (date = new Date()) => {
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const monthsForYear = getMonthsForYear(year);
  return monthsForYear[monthIndex];
};

/**
 * Get month object by name
 * @param {string} monthName - Month name (short or full)
 * @param {number} year - Optional year for leap year calculation
 * @returns {Object|null} Month object or null if not found
 */
export const getMonthByName = (monthName, year = new Date().getFullYear()) => {
  const monthsForYear = getMonthsForYear(year);
  return monthsForYear.find(
    month => 
      month.name.toLowerCase() === monthName.toLowerCase() ||
      month.fullName.toLowerCase() === monthName.toLowerCase()
  ) || null;
};

/**
 * Get quarter for a given month
 * @param {string} monthName - Month name (short or full)
 * @returns {string|null} Quarter name (Q1, Q2, Q3, Q4) or null
 */
export const getQuarterForMonth = (monthName) => {
  const month = getMonthByName(monthName);
  if (!month) return null;
  
  for (const [quarter, months] of Object.entries(QUARTERS)) {
    if (months.includes(month.name)) {
      return quarter;
    }
  }
  return null;
};

/**
 * Generate array of day numbers for a given month
 * @param {string} monthName - Month name
 * @param {number} year - Year for leap year calculation
 * @returns {Array} Array of day numbers [1, 2, 3, ..., maxDays]
 */
export const getDaysInMonth = (monthName, year = new Date().getFullYear()) => {
  const month = getMonthByName(monthName, year);
  if (!month) return [];
  
  return Array.from({ length: month.maxDays }, (_, i) => i + 1);
};

/**
 * Format month and day for display
 * @param {string} monthName - Month name
 * @param {number} day - Day number
 * @param {boolean} useFullName - Whether to use full month name
 * @returns {string} Formatted date string
 */
export const formatMonthDay = (monthName, day, useFullName = false) => {
  const month = getMonthByName(monthName);
  if (!month) return '';
  
  const displayName = useFullName ? month.fullName : month.name;
  return `${displayName} ${day}`;
};

/**
 * Get time range options for UI components
 * @returns {Array} Array of time range option objects
 */
export const getTimeRangeOptions = () => [
  { value: '3', label: '3 Months', description: 'Last 3 months' },
  { value: '6', label: '6 Months', description: 'Last 6 months' },
  { value: 'ytd', label: 'YTD', description: 'Year to date' },
  { value: 'all', label: 'All Year', description: 'All 12 months' }
];

// Default export for convenience
export default {
  ALL_MONTHS,
  MONTH_NAMES,
  MONTH_FULL_NAMES,
  QUARTERS,
  isLeapYear,
  getFebruaryDays,
  getMonthsForYear,
  getMonthsByRange,
  getCurrentMonth,
  getMonthByName,
  getQuarterForMonth,
  getDaysInMonth,
  formatMonthDay,
  getTimeRangeOptions
};