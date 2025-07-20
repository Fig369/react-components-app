#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Image Optimization Script
 * Converts JPG, JPEG, and PNG images to WebP format during build
 * Maintains original files and creates optimized WebP versions
 */

// Configuration
const CONFIG = {
  // Input directories to scan for images
  inputDirs: [
    'public',
    'src/assets',
    'src/images',
    'src/components'
  ],
  
  // Output directory for optimized images
  outputDir: 'public/optimized',
  
  // Image extensions to process
  extensions: ['.jpg', '.jpeg', '.png'],
  
  // WebP quality settings
  webpQuality: 85,
  
  // PNG optimization settings
  pngQuality: 90,
  
  // Generate multiple sizes for responsive images
  responsiveSizes: [480, 768, 1024, 1200, 1920],
  
  // Skip files larger than this size (in MB)
  maxSizeMB: 10
};

/**
 * Get all image files from specified directories
 */
async function getImageFiles() {
  const imageFiles = [];
  
  for (const dir of CONFIG.inputDirs) {
    try {
      const dirPath = path.resolve(dir);
      // Check if directory exists before scanning
      try {
        await fs.access(dirPath);
        await scanDirectory(dirPath, imageFiles);
      } catch (accessError) {
        // Directory doesn't exist, skip silently
        continue;
      }
    } catch (error) {
      // Skip directory if any other error occurs
      continue;
    }
  }
  
  return imageFiles;
}

/**
 * Recursively scan directory for image files
 */
async function scanDirectory(dirPath, imageFiles) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Skip node_modules, build directories, and optimized output directory
        if (!['node_modules', 'build', 'dist', '.git', 'optimized'].includes(item.name)) {
          await scanDirectory(fullPath, imageFiles);
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        // Skip already optimized files to prevent infinite loops
        if (item.name.includes('-optimized') || item.name.includes('-w.')) {
          continue;
        }
        
        if (CONFIG.extensions.includes(ext)) {
          const stats = await fs.stat(fullPath);
          const sizeMB = stats.size / (1024 * 1024);
          
          if (sizeMB <= CONFIG.maxSizeMB) {
            imageFiles.push({
              path: fullPath,
              name: item.name,
              ext,
              size: sizeMB
            });
          } else {
            console.warn(`⚠️  Skipping ${item.name} (${sizeMB.toFixed(2)}MB > ${CONFIG.maxSizeMB}MB)`);
          }
        }
      }
    }
  } catch (error) {
    // Skip directory silently if it doesn't exist or can't be accessed
    if (error.code !== 'ENOENT') {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }
}

/**
 * Convert image to WebP format
 */
async function convertToWebP(inputPath, outputPath, quality = CONFIG.webpQuality) {
  try {
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Error converting ${inputPath} to WebP:`, error.message);
    return false;
  }
}

/**
 * Generate responsive image variants
 */
async function generateResponsiveImages(inputPath, baseName, outputDir) {
  const results = [];
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalWidth = metadata.width;
    
    for (const size of CONFIG.responsiveSizes) {
      // Only generate smaller sizes, never upscale
      if (size < originalWidth) {
        const outputPath = path.join(outputDir, `${baseName}-${size}w.webp`);
        
        try {
          await image
            .clone()
            .resize(size, null, { 
              withoutEnlargement: true,
              fastShrinkOnLoad: true 
            })
            .webp({ quality: CONFIG.webpQuality, effort: 6 })
            .toFile(outputPath);
          
          results.push({
            size,
            path: outputPath,
            relativePath: path.relative('public', outputPath)
          });
          
        } catch (error) {
          console.error(`Error generating ${size}w variant:`, error.message);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error processing responsive images for ${inputPath}:`, error.message);
    return [];
  }
}

/**
 * Optimize PNG images (lossless compression)
 */
async function optimizePNG(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .png({ 
        quality: CONFIG.pngQuality,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Error optimizing PNG ${inputPath}:`, error.message);
    return false;
  }
}

/**
 * Generate image manifest for runtime usage
 */
async function generateImageManifest(processedImages) {
  const manifest = {
    generated: new Date().toISOString(),
    images: {}
  };
  
  for (const image of processedImages) {
    const key = path.basename(image.original, path.extname(image.original));
    manifest.images[key] = image;
  }
  
  const manifestPath = path.join(CONFIG.outputDir, 'images-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`📄 Generated image manifest: ${manifestPath}`);
  return manifestPath;
}

/**
 * Main processing function
 */
async function processImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Ensure output directory exists
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  
  // Get all image files
  const imageFiles = await getImageFiles();
  
  if (imageFiles.length === 0) {
    console.log('No images found to process.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to process:\n`);
  
  const processedImages = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const imageFile of imageFiles) {
    const baseName = path.basename(imageFile.name, imageFile.ext);
    const relativePath = path.relative(process.cwd(), imageFile.path);
    
    console.log(`Processing: ${relativePath} (${imageFile.size.toFixed(2)}MB)`);
    
    const result = {
      original: relativePath,
      originalSize: imageFile.size,
      webp: null,
      optimized: null,
      responsive: []
    };
    
    try {
      // Convert to WebP
      const webpPath = path.join(CONFIG.outputDir, `${baseName}.webp`);
      const webpSuccess = await convertToWebP(imageFile.path, webpPath);
      
      if (webpSuccess) {
        const webpStats = await fs.stat(webpPath);
        result.webp = {
          path: path.relative('public', webpPath),
          size: webpStats.size / (1024 * 1024)
        };
        
        console.log(`  ✅ WebP: ${result.webp.path} (${result.webp.size.toFixed(2)}MB)`);
      }
      
      // Generate responsive variants for larger images
      if (imageFile.size > 0.1) { // Only for images > 100KB
        const responsiveImages = await generateResponsiveImages(
          imageFile.path, 
          baseName, 
          CONFIG.outputDir
        );
        
        result.responsive = responsiveImages;
        
        if (responsiveImages.length > 0) {
          console.log(`  📱 Generated ${responsiveImages.length} responsive variants`);
        }
      }
      
      // Optimize PNG files
      if (imageFile.ext === '.png') {
        const optimizedPath = path.join(CONFIG.outputDir, `${baseName}-optimized.png`);
        const pngSuccess = await optimizePNG(imageFile.path, optimizedPath);
        
        if (pngSuccess) {
          const pngStats = await fs.stat(optimizedPath);
          result.optimized = {
            path: path.relative('public', optimizedPath),
            size: pngStats.size / (1024 * 1024)
          };
          
          console.log(`  🗜️  Optimized PNG: ${result.optimized.path} (${result.optimized.size.toFixed(2)}MB)`);
        }
      }
      
      processedImages.push(result);
      successCount++;
      
    } catch (error) {
      console.error(`  ❌ Error processing ${imageFile.name}:`, error.message);
      errorCount++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Generate manifest
  await generateImageManifest(processedImages);
  
  // Summary
  console.log('🎉 Image optimization complete!\n');
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Output directory: ${CONFIG.outputDir}`);
  
  // Calculate total savings
  const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalWebpSize = processedImages.reduce((sum, img) => {
    return sum + (img.webp ? img.webp.size : img.originalSize);
  }, 0);
  
  const savings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100);
  
  if (savings > 0) {
    console.log(`💾 Total size reduction: ${savings.toFixed(1)}%`);
    console.log(`📉 Original: ${totalOriginalSize.toFixed(2)}MB → WebP: ${totalWebpSize.toFixed(2)}MB`);
  }
}

/**
 * Run the script
 */
if (require.main === module) {
  processImages().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { processImages, CONFIG };