// Form Configuration
// Centralized form field definitions and validation rules

export const formConfig = {
  // Initial form data structure
  initialFormData: {
    name: '',
    email: '',
    message: '',
    category: '',
    newsletter: false,
    priority: 'medium',
    volume: 50,
    notifications: true
  },

  // Form field definitions
  fields: {
    category: {
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'billing', label: 'Billing Question' },
        { value: 'feedback', label: 'Feedback' }
      ]
    },
    
    priority: {
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ],
      default: 'medium'
    },
    
    volume: {
      min: 0,
      max: 100,
      default: 50
    }
  },

  // Validation rules
  validation: {
    name: {
      required: true,
      minLength: 2,
      message: 'Name must be at least 2 characters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 500,
      message: 'Message must be between 10 and 500 characters'
    }
  },

  // File upload configuration
  fileUpload: {
    accept: '.pdf,.doc,.docx,.txt',
    maxSize: 5 * 1024 * 1024, // 5MB
    helperText: 'Supported formats: PDF, DOC, DOCX, TXT (max 5MB)'
  }
};