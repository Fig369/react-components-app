import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * Simpler alternative to useModal for basic modal state management
 * 
 * @param {boolean} initialOpen - Initial open state (default: false)
 * @returns {Object} Modal state and controls
 */
export const useModalState = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModalState;