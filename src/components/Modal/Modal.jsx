import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import styles from './Modal.module.scss';

/**
 * Reusable Modal Component
 * 
 * Features:
 * - Click outside to close
 * - ESC key to close  
 * - X button to close
 * - Focus trapping
 * - Accessibility compliant
 * - Customizable size and styling
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title (optional)
 * @param {string} props.size - Modal size: 'small', 'medium', 'large', 'fullscreen' (default: 'medium')
 * @param {boolean} props.showCloseButton - Whether to show X close button (default: true)
 * @param {boolean} props.closeOnEscape - Whether to close on ESC key (default: true)
 * @param {boolean} props.closeOnOverlay - Whether to close on overlay click (default: true)
 * @param {string} props.className - Additional CSS class for modal content
 * @param {string} props.ariaLabel - ARIA label for modal (default: 'Modal dialog')
 * @param {string} props.ariaDescription - ARIA description for modal content
 */
const Modal = ({
  isOpen = false,
  onClose,
  children,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlay = true,
  className = '',
  ariaLabel = 'Modal dialog',
  ariaDescription,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        event.preventDefault();
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the element that was focused before opening the modal
      previousActiveElementRef.current = document.activeElement;
      
      // Focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Return focus to the previously focused element when modal closes
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  // Handle overlay click (click outside modal content)
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    onClose?.();
  };

  // Prevent modal content clicks from closing modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <div 
      ref={modalRef}
      className={`${styles.modal} ${styles[`modal--${size}`]}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescription}
      tabIndex={-1}
      data-modal-open={isOpen}
      {...props}
    >
      {/* Modal Overlay */}
      <div 
        className={styles.modalOverlay} 
        onClick={handleOverlayClick}
      />
      
      {/* Modal Content */}
      <div 
        className={`${styles.modalContent} ${className}`}
        onClick={handleContentClick}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            className={styles.modalClose}
            onClick={handleCloseClick}
            aria-label="Close modal"
            data-seo-element="modal-close-button"
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        )}

        {/* Optional Title */}
        {title && (
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
          </div>
        )}

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;