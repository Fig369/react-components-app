import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state, validation, and submission
 * Handles form data, errors, input changes, and validation logic
 * 
 * @param {Object} initialData - Initial form data
 * @param {Object} validationRules - Validation rules object
 * @param {Function} validationRules.validate - Custom validation function
 * @returns {Object} Form state and handlers
 */
export const useFormState = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes for all input types
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'file' 
          ? files[0] 
          : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Generic validation function
  const validateForm = useCallback(() => {
    if (validationRules.validate && typeof validationRules.validate === 'function') {
      const newErrors = validationRules.validate(formData);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // Default validation if no custom rules provided
    const newErrors = {};
    
    // Check for required fields
    Object.keys(formData).forEach(field => {
      if (validationRules.required && validationRules.required.includes(field)) {
        if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
          newErrors[field] = `${field} is required`;
        }
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password length validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  // Submit handler
  const handleSubmit = useCallback(async (e, onSubmit) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        if (onSubmit && typeof onSubmit === 'function') {
          await onSubmit(formData);
        }
        setIsSubmitted(true);
      } catch (error) {
        console.error('Form submission error:', error);
        // Handle submission errors
        setErrors(prev => ({ 
          ...prev, 
          submit: error.message || 'Submission failed' 
        }));
      }
    }
    
    setIsSubmitting(false);
  }, [formData, validateForm]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, [initialData]);

  // Update specific field
  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Set multiple fields at once
  const updateFields = useCallback((fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
    
    // Clear errors for updated fields
    const updatedFieldNames = Object.keys(fields);
    if (updatedFieldNames.some(name => errors[name])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        updatedFieldNames.forEach(name => {
          if (newErrors[name]) delete newErrors[name];
        });
        return newErrors;
      });
    }
  }, [errors]);

  // Check if form has any errors
  const hasErrors = Object.keys(errors).length > 0;

  // Check if form data has changed from initial
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  return {
    // State
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    hasErrors,
    isDirty,
    
    // Handlers
    handleInputChange,
    handleSubmit,
    validateForm,
    resetForm,
    updateField,
    updateFields,
    
    // State setters (for advanced use cases)
    setFormData,
    setErrors,
    setIsSubmitting,
    setIsSubmitted
  };
};

export default useFormState;