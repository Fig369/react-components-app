import { useState } from 'react';
import { generateAvatarUrl } from '../data/teamMembers';

// Smart Avatar Component that uses optimized images with accessibility and performance features
export const SmartAvatar = ({ member, size = 48, className = "", priority = false, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine loading priority based on context and size
  const isEager = priority || size >= 80; // Larger images or priority images load eagerly
  
  const handleImageError = (event) => {
    console.warn(`Failed to load optimized image for ${member.firstName} ${member.lastName}:`, {
      src: event.target.src,
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight,
      error: 'Image load failed'
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Enhanced alt text for accessibility
  const altText = `Profile photo of ${member.firstName} ${member.lastName}, ${member.role}`;

  // Try to use the imgUrl first (direct path), then fall back to generated avatar
  const primaryImageSrc = member.imgUrl && !imageError ? member.imgUrl : null;
  
  // Fallback to generated avatar with performance optimization
  const avatarUrl = member.avatarSources ? 
    (size <= 48 ? member.avatarSources.small :
     size <= 64 ? member.avatarSources.medium :
     size <= 96 ? member.avatarSources.large :
     member.avatarSources.xlarge) :
    generateAvatarUrl(`${member.firstName} ${member.lastName}`, "3b82f6", size);

  const finalImageSrc = primaryImageSrc || avatarUrl;
  const isOptimizedImage = primaryImageSrc && !imageError;

  return (
    <img
      src={finalImageSrc}
      alt={isOptimizedImage ? altText : `Generated avatar for ${member.firstName} ${member.lastName}, ${member.role}`}
      width={size}
      height={size}
      loading={isEager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        opacity: imageLoaded ? 1 : 0.7,
        transition: 'opacity 0.2s ease-in-out',
        backgroundColor: '#f3f4f6',
        ...props.style
      }}
      {...props}
    />
  );
};