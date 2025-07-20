// Bundle analyzer script to identify large dependencies for mobile optimization
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config) {
  // Only add bundle analyzer in development or when explicitly requested
  if (process.env.ANALYZE_BUNDLE) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html',
        generateStatsFile: true,
        statsFilename: 'bundle-stats.json',
        logLevel: 'info'
      })
    );
  }
  
  return config;
};