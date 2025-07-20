// Form Demo Hook
// Manages form state and validation for the demo modal

import { useState, useCallback, useEffect } from 'react';
import { formConfig } from '../../config';

export const useFormDemo = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState(formConfig.initialFormData);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsFormModalOpen(false);
  }, [formData]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const openFormModal = useCallback(() => {
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
  }, []);

  // Focus first input when modal opens
  useEffect(() => {
    if (isFormModalOpen) {
      // Use setTimeout to ensure the modal is fully rendered before focusing
      const timer = setTimeout(() => {
        // Look for the first form input in the modal - prioritize text inputs first
        const modal = document.querySelector('[data-modal-open="true"]');
        if (modal) {
          // Try to find the first text input, then any other focusable input
          const firstInput = modal.querySelector(
            'input[type="text"]:not([disabled]), ' +
            'input[type="email"]:not([disabled]), ' +
            'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([disabled]), ' +
            'textarea:not([disabled]), ' +
            'select:not([disabled])'
          );
          
          if (firstInput) {
            firstInput.focus();
            // Add visual focus indication for demo purposes
            firstInput.style.outline = '2px solid var(--color-primary-500)';
            firstInput.style.outlineOffset = '2px';
            
            // Remove the extra outline after a short time
            setTimeout(() => {
              if (firstInput.style) {
                firstInput.style.outline = '';
                firstInput.style.outlineOffset = '';
              }
            }, 2000);
          }
        }
      }, 200); // Slightly longer delay to ensure smooth modal transition
      
      return () => clearTimeout(timer);
    }
  }, [isFormModalOpen]);

  const resetForm = useCallback(() => {
    setFormData(formConfig.initialFormData);
  }, []);

  return {
    // State
    isFormModalOpen,
    formData,
    
    // Actions
    handleFormSubmit,
    handleFormChange,
    openFormModal,
    closeFormModal,
    resetForm
  };
};