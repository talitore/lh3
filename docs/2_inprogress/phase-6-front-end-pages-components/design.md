# Design Considerations: Phase 6 Front-end Pages & Components

## Architectural Thoughts

### SLC Principles Application
Following the Simple, Lovable, Complete (SLC) framework:

**Simple**:
- Focus on core user journeys: create run → view run → RSVP → attend
- Minimize cognitive load with clear, single-purpose pages
- Use familiar UI patterns from shadcn/ui component library

**Lovable**:
- Delight through smooth animations and micro-interactions
- Personal touches like showing user's RSVP history
- Community feeling through shared photo galleries
- Responsive design that works beautifully on mobile during runs

**Complete**:
- Each page serves a complete user need, not a partial workflow
- Run creation includes everything needed to publish a run
- Run details provide all information needed to participate
- Admin tools provide complete management capabilities

### Component Interaction Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    Global Layout                            │
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │   Header    │  │              Main Content           │   │
│  │  - Logo     │  │  ┌─────────────────────────────────┐ │   │
│  │  - Nav      │  │  │         Page Content            │ │   │
│  │  - User     │  │  │  - Run Form                     │ │   │
│  └─────────────┘  │  │  - Run Details                  │ │   │
│  ┌─────────────┐  │  │  - Feed                         │ │   │
│  │  Sidebar    │  │  │  - Admin Tools                  │ │   │
│  │  - Upcoming │  │  └─────────────────────────────────┘ │   │
│  │  - Stats    │  └─────────────────────────────────────────┘   │
│  │  - Admin    │                                              │
│  └─────────────┘                                              │
└─────────────────────────────────────────────────────────────┘
```

### State Management Architecture

```typescript
// Global Layout State
interface LayoutState {
  sidebarOpen: boolean;
  currentUser: User | null;
  adminMode: boolean;
}

// Page-Level State Examples
interface RunFormState {
  formData: RunFormData;
  isSubmitting: boolean;
  validationErrors: Record<string, string>;
  mapPosition: { lat: number; lng: number };
}

interface RunDetailsState {
  run: RunWithDetails;
  userRsvp: RsvpStatus | null;
  photos: Photo[];
  isCheckInAvailable: boolean;
}
```

## Visual Design Sketches

### Run Creation Form Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Create New Run                                    [Cancel] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Run #: [____]     Descriptor: [________________]           │
│                                                             │
│  Date & Time: [Date Picker] [Time Picker]                  │
│                                                             │
│  Location:                                                  │
│  Address: [Search for address...        ] [Use Current]    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Map View                             │ │
│  │              📍 Draggable Marker                        │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Intro Link (optional): [https://...]                      │
│                                                             │
│                              [Create Run]                  │
└─────────────────────────────────────────────────────────────┘
```

### Run Details Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Feed                                             │
├─────────────────────────────────────────────────────────────┤
│  Run #42: "Downtown Discovery"              [Edit] [Share]  │
│  📅 Saturday, Jan 15, 2024 at 6:00 PM                      │
│  📍 Massachusetts & 9th St, Lawrence, KS                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  RSVP Status: [Yes] [Maybe] [No]                       │ │
│  │  Current: 12 Yes, 3 Maybe, 1 No                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🏃‍♂️ Check In (Available on event day)                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ℹ️ What's Hashing? [Info Icon]                             │
│                                                             │
│  📸 Photos (3)                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐                                   │
│  │ 📷  │ │ 📷  │ │ 📷  │ [+ Upload]                        │
│  └─────┘ └─────┘ └─────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

### Feed Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  LH3 Feed                                      [+ New Run]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🏃‍♂️ NEXT RUN - Run #42                                  │ │
│  │  Downtown Discovery                                     │ │
│  │  Saturday, Jan 15 at 6:00 PM                           │ │
│  │  📍 Massachusetts & 9th St                              │ │
│  │  [Quick RSVP: Yes] [Maybe] [No]                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📸 Photos from Run #41                                 │ │
│  │  "Great turnout last week!"                            │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐                               │ │
│  │  │ 📷  │ │ 📷  │ │ 📷  │                               │ │
│  │  └─────┘ └─────┘ └─────┘                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📊 Weekly Stats                                        │ │
│  │  Average attendance: 15 hashers                        │ │
│  │  Most active: Trail Master Tom                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Design Patterns

### Responsive Breakpoints
```css
/* Mobile First Approach */
.container {
  /* Mobile: Stack vertically */
  @media (min-width: 768px) {
    /* Tablet: Side-by-side with margins */
  }
  @media (min-width: 1024px) {
    /* Desktop: Full layout with sidebar */
  }
}
```

### Color and Theming Strategy
- Leverage existing shadcn/ui CSS variables for consistency
- Hash House Harriers brand colors (RAINBOW) as accent colors
- Dark mode support through CSS variables
- High contrast mode for accessibility

### Animation and Micro-interactions
- Smooth transitions for sidebar open/close (300ms ease-in-out)
- Loading states for form submissions and data fetching
- Success animations for RSVP confirmations
- Photo upload progress indicators

## Technical Design Decisions

### Form Validation Strategy
- Client-side validation with Zod schemas (reuse existing patterns)
- Real-time validation feedback
- Server-side validation as backup
- Accessible error messaging

### Photo Upload UX Flow
1. Click upload area or drag-and-drop
2. Show immediate preview with progress bar
3. Background upload to S3 with presigned URLs
4. Success confirmation with thumbnail in gallery
5. Error handling with retry options

### Mobile-First Considerations
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures for photo gallery navigation
- Pull-to-refresh for feed updates
- Offline state indicators

## Performance Optimization

### Code Splitting Strategy
```typescript
// Lazy load admin components
const AdminTools = lazy(() => import('@/components/admin/AdminTools'));

// Lazy load photo gallery
const PhotoGallery = lazy(() => import('@/components/ui/photo-gallery'));
```

### Image Optimization
- Next.js Image component for automatic optimization
- Progressive loading for photo galleries
- WebP format with fallbacks
- Responsive image sizes

## Accessibility Design

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for main content
- Focus indicators clearly visible
- Escape key closes modals/overlays

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Live regions for dynamic content updates
- Alternative text for all images

This design approach prioritizes user experience while maintaining technical excellence and accessibility standards, ensuring the application serves all Hash House Harriers members effectively.
