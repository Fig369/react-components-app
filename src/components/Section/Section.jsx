import { useMemo } from 'react';
import styles from './Section.module.scss';

/**
 * Reusable Section Component
 * 
 * Provides a standardized section structure with accessibility features,
 * flexible content wrapping, and consistent styling across the application.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section heading text
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.variant - Section variant for styling (default: 'demo')
 * @param {string} props.id - Custom ID for heading (auto-generated if not provided)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean|string} props.spacing - Add spacing classes ('mt-5', true for default, false for none)
 * @param {boolean} props.hasGroup - Whether to wrap content in a group container
 * @param {string} props.groupLabel - ARIA label for the group container
 * @param {string} props.groupRole - Role attribute for the group (default: 'group')
 * @param {Array} props.descriptions - Array of {id, text} objects for screen reader descriptions
 * @param {Object} props.ariaProps - Additional ARIA properties
 */
const Section = ({
  title,
  children,
  variant = 'demo',
  id,
  className = '',
  spacing = false,
  hasGroup = false,
  groupLabel,
  groupRole = 'group',
  descriptions = [],
  ariaProps = {},
  ...props
}) => {
  // Generate heading ID if not provided
  const headingId = useMemo(() => {
    if (id) return id;
    return `${title.toLowerCase().replace(/\s+/g, '-')}-heading`;
  }, [id, title]);

  // Build section CSS classes using the specified naming pattern
  const sectionClasses = useMemo(() => {
    const baseClass = styles.section;
    const variantClass = styles[`variant_section_header__${variant}`] || '';
    const spacingClass = spacing === true ? 'mt-5' : 
                        typeof spacing === 'string' ? spacing : '';
    
    return [baseClass, variantClass, spacingClass, className]
      .filter(Boolean)
      .join(' ');
  }, [variant, spacing, className]);

  // Build group container classes
  const groupClasses = useMemo(() => {
    if (!hasGroup) return '';
    
    // Use different group class based on variant for flexibility
    const groupClass = variant === 'demo' ? 'button-group' : 
                      styles[`variant_group__${variant}`] || 
                      styles.group || 'content-group';
    
    return groupClass;
  }, [hasGroup, variant]);

  return (
    <section 
      className={sectionClasses}
      aria-labelledby={headingId}
      {...ariaProps}
      {...props}
    >
      {/* Section Heading */}
      <h2 id={headingId} className={styles.heading}>
        {title}
      </h2>

      {/* Content - either wrapped in group or direct */}
      {hasGroup ? (
        <div 
          className={groupClasses}
          role={groupRole}
          aria-label={groupLabel}
        >
          {children}
        </div>
      ) : (
        children
      )}

      {/* Screen Reader Descriptions */}
      {descriptions.length > 0 && (
        <div className="sr-only">
          {descriptions.map(({ id: descId, text }) => (
            <p key={descId} id={descId}>
              {text}
            </p>
          ))}
        </div>
      )}
    </section>
  );
};

export default Section;