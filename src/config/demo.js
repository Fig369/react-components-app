// Demo Configuration
// Centralized configuration for demo content and examples

export const demoConfig = {
  // Demo timing configuration
  timing: {
    submitDelay: 2000, // Simulated API call delay
    loadingDuration: 1500 // Button loading state duration
  },

  // Button demo descriptions
  buttonDescriptions: [
    { id: 'primary-desc', text: 'Primary button for main actions' },
    { id: 'secondary-desc', text: 'Secondary button for alternative actions' },
    { id: 'success-desc', text: 'Success button for positive actions' },
    { id: 'danger-desc', text: 'Danger button for destructive actions' },
    { id: 'ghost-desc', text: 'Ghost button with transparent background' },
    { id: 'outline-desc', text: 'Outline button with border styling' }
  ],

  sizeDescriptions: [
    { id: 'small-desc', text: 'Small sized button for compact layouts' },
    { id: 'medium-desc', text: 'Medium sized button for standard use' },
    { id: 'large-desc', text: 'Large sized button for prominent actions' }
  ],

  iconDescriptions: [
    { id: 'download-desc', text: 'Button with download icon on the left' },
    { id: 'continue-desc', text: 'Button with arrow icon on the right' },
    { id: 'like-desc', text: 'Button with heart icon for liking content' }
  ],

  stateDescriptions: [
    { id: 'clickable-desc', text: 'Standard clickable button' },
    { id: 'disabled-desc', text: 'Button that can be enabled or disabled' },
    { id: 'loading-desc', text: 'Button that shows loading state when submitting' },
    { id: 'full-width-desc', text: 'Button that spans the full width of its container' }
  ],

  groupDescriptions: [
    { id: 'group-left-desc', text: 'Left button in grouped set' },
    { id: 'group-center-desc', text: 'Center button in grouped set' },
    { id: 'group-right-desc', text: 'Right button in grouped set' }
  ],

  controlDescriptions: [
    { id: 'settings-desc', text: 'Button to toggle the disabled state of demo buttons' }
  ]
};

// Page section configuration
export const sectionConfig = {
  hero: {
    title: 'Modern Component Library',
    tagline: 'A comprehensive React component library with accessibility and modern design'
  },

  sections: [
    {
      id: 'button-variants',
      title: 'Button Variants',
      variant: 'demo',
      hasGroup: true,
      groupLabel: 'Button variant examples'
    },
    {
      id: 'button-sizes',
      title: 'Button Sizes',
      variant: 'demo',
      hasGroup: true,
      groupLabel: 'Button size examples'
    },
    {
      id: 'button-icons',
      title: 'Buttons with Icons',
      variant: 'demo',
      hasGroup: true,
      groupLabel: 'Button icon examples'
    },
    {
      id: 'button-states',
      title: 'Button States',
      variant: 'interactive',
      hasGroup: true,
      groupLabel: 'Button state examples'
    },
    {
      id: 'button-group',
      title: 'Button Group',
      variant: 'demo'
    },
    {
      id: 'theme-controls',
      title: 'Theme Controls',
      variant: 'feature',
      hasGroup: true,
      groupLabel: 'Theme and state controls'
    },
    {
      id: 'live-clock',
      title: 'Live Clock Component',
      variant: 'component',
      spacing: 'mt-5'
    },
    {
      id: 'team-sales',
      title: 'Team Sales Dashboard',
      variant: 'elevated',
      spacing: 'mt-5'
    }
  ]
};