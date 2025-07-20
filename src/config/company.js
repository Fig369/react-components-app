// Company Information Configuration
// Centralized company data for branding and contact information

export const companyConfig = {
  name: 'Component Library',
  fullName: 'Modern Component Library',
  tagline: 'A comprehensive React component library with accessibility and modern design',
  
  contact: {
    email: 'info@componentlibrary.com',
    phone: '+1 (555) 123-4567',
    address: '123 Component Street, React City, JS 12345'
  },
  
  social: {
    github: 'https://github.com/company',
    twitter: 'https://twitter.com/company',
    linkedin: 'https://linkedin.com/company/company'
  },
  
  // Dynamic copyright year
  get copyright() {
    return `© ${new Date().getFullYear()} ${this.fullName}. All rights reserved.`;
  }
};