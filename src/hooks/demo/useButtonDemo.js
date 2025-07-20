// Button Demo Hook
// Manages button interaction states for demo purposes

import { useState, useCallback } from 'react';
import { demoConfig } from '../../config';

export const useButtonDemo = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, demoConfig.timing.submitDelay);
  }, []);

  const toggleDisabled = useCallback(() => {
    setIsDisabled(prev => !prev);
  }, []);

  return {
    // State
    isDisabled,
    loading,
    
    // Actions
    handleClick,
    handleSubmit,
    toggleDisabled
  };
};