import { lazy, Suspense } from 'react';

// Lazy load the Chart component with optimized dynamic import
const Chart = lazy(() => 
  import(
    /* webpackChunkName: "chart-component" */
    /* webpackPrefetch: true */
    './Chart'
  ).then(module => ({
    default: module.default
  }))
);

/**
 * Optimized lazy-loaded Chart component wrapper
 * Uses simple loading state to minimize DOM complexity during loading
 */
const ChartLazy = (props) => {
  return (
    <Suspense 
      fallback={
        <div 
          className="chart-loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-sm)',
            border: '1px solid var(--color-border)'
          }}
          role="status"
          aria-label="Loading chart"
        >
          Loading chart...
        </div>
      }
    >
      <Chart {...props} />
    </Suspense>
  );
};

export default ChartLazy;