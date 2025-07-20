import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing modal state and accessibility
 * Handles focus trapping, keyboard navigation, and cleanup
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.closeOnEscape - Whether to close modal on Escape key (default: true)
 * @param {boolean} options.trapFocus - Whether to trap focus within modal (default: true)
 * @param {string} options.triggerSelector - CSS selector for element to return focus to (default: '[data-modal-trigger]')
 * @param {Function} options.onClose - Callback function to call when modal closes
 * @returns {Object} Modal state and controls
 */
export const useModal = (options = {}) => {
  const {
    closeOnEscape = true,
    trapFocus = true,
    triggerSelector = '[data-modal-trigger]',
    onClose
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Store the element that triggered the modal
  const openModal = () => {
    previousActiveElementRef.current = document.activeElement;
    setIsOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Call onClose callback if provided
    if (onClose) {
      onClose();
    }
    // Return focus to trigger element or previously active element
    const triggerElement = document.querySelector(triggerSelector);
    const focusTarget = triggerElement || previousActiveElementRef.current;
    focusTarget?.focus();
  }, [triggerSelector, onClose]);

  // Focus trap effect
  useEffect(() => {
    if (!isOpen || !trapFocus || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    firstElement?.focus();

    const handleKeyDown = (e) => {
      // Handle Tab key for focus trapping
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      
      // Handle Escape key to close modal
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, trapFocus, closeOnEscape, closeModal]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isOpen) {
        const focusTarget = previousActiveElementRef.current;
        focusTarget?.focus();
      }
    };
  }, [isOpen]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal: () => isOpen ? closeModal() : openModal(),
    modalRef,
    modalProps: {
      ref: modalRef,
      role: 'dialog',
      'aria-modal': 'true',
      tabIndex: -1
    }
  };
};

export default useModal;