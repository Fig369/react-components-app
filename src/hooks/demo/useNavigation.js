// Navigation Hook
// Handles navigation interactions and smooth scrolling

import { useCallback } from 'react';
import { scrollConfig } from '../../config';

export const useNavigation = (openFormModal) => {
  const handleNavClick = useCallback((item, e) => {
    // Handle special onClick actions
    if (item.onClick === 'showFormModal') {
      e.preventDefault();
      openFormModal();
      return;
    }
    
    if (item.href && item.href.startsWith('#')) {
      e.preventDefault();
      const targetId = item.href.substring(1);
      
      if (targetId === '') {
        // Scroll to top for empty hash
        window.scrollTo({ 
          top: 0, 
          behavior: scrollConfig.behavior 
        });
      } else {
        // Scroll to specific section
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const targetPosition = targetElement.offsetTop - scrollConfig.navHeight;
          window.scrollTo({ 
            top: targetPosition, 
            behavior: scrollConfig.behavior 
          });
        }
      }
    }
  }, [openFormModal]);

  const handleNewsletterSubmit = useCallback((email) => {
    console.log('Newsletter signup:', email);
    // Add your newsletter signup logic here
    alert(`Thank you for subscribing with email: ${email}`);
  }, []);

  return {
    handleNavClick,
    handleNewsletterSubmit
  };
};