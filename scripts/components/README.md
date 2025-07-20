# Scripts Components

This directory contains utility components and examples for development and testing purposes. These components are **not** part of the main application but serve as references and tools for developers.

## Components

### OptimizedTeamMember.jsx

A production-ready team member profile component that demonstrates the proper usage of the WebP image optimization system with real team member data for Jay Figueroa.

**Features:**
- ✅ Optimized WebP images with responsive breakpoints
- ✅ Complete team member profile layout
- ✅ Contact information and actions
- ✅ Debug mode for development
- ✅ Full accessibility support
- ✅ Theme-aware styling

**Usage:**
```jsx
import OptimizedTeamMember from '../scripts/components/OptimizedTeamMember';

// Basic usage
<OptimizedTeamMember />

// With debug information
<OptimizedTeamMember showDebugInfo={true} />
```

**Data Structure:**
The component uses Jay Figueroa's complete profile data including:
- Personal information (name, role, region, join date)
- Professional background and bio
- Core skills and competencies
- Key achievements and milestones
- Contact information (email, phone, LinkedIn)
- Optimized profile image using the WebP system

**Image Optimization Features:**
- WebP format with PNG fallback
- Responsive images for different screen sizes
- Lazy loading for performance
- Proper accessibility attributes
- Automatic browser support detection

**Performance Benefits:**
- 30-40% smaller file sizes with WebP
- Responsive images reduce bandwidth usage
- Lazy loading improves initial page load
- Async decoding prevents UI blocking

## Usage Guidelines

1. **Development**: Use these components to test new features and understand implementation patterns
2. **Reference**: Copy patterns and approaches to main application components
3. **Testing**: Validate optimization systems and performance improvements
4. **Documentation**: Examples serve as living documentation for best practices

## File Structure

```
scripts/
├── components/
│   ├── README.md                  # This file
│   └── OptimizedTeamMember.jsx    # Jay Figueroa profile component
└── convert-images.js              # Image optimization build script
```

## Integration with Main App

To use these patterns in the main application:

1. Copy the component structure to `src/components/`
2. Import and use the optimized image hooks
3. Follow the accessibility and performance patterns
4. Adapt the styling to match your design system

## Development Notes

- Components in this directory should not be imported into the main application
- Use absolute imports when referencing main app components
- Include comprehensive documentation and examples
- Focus on demonstrating best practices and optimization techniques