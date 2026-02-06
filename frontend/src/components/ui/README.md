# UI Components

This directory contains all reusable UI components with visual polish and animations.

## Components Overview

### Gradient Components
- `GradientButton`: Button with gradient styling and hover animations
- `GradientCard`: Card with gradient styling and interactive effects
- `GradientInput`: Input field with gradient styling and focus states

### Typography Components
- `Typography`: Base typography component with various variants
- `H1-H6`: Heading components
- `Body`, `Caption`, `Label`: Text components for different purposes

### Spacing Components
- `Spacing`: Flexible spacing component using design tokens
- `Spacer`: Empty space component
- `Container`: Layout container with consistent padding
- `GridLayout`: Grid layout with consistent spacing

### Animation Components
- `Transitions`: Various transition animations (FadeIn, SlideIn, ScaleIn, etc.)
- `Skeleton`: Loading skeletons with pulse/wave animations
- `LoadingSpinner`: Animated loading indicators

## Usage

### GradientButton
```tsx
import { GradientButton } from '@/components/ui/gradient-button';

<GradientButton variant="primary" onClick={() => console.log('clicked')}>
  Click Me
</GradientButton>
```

### Typography
```tsx
import { H1, Body } from '@/components/ui/typography';

<H1>Heading 1</H1>
<Body>Body text with proper styling</Body>
```

### Spacing
```tsx
import { Spacing, Spacer } from '@/components/ui/spacing';

<Spacing size="md" direction="vertical">
  <div>Content with spacing</div>
</Spacing>
<Spacer size="lg" direction="vertical" />
```

## Accessibility

All components follow accessibility best practices:
- Proper semantic HTML
- Focus management
- Reduced motion support
- Color contrast compliance
- Keyboard navigation

## Responsive Design

Components adapt to different screen sizes using responsive design tokens and CSS media queries.