import { FiDollarSign, FiTrendingUp, FiTarget, FiBarChart } from 'react-icons/fi';

// Metric options for chart display
export const METRIC_OPTIONS = [
  { key: 'currentMonth', label: 'Current Month', icon: FiDollarSign },
  { key: 'lastMonth', label: 'Last Month', icon: FiTrendingUp },
  { key: 'target', label: 'Monthly Target', icon: FiTarget },
  { key: 'ytd', label: 'Year to Date', icon: FiBarChart }
];

// Chart color configuration
export const METRIC_COLORS = {
  currentMonth: { base: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' },
  lastMonth: { base: 'rgba(168, 85, 247, 0.8)', border: 'rgba(168, 85, 247, 1)' },
  target: { base: 'rgba(34, 197, 94, 0.8)', border: 'rgba(34, 197, 94, 1)' },
  ytd: { base: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' }
};

// Performance color thresholds
export const PERFORMANCE_COLORS = {
  excellent: 'rgba(34, 197, 94, 0.8)',  // green-500 - exceeding target (100%+)
  good: 'rgba(59, 130, 246, 0.8)',      // blue-500 - close to target (90%+)
  fair: 'rgba(245, 158, 11, 0.8)',      // amber-500 - moderate performance (70%+)
  poor: 'rgba(239, 68, 68, 0.8)',       // red-500 - needs improvement (<70%)
  neutral: 'rgba(156, 163, 175, 0.8)'   // gray-400 - no data
};