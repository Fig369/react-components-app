import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { CompactThemeToggle } from '../ThemeToggle';
import styles from './Nav.module.scss';

/**
 * Accessible Navigation Component
 * 
 * Features:
 * - Mobile-responsive hamburger menu
 * - Keyboard navigation support
 * - ARIA labels and states
 * - Focus management
 * - Skip navigation link
 * - Semantic HTML structure
 * 
 * @param {Object} props - Component props
 * @param {string} props.logo - Logo text or component
 * @param {Array} props.items - Navigation items array
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fixed - Whether nav is fixed to top
 * @param {boolean} props.showTheme - Show theme toggle button
 * @param {Function} props.onItemClick - Callback when nav item is clicked
 */
const Nav = ({
  logo = 'Logo',
  items = [],
  className = '',
  fixed = false,
  showTheme = true,
  onItemClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const firstMenuItemRef = useRef(null);
  const lastMenuItemRef = useRef(null);

  // Ensure mobile menu is closed on mount
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus first menu item when menu opens
      firstMenuItemRef.current?.focus();
      
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Close menu when clicking outside and handle body scroll
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
      
      const handleClickOutside = (e) => {
        if (navRef.current && !navRef.current.contains(e.target)) {
          setIsOpen(false);
          setActiveDropdown(null);
        }
      };

      document.addEventListener('click', handleClickOutside);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.body.style.overflow = '';
      };
    } else {
      // Restore body scroll when menu closes
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle focus trap for mobile menu
  const handleTabKey = (e) => {
    if (!isOpen || !mobileMenuRef.current) return;

    const focusableElements = mobileMenuRef.current.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Handle placeholder links to prevent page refresh
  const handlePlaceholderLink = (e, href) => {
    // If it's a placeholder link (# or starts with #), check if target exists
    if (href === '#' || (href.startsWith('#') && href !== '#' && !document.querySelector(href))) {
      e.preventDefault();
      console.log(`Navigation placeholder link clicked: ${href}`);
      return false;
    }
  };

  const handleItemClick = (item, e) => {
    if (item.children) {
      e.preventDefault();
      toggleDropdown(item.id);
    } else {
      // Handle placeholder links
      if (item.href) {
        handlePlaceholderLink(e, item.href);
      }
      
      setIsOpen(false);
      setActiveDropdown(null);
      if (onItemClick) {
        onItemClick(item, e);
      }
    }
  };

  const renderNavItem = (item, index) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = activeDropdown === item.id;

    if (hasChildren) {
      return (
        <li key={item.id || index} className={styles.navItem} role="none">
          <button
            className={styles.navLink}
            onClick={(e) => handleItemClick(item, e)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
            aria-controls={`dropdown-${item.id}`}
            role="menuitem"
            data-seo-element={`nav-dropdown-${item.id}`}
          >
            {item.label}
            <FiChevronDown 
              className={styles.dropdownIcon}
              aria-hidden="true"
              data-open={isDropdownOpen}
            />
          </button>
          <ul
            id={`dropdown-${item.id}`}
            className={styles.dropdown}
            role="menu"
            aria-hidden={!isDropdownOpen}
            data-open={isDropdownOpen}
          >
            {item.children.map((child, childIndex) => (
              <li key={child.id || childIndex} role="none">
                <a
                  href={child.href}
                  className={styles.dropdownLink}
                  onClick={(e) => handleItemClick(child, e)}
                  role="menuitem"
                  tabIndex={isDropdownOpen ? 0 : -1}
                  data-seo-element={`nav-link-${child.id}`}
                >
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id || index} className={styles.navItem} role="none">
        <a
          ref={index === 0 ? firstMenuItemRef : index === items.length - 1 ? lastMenuItemRef : null}
          href={item.href}
          className={styles.navLink}
          onClick={(e) => handleItemClick(item, e)}
          role="menuitem"
          aria-current={item.active ? 'page' : undefined}
          data-seo-element={`nav-link-${item.id}`}
        >
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <>
      {/* Skip Navigation Link */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <nav
        ref={navRef}
        className={`${styles.nav} ${className}`}
        role="navigation"
        aria-label="Main navigation"
        data-fixed={fixed}
        onKeyDown={handleTabKey}
        {...props}
      >
        <div className={styles.navContainer}>
          {/* Logo */}
          <a 
            href="/" 
            className={styles.logo}
            aria-label="Home"
            data-seo-element="logo"
          >
            {logo}
          </a>

          {/* Desktop Navigation */}
          <ul className={styles.navList} role="menubar" aria-label="Main menu">
              {items.map(renderNavItem)}
          </ul>

          {/* Theme Toggle */}
          {showTheme && (
            <div className={styles.themeToggle}>
              <CompactThemeToggle />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            data-seo-element="mobile-menu-toggle"
          >
            <span className={styles.hamburger} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isOpen && (
          <div 
            className={styles.mobileBackdrop}
            onClick={() => setIsOpen(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation */}
        <nav
          ref={mobileMenuRef}
          id="mobile-menu"
          className={styles.mobileMenu}
          role="navigation"
          aria-label="Mobile navigation menu"
          aria-hidden={!isOpen}
          data-open={isOpen}
          inert={!isOpen || undefined}
        >
          <ul className={styles.mobileNavList} role="menu" aria-label="Mobile menu">
            {items.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isDropdownOpen = activeDropdown === item.id;

              return (
                <li key={item.id || index} className={styles.mobileNavItem} role="none">
                  {hasChildren ? (
                    <>
                      <button
                        className={styles.mobileNavLink}
                        onClick={(e) => handleItemClick(item, e)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="menu"
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {item.label}
                        <FiChevronDown 
                          className={styles.dropdownIcon}
                          aria-hidden="true"
                          data-open={isDropdownOpen}
                        />
                      </button>
                      <ul
                        className={styles.mobileDropdown}
                        role="menu"
                        aria-hidden={!isDropdownOpen}
                        data-open={isDropdownOpen}
                      >
                        {item.children.map((child, childIndex) => (
                          <li key={child.id || childIndex} role="none">
                            <a
                              href={child.href}
                              className={styles.mobileDropdownLink}
                              onClick={(e) => handleItemClick(child, e)}
                              role="menuitem"
                              tabIndex={isOpen && isDropdownOpen ? 0 : -1}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className={styles.mobileNavLink}
                      onClick={(e) => handleItemClick(item, e)}
                      role="menuitem"
                      aria-current={item.active ? 'page' : undefined}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </nav>
    </>
  );
};

export default Nav;