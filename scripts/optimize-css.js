const fs = require('fs');
const path = require('path');

/**
 * CSS Optimization Script
 * Removes unused CSS and optimizes for better Core Web Vitals
 */

// CSS that's definitely not used and can be safely removed
const UNUSED_CSS_PATTERNS = [
  // Bootstrap remnants
  /\.bootstrap[^{]*\{[^}]*\}/g,
  /\.btn-[^{]*\{[^}]*\}/g,
  /\.container-fluid[^{]*\{[^}]*\}/g,
  
  // Unused utility classes
  /\.text-[^{]*\{[^}]*\}/g,
  /\.bg-[^{]*\{[^}]*\}/g,
  /\.border-[^{]*\{[^}]*\}/g,
  
  // Old legacy classes that aren't used
  /\.legacy-[^{]*\{[^}]*\}/g,
  /\.old-[^{]*\{[^}]*\}/g,
  
  // Unused animation classes
  /\.bounce[^{]*\{[^}]*\}/g,
  /\.flash[^{]*\{[^}]*\}/g,
  /\.wobble[^{]*\{[^}]*\}/g,
  
  // Chart.js styles that are duplicated
  /\.chartjs-[^{]*\{[^}]*\}/g,
];

// Critical CSS patterns that should be inlined
const CRITICAL_CSS_PATTERNS = [
  /\.App[^{]*\{[^}]*\}/g,
  /body[^{]*\{[^}]*\}/g,
  /html[^{]*\{[^}]*\}/g,
  /:root[^{]*\{[^}]*\}/g,
  /\[data-theme[^{]*\{[^}]*\}/g,
];

function optimizeCSS() {
  const buildDir = path.join(__dirname, '..', 'build', 'static', 'css');
  
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory not found. Run npm run build first.');
    return;
  }

  const cssFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(buildDir, file);
    let css = fs.readFileSync(filePath, 'utf8');
    
    const originalSize = css.length;
    
    // Remove unused CSS patterns
    UNUSED_CSS_PATTERNS.forEach(pattern => {
      css = css.replace(pattern, '');
    });
    
    // Remove duplicate CSS rules
    css = removeDuplicateRules(css);
    
    // Optimize CSS properties
    css = optimizeCSSProperties(css);
    
    // Remove empty CSS rules
    css = css.replace(/[^}]*\{\s*\}/g, '');
    
    // Compress whitespace
    css = css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
    
    const optimizedSize = css.length;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    // Write optimized CSS
    fs.writeFileSync(filePath, css);
    
    console.log(`Optimized ${file}:`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`  Savings: ${(savings / 1024).toFixed(1)}KB (${savingsPercent}%)`);
  });
}

function removeDuplicateRules(css) {
  const rules = new Map();
  const rulePattern = /([^{]+)\{([^}]+)\}/g;
  let match;
  
  while ((match = rulePattern.exec(css)) !== null) {
    const selector = match[1].trim();
    const properties = match[2].trim();
    
    if (rules.has(selector)) {
      // Merge properties, keeping the last occurrence
      const existingProps = rules.get(selector);
      rules.set(selector, mergeProperties(existingProps, properties));
    } else {
      rules.set(selector, properties);
    }
  }
  
  // Rebuild CSS
  let result = '';
  for (const [selector, properties] of rules) {
    result += `${selector}{${properties}}`;
  }
  
  return result;
}

function mergeProperties(existing, new_props) {
  const existingMap = new Map();
  const newMap = new Map();
  
  // Parse existing properties
  existing.split(';').forEach(prop => {
    if (prop.trim()) {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) existingMap.set(key, value);
    }
  });
  
  // Parse new properties
  new_props.split(';').forEach(prop => {
    if (prop.trim()) {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) newMap.set(key, value);
    }
  });
  
  // Merge (new overrides existing)
  const merged = new Map([...existingMap, ...newMap]);
  
  // Convert back to string
  return Array.from(merged.entries())
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

function optimizeCSSProperties(css) {
  // Convert hex colors to shorter formats where possible
  css = css.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
  
  // Remove unnecessary zeros
  css = css.replace(/0\.(\d+)/g, '.$1');
  css = css.replace(/(\d+)\.0([^\d])/g, '$1$2');
  
  // Optimize margin/padding shorthand
  css = css.replace(/margin:\s*(\d+[a-z]*)\s+\1\s+\1\s+\1/gi, 'margin:$1');
  css = css.replace(/padding:\s*(\d+[a-z]*)\s+\1\s+\1\s+\1/gi, 'padding:$1');
  
  // Remove redundant properties
  css = css.replace(/border:\s*none/gi, 'border:0');
  css = css.replace(/background:\s*none/gi, 'background:0');
  
  return css;
}

function extractCriticalCSS() {
  const buildDir = path.join(__dirname, '..', 'build', 'static', 'css');
  const htmlPath = path.join(__dirname, '..', 'build', 'index.html');
  
  if (!fs.existsSync(buildDir) || !fs.existsSync(htmlPath)) {
    console.log('Build files not found. Run npm run build first.');
    return;
  }

  const cssFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.css'));
  let criticalCSS = '';
  
  cssFiles.forEach(file => {
    const filePath = path.join(buildDir, file);
    const css = fs.readFileSync(filePath, 'utf8');
    
    CRITICAL_CSS_PATTERNS.forEach(pattern => {
      const matches = css.match(pattern);
      if (matches) {
        criticalCSS += matches.join('');
      }
    });
  });
  
  if (criticalCSS) {
    // Inject critical CSS into HTML
    let html = fs.readFileSync(htmlPath, 'utf8');
    const criticalCSSTag = `<style>${criticalCSS}</style>`;
    
    html = html.replace(
      /<style>[\s\S]*?<\/style>/,
      match => match + criticalCSSTag
    );
    
    fs.writeFileSync(htmlPath, html);
    console.log(`Injected ${(criticalCSS.length / 1024).toFixed(1)}KB of critical CSS`);
  }
}

// Run optimization
console.log('Starting CSS optimization...');
optimizeCSS();
extractCriticalCSS();
console.log('CSS optimization complete!');