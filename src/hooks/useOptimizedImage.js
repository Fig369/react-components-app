import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for using optimized images with WebP support and fallbacks
 * 
 * @param {string} imageName - Base name of the image (without extension)
 * @param {Object} options - Configuration options
 * @returns {Object} Image sources and utilities
 */
export const useOptimizedImage = (imageName, options = {}) => {
  const [manifest, setManifest] = useState(null);
  const [supportsWebP, setSupportsWebP] = useState(null);
  
  const {
    sizes = '(max-width: 768px) 100vw, 50vw',
    fallbackFormat = 'png',
    eager = false
  } = options;

  // Load image manifest
  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch('/optimized/images-manifest.json');
        if (response.ok) {
          const data = await response.json();
          setManifest(data);
        }
      } catch (error) {
        console.warn('Could not load image manifest:', error);
      }
    };

    loadManifest();
  }, []);

  // Detect WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setSupportsWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    checkWebPSupport();
  }, []);

  // Generate optimized image sources
  const imageData = useMemo(() => {
    if (!manifest || supportsWebP === null) {
      return {
        src: `/images/${imageName}.${fallbackFormat}`,
        srcSet: null,
        sizes: null,
        webpSrc: null,
        responsiveImages: [],
        loading: eager ? 'eager' : 'lazy'
      };
    }

    const imageInfo = manifest.images[imageName];
    if (!imageInfo) {
      return {
        src: `/images/${imageName}.${fallbackFormat}`,
        srcSet: null,
        sizes: null,
        webpSrc: null,
        responsiveImages: [],
        loading: eager ? 'eager' : 'lazy'
      };
    }

    const webpSrc = imageInfo.webp ? `/optimized/${imageInfo.webp.path}` : null;
    const optimizedSrc = imageInfo.optimized ? `/optimized/${imageInfo.optimized.path}` : null;
    
    // Generate srcSet for responsive images
    let srcSet = null;
    if (imageInfo.responsive && imageInfo.responsive.length > 0) {
      if (supportsWebP && webpSrc) {
        srcSet = imageInfo.responsive
          .map(img => `/optimized/${img.relativePath} ${img.size}w`)
          .join(', ');
        if (webpSrc) {
          srcSet += `, ${webpSrc} 1920w`; // Add original WebP as largest size
        }
      } else {
        // Fallback to original for responsive (if no WebP support)
        srcSet = null;
      }
    }

    return {
      src: supportsWebP && webpSrc ? webpSrc : (optimizedSrc || `/images/${imageName}.${fallbackFormat}`),
      srcSet,
      sizes: srcSet ? sizes : null,
      webpSrc,
      originalSrc: `/images/${imageName}.${fallbackFormat}`,
      optimizedSrc,
      responsiveImages: imageInfo.responsive || [],
      loading: eager ? 'eager' : 'lazy',
      manifest: imageInfo
    };
  }, [manifest, supportsWebP, imageName, sizes, fallbackFormat, eager]);

  // Generate picture element props for advanced usage
  const pictureProps = useMemo(() => {
    if (!manifest || !supportsWebP || !imageData.webpSrc) {
      return null;
    }

    const sources = [];

    // WebP source with responsive sizes
    if (imageData.srcSet && supportsWebP) {
      sources.push({
        type: 'image/webp',
        srcSet: imageData.srcSet,
        sizes: imageData.sizes
      });
    } else if (imageData.webpSrc) {
      sources.push({
        type: 'image/webp',
        srcSet: imageData.webpSrc
      });
    }

    return {
      sources,
      img: {
        src: imageData.originalSrc,
        alt: '', // Should be provided by component
        loading: imageData.loading,
        decoding: 'async'
      }
    };
  }, [manifest, supportsWebP, imageData]);

  return {
    ...imageData,
    pictureProps,
    isLoading: manifest === null || supportsWebP === null,
    supportsWebP
  };
};

/**
 * Helper component for optimized images
 */
export const OptimizedImage = ({ 
  name, 
  alt, 
  className = '', 
  sizes,
  eager = false,
  fallbackFormat = 'png',
  ...props 
}) => {
  const imageData = useOptimizedImage(name, { sizes, eager, fallbackFormat });

  if (imageData.pictureProps) {
    return (
      <picture>
        {imageData.pictureProps.sources.map((source, index) => (
          <source key={index} {...source} />
        ))}
        <img
          {...imageData.pictureProps.img}
          alt={alt}
          className={className}
          {...props}
        />
      </picture>
    );
  }

  return (
    <img
      src={imageData.src}
      srcSet={imageData.srcSet}
      sizes={imageData.sizes}
      alt={alt}
      className={className}
      loading={imageData.loading}
      decoding="async"
      {...props}
    />
  );
};

export default useOptimizedImage;