import { forwardRef, useMemo } from 'react';
import styles from './Button.module.scss';

/**
 * Modern, accessible button component with multiple variants and sizes
 * Supports loading states, icons, and full customization
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  className = '',
  onClick,
  type = 'button',
  as: Component = 'button',
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  ariaDescribedBy,
  ...props
}, ref) => {
  // Compute button attributes
  const buttonProps = useMemo(() => {
    const isDisabled = disabled || loading;
    
    return {
      ref,
      type: Component === 'button' ? type : undefined,
      className: `${styles.button} ${className}`,
      disabled: Component === 'button' ? isDisabled : undefined,
      onClick: isDisabled ? undefined : onClick,
      'data-variant': variant,
      'data-size': size,
      'data-loading': loading,
      'data-full-width': fullWidth,
      'data-icon-only': iconOnly,
      'aria-label': ariaLabel || (loading ? `${children} - Loading` : undefined),
      'aria-pressed': ariaPressed,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      'aria-describedby': ariaDescribedBy,
      'aria-disabled': Component !== 'button' ? isDisabled : undefined,
      'aria-busy': loading,
      role: Component !== 'button' ? 'button' : undefined,
      tabIndex: Component !== 'button' && isDisabled ? -1 : undefined,
      ...props
    };
  }, [
    Component,
    ariaControls,
    ariaDescribedBy,
    ariaExpanded,
    ariaLabel,
    ariaPressed,
    children,
    className,
    disabled,
    fullWidth,
    iconOnly,
    loading,
    onClick,
    props,
    ref,
    size,
    type,
    variant
  ]);
  
  return (
    <Component {...buttonProps}>
      {loading && (
        <span className={styles.spinner} role="status" aria-hidden="true" />
      )}
      
      {leftIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span className={`${styles.text} ${loading ? styles.srOnly : ''}`}>
        {children}
      </span>
      
      {rightIcon && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {loading && <span className={styles.srOnly}>Loading</span>}
    </Component>
  );
});

Button.displayName = 'Button';

// Export a compound component for button groups
export const ButtonGroup = ({ children, className = '', ...props }) => (
  <div className={`${styles.buttonGroup} ${className}`} role="group" {...props}>
    {children}
  </div>
);

export default Button;