// Navigation Configuration
// Centralized navigation structure for the application

export const navigationConfig = {
  logo: 'MCL',
  fixed: false,
  items: [
    { 
      id: 'components', 
      label: 'Components', 
      href: '#button-variants' 
    },
    { 
      id: 'demos', 
      label: 'Demos', 
      href: '#demos',
      children: [
        { 
          id: 'buttons', 
          label: 'Button Variants', 
          href: '#button-variants' 
        },
        { 
          id: 'clock', 
          label: 'Live Clock', 
          href: '#live-clock' 
        },
        { 
          id: 'charts', 
          label: 'Sales Chart', 
          href: '#team-sales' 
        }
      ]
    },
    { 
      id: 'form-demo', 
      label: 'Forms', 
      href: '#forms-demo'
    }
  ]
};

export const scrollConfig = {
  behavior: 'smooth',
  navHeight: 64 // Height of fixed nav for offset calculation
};