/**
 * Sales Data Management Utility
 * Handles persistent sales data with initial values and random generation
 */

// Initial sales data for each team member (persistent on page load)
const INITIAL_SALES_DATA = {
  'USR001': { // Sarah Johnson
    currentMonth: 125000,
    lastMonth: 118000,
    target: 130000,
    ytd: 1425000
  },
  'USR002': { // Michael Chen
    currentMonth: 98000,
    lastMonth: 89000,
    target: 100000,
    ytd: 1089000
  },
  'USR003': { // Emma Rodriguez
    currentMonth: 142000,
    lastMonth: 135000,
    target: 150000,
    ytd: 1580000
  },
  'USR004': { // James Williams
    currentMonth: 195000,
    lastMonth: 178000,
    target: 200000,
    ytd: 2145000
  },
  'USR005': { // Priya Patel
    currentMonth: 67000,
    lastMonth: 62000,
    target: 70000,
    ytd: 745000
  },
  'USR006': { // Carlos Mendoza
    currentMonth: 134000,
    lastMonth: 128000,
    target: 140000,
    ytd: 1456000
  },
  'USR007': { // Lisa Kim
    currentMonth: 78000,
    lastMonth: 71000,
    target: 80000,
    ytd: 834000
  },
  'USR008': { // David Thompson
    currentMonth: 156000,
    lastMonth: 149000,
    target: 160000,
    ytd: 1687000
  },
  'USR009': { // Maria Garcia
    currentMonth: 112000,
    lastMonth: 105000,
    target: 115000,
    ytd: 1234000
  },
  'USR010': { // Alex Anderson
    currentMonth: 45000,
    lastMonth: 38000,
    target: 50000,
    ytd: 487000
  }
};

// Storage key for persisting sales data
const STORAGE_KEY = 'team-sales-data';

/**
 * Get sales data from localStorage or return initial data
 * @returns {Object} Sales data object
 */
export const getSalesData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load sales data from localStorage:', error);
  }
  
  // Return initial data and save it
  saveSalesData(INITIAL_SALES_DATA);
  return INITIAL_SALES_DATA;
};

/**
 * Save sales data to localStorage
 * @param {Object} data - Sales data to save
 */
export const saveSalesData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save sales data to localStorage:', error);
  }
};

/**
 * Generate random sales data for all team members
 * @returns {Object} New random sales data
 */
export const generateRandomSalesData = () => {
  const newData = {};
  
  Object.keys(INITIAL_SALES_DATA).forEach(userId => {
    const baseTarget = INITIAL_SALES_DATA[userId].target;
    
    // Generate random current month (70% - 130% of target)
    const currentMonth = Math.floor(baseTarget * (0.7 + Math.random() * 0.6));
    
    // Generate random last month (60% - 120% of target)
    const lastMonth = Math.floor(baseTarget * (0.6 + Math.random() * 0.6));
    
    // YTD is roughly 11 months of average performance
    const avgMonthly = (currentMonth + lastMonth) / 2;
    const ytd = Math.floor(avgMonthly * (10 + Math.random() * 2));
    
    newData[userId] = {
      currentMonth,
      lastMonth,
      target: baseTarget, // Keep original target
      ytd
    };
  });
  
  saveSalesData(newData);
  return newData;
};

/**
 * Reset sales data to initial values
 * @returns {Object} Initial sales data
 */
export const resetSalesData = () => {
  saveSalesData(INITIAL_SALES_DATA);
  return INITIAL_SALES_DATA;
};

/**
 * Get formatted sales data for chart display
 * @param {Array} teamMembers - Array of team member objects
 * @param {Object} salesData - Sales data object
 * @param {string} metric - Which metric to display ('currentMonth', 'lastMonth', 'target', 'ytd')
 * @returns {Object} Formatted data for Chart.js
 */
export const formatSalesDataForChart = (teamMembers, salesData, metric = 'currentMonth') => {
  const labels = teamMembers.map(member => `${member.firstName} ${member.lastName}`);
  const data = teamMembers.map(member => salesData[member.user]?.[metric] || 0);
  
  // Color scheme based on performance
  const colors = data.map((value, index) => {
    const member = teamMembers[index];
    const memberData = salesData[member.user];
    
    if (!memberData) return '#64748b'; // Gray for missing data
    
    if (metric === 'currentMonth') {
      const performance = value / memberData.target;
      if (performance >= 1.1) return '#10b981'; // Green for >110%
      if (performance >= 1.0) return '#06b6d4'; // Cyan for 100-110%
      if (performance >= 0.9) return '#f59e0b'; // Yellow for 90-100%
      return '#ef4444'; // Red for <90%
    }
    
    // Default color scheme for other metrics
    return '#3b82f6'; // Blue
  });
  
  return {
    labels,
    datasets: [{
      label: getMetricLabel(metric),
      data,
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }]
  };
};

/**
 * Get human-readable label for metric
 * @param {string} metric - Metric key
 * @returns {string} Human-readable label
 */
export const getMetricLabel = (metric) => {
  const labels = {
    currentMonth: 'Current Month Sales',
    lastMonth: 'Last Month Sales',
    target: 'Monthly Target',
    ytd: 'Year to Date Sales'
  };
  
  return labels[metric] || metric;
};

/**
 * Get sales summary statistics
 * @param {Object} salesData - Sales data object
 * @returns {Object} Summary statistics
 */
export const getSalesSummary = (salesData) => {
  const values = Object.values(salesData);
  
  const totalCurrentMonth = values.reduce((sum, data) => sum + data.currentMonth, 0);
  const totalLastMonth = values.reduce((sum, data) => sum + data.lastMonth, 0);
  const totalTarget = values.reduce((sum, data) => sum + data.target, 0);
  const totalYTD = values.reduce((sum, data) => sum + data.ytd, 0);
  
  const currentMonthPerformance = (totalCurrentMonth / totalTarget) * 100;
  const monthOverMonth = ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100;
  
  return {
    totalCurrentMonth,
    totalLastMonth,
    totalTarget,
    totalYTD,
    currentMonthPerformance,
    monthOverMonth,
    teamSize: values.length
  };
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} percentage - Percentage to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(percentage / 100);
};