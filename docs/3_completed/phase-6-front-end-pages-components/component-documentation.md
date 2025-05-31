# Phase 6 Component Documentation

## Overview

This document provides comprehensive documentation for all components implemented in Phase 6 of the LH3 application. These components follow shadcn/ui patterns and include full accessibility support, mobile optimization, and TypeScript integration.

## Core Components

### RSVPButtons Component

**Location**: `src/components/ui/rsvp-buttons.tsx`

**Purpose**: Provides interactive RSVP functionality with optimistic updates and real-time feedback.

**Features**:
- Two variants: `default` (full buttons) and `compact` (icon buttons)
- Optimistic UI updates with automatic rollback on errors
- Full accessibility support with ARIA labels and keyboard navigation
- Touch-friendly design with 44px minimum touch targets
- Success animations and loading states
- Real-time count updates

**Usage**:
```tsx
import { RSVPButtons } from '@/components/ui/rsvp-buttons'

<RSVPButtons
  runId="run-123"
  currentUserRsvp="YES"
  rsvpCounts={{ yes: 5, maybe: 2, no: 1 }}
  onRsvpChange={(status, counts) => console.log(status, counts)}
  variant="default" // or "compact"
  size="default" // or "sm", "lg"
/>
```

**Props**:
- `runId`: string - The ID of the run
- `currentUserRsvp`: RSVPStatus | null - Current user's RSVP status
- `rsvpCounts`: RSVPCounts - Current RSVP counts
- `onRsvpChange`: (status, counts) => void - Callback for RSVP changes
- `variant`: "default" | "compact" - Display variant
- `size`: "default" | "sm" | "lg" - Button size
- `disabled`: boolean - Disable all interactions

### PhotoGallery Component

**Location**: `src/components/ui/photo-gallery.tsx`

**Purpose**: Displays and manages photo galleries with upload functionality and lightbox viewing.

**Features**:
- Grid layout with responsive design
- Lightbox with keyboard navigation (arrow keys, escape)
- Photo upload with progress tracking and S3 integration
- Full accessibility with proper ARIA labels and focus management
- Lazy loading with Suspense support
- Touch-friendly interactions

**Usage**:
```tsx
import { PhotoGallery } from '@/components/ui/photo-gallery'

<PhotoGallery
  runId="run-123"
  photos={photoArray}
  onPhotosChange={(photos) => setPhotos(photos)}
  allowUpload={true}
  maxPhotos={50}
/>
```

**Props**:
- `runId`: string - The ID of the run
- `photos`: Photo[] - Array of photo objects
- `onPhotosChange`: (photos) => void - Callback for photo changes
- `allowUpload`: boolean - Enable photo upload functionality
- `maxPhotos`: number - Maximum number of photos allowed
- `className`: string - Additional CSS classes

### Loading Animations

**Location**: `src/components/ui/loading-animations.tsx`

**Purpose**: Provides a comprehensive set of loading and animation components.

**Components**:

#### Spinner
```tsx
<Spinner size="md" className="text-blue-500" />
```

#### FadeIn
```tsx
<FadeIn delay={300}>
  <div>Content that fades in</div>
</FadeIn>
```

#### SlideIn
```tsx
<SlideIn direction="up" delay={100}>
  <div>Content that slides in</div>
</SlideIn>
```

#### SuccessAnimation
```tsx
<SuccessAnimation className="my-4" />
```

#### LoadingDots
```tsx
<LoadingDots className="text-gray-500" />
```

### SkipLink Component

**Location**: `src/components/ui/skip-link.tsx`

**Purpose**: Provides accessible skip navigation for keyboard users.

**Usage**:
```tsx
import { SkipLink } from '@/components/ui/skip-link'

<SkipLink href="#main-content">Skip to main content</SkipLink>
```

## Page Components

### Run Details Page

**Location**: `src/app/runs/[id]/page.tsx`

**Features**:
- Complete run information display
- Integrated RSVP functionality
- Photo gallery with upload
- Attendee list organized by RSVP status
- Check-in functionality (time-restricted)
- Run editing for organizers
- Mobile-responsive design

### Enhanced Sidebar

**Location**: `src/components/layout/enhanced-sidebar.tsx`

**Features**:
- Upcoming runs section
- Navigation links
- Mobile-responsive with overlay
- Keyboard navigation support
- Proper ARIA landmarks

## Accessibility Features

All Phase 6 components include:

### Keyboard Navigation
- Tab navigation through all interactive elements
- Arrow key navigation in photo gallery lightbox
- Enter/Space activation for buttons
- Escape key to close modals/lightboxes

### Screen Reader Support
- Comprehensive ARIA labels and roles
- Live regions for dynamic content updates
- Proper heading hierarchy
- Descriptive alt text for images

### Touch Accessibility
- Minimum 44px touch targets
- Touch-manipulation CSS for better mobile interaction
- Proper spacing between interactive elements

### Focus Management
- Visible focus indicators
- Focus restoration after modal close
- Logical tab order
- Skip links for main content

## Performance Optimizations

### Lazy Loading
- PhotoGallery component is lazy-loaded with Suspense
- Dynamic imports for heavy components
- Optimized bundle splitting

### Optimistic Updates
- RSVP changes show immediately with rollback on error
- Photo uploads show progress with optimistic UI
- Smooth animations and micro-interactions

### Loading States
- Skeleton components for loading states
- Progress indicators for uploads
- Comprehensive error handling

## Testing

### Unit Tests
- Complete test coverage for all components
- Accessibility testing with jest-axe
- User interaction testing
- Error handling validation

### Test Files
- `src/components/ui/rsvp-buttons.test.tsx`
- `src/components/ui/photo-gallery.test.tsx`
- `src/components/ui/loading-animations.test.tsx`
- `src/components/ui/accessibility.test.tsx`
- `src/app/runs/[id]/page.test.tsx`

## Development Guidelines

### Component Standards
- Follow shadcn/ui patterns and conventions
- Use proper forwardRef for wrapper components
- Implement comprehensive error boundaries
- Include proper ARIA labels and accessibility features
- Use TypeScript for all props and interfaces

### Code Organization
- Components in `src/components/ui/`
- Page components in `src/app/`
- Shared types in component files or separate type files
- Consistent naming conventions

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS custom properties for theme values

## Future Enhancements

### Potential Improvements
- Virtual scrolling for large photo galleries
- Advanced photo editing capabilities
- Real-time collaboration features
- Enhanced animation library
- Progressive Web App features

### Maintenance Notes
- Regular accessibility audits
- Performance monitoring
- User feedback integration
- Component library updates
