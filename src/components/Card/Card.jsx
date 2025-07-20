import { forwardRef } from 'react';
import styles from './Card.module.scss';

/**
 * Modern, flexible card component with multiple variants and layouts
 * Supports images, headers, body content, and footer actions
 */
const Card = forwardRef(({
  children,
  variant = 'default',
  elevation = 'low',
  padding = 'medium',
  fullHeight = false,
  hoverable = false,
  clickable = false,
  className = '',
  onClick,
  as: Component = 'div',
  ...props
}, ref) => {
  const cardProps = {
    ref,
    className: `${styles.card} ${className}`,
    onClick: clickable ? onClick : undefined,
    'data-variant': variant,
    'data-elevation': elevation,
    'data-padding': padding,
    'data-full-height': fullHeight,
    'data-hoverable': hoverable,
    'data-clickable': clickable,
    role: clickable ? 'button' : undefined,
    tabIndex: clickable ? 0 : undefined,
    ...props
  };
  
  return <Component {...cardProps}>{children}</Component>;
});

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardHeader} ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardBody} ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardFooter} ${className}`} {...props}>
    {children}
  </div>
);

export const CardImage = ({ 
  src, 
  alt, 
  position = 'top',
  objectFit = 'cover',
  height = '200px',
  className = '', 
  ...props 
}) => (
  <div 
    className={`${styles.cardImage} ${className}`}
    data-position={position}
    style={{ height }}
    {...props}
  >
    <img 
      src={src} 
      alt={alt}
      style={{ objectFit }}
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
      }}
    />
  </div>
);

export const CardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component className={`${styles.cardTitle} ${className}`} {...props}>
    {children}
  </Component>
);

export const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`${styles.cardSubtitle} ${className}`} {...props}>
    {children}
  </p>
);

export const CardText = ({ children, className = '', ...props }) => (
  <p className={`${styles.cardText} ${className}`} {...props}>
    {children}
  </p>
);

export const CardActions = ({ children, align = 'left', className = '', ...props }) => (
  <div 
    className={`${styles.cardActions} ${className}`}
    data-align={align}
    {...props}
  >
    {children}
  </div>
);

export const CardBadge = ({ children, variant = 'primary', className = '', ...props }) => (
  <span 
    className={`${styles.cardBadge} ${className}`}
    data-variant={variant}
    {...props}
  >
    {children}
  </span>
);

export const CardAvatar = ({ 
  src, 
  srcSet,
  sizes,
  alt, 
  size = 'medium',
  width,
  height,
  className = '', 
  ...props 
}) => {
  // Generate appropriate dimensions based on size
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
    xlarge: { width: 80, height: 80 }
  };
  
  const { width: defaultWidth, height: defaultHeight } = dimensions[size] || dimensions.medium;

  return (
    <div 
      className={`${styles.cardAvatar} ${className}`}
      data-size={size}
      {...props}
    >
      <img 
        src={src} 
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width || defaultWidth}
        height={height || defaultHeight}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/100?text=User';
        }}
      />
    </div>
  );
};

export default Card;