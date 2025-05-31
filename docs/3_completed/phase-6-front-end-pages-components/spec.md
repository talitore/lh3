# Technical Specification: Phase 6 Front-end Pages & Components

## Feature Scope and Functionality

### 1. Global Layout Enhancement
**Current State**: Basic layout with header and sidebar exists
**Target State**: Fully functional navigation with proper sidebar content and responsive behavior

**Functionality**:
- Enhanced sidebar with "Upcoming", "Stats", and "Admin Tools" sections
- Improved header navigation with user authentication status
- Responsive design that works on mobile and desktop
- Proper routing integration with Next.js App Router

### 2. Run Creation Form (`/runs/new`)
**Functionality**:
- Form fields: Run Number, Descriptor, Date/Time picker, Address + Map integration, Intro-link URL
- Real-time address validation with Mapbox geocoding
- Interactive map for precise location selection
- Form validation with proper error handling
- Integration with existing API endpoints

### 3. Run Details Page (`/runs/[id]`)
**Functionality**:
- Display all run information (number, descriptor, date/time, location)
- Quick RSVP functionality with real-time updates
- Self-check-in CTA (visible only on event day)
- "What's Hashing?" information icon with explanatory content
- Photo album gallery component with upload functionality
- Attendee list and RSVP status display

### 4. Feed Page (`/`)
**Functionality**:
- Card-based layout displaying mix of content
- "Next Run" card with prominent display
- Community posts integration (future-ready structure)
- Infinite scroll or pagination for performance
- Filter and sort options

### 5. Admin Tools Area
**Functionality**:
- Attendance tracking interface
- Hash Cash management system
- Achievement management tools
- Role-based access control
- Data export capabilities

## UI Treatment Options

### Option 1: Tab-Based Navigation
**Layout**: Horizontal tabs for main sections (Feed, Runs, Admin)
**Pros**:
- Familiar pattern for users
- Easy to implement with shadcn/ui Tabs component
- Clear section separation
**Cons**:
- Limited space for tab labels on mobile
- Less flexible for future feature additions
**Best for**: Users who prefer traditional web navigation patterns

### Option 2: Sidebar Navigation (Current + Enhanced)
**Layout**: Collapsible sidebar with hierarchical menu structure
**Pros**:
- More space for navigation items
- Better mobile experience with overlay behavior
- Scalable for future features
- Consistent with current implementation
**Cons**:
- Requires more complex state management
- May feel less familiar to some users
**Best for**: Power users and mobile-first experience

### Option 3: Bottom Navigation (Mobile-First)
**Layout**: Fixed bottom navigation bar with primary actions
**Pros**:
- Excellent mobile experience
- Thumb-friendly navigation
- Modern app-like feel
**Cons**:
- Less suitable for desktop
- Limited number of primary actions
- Requires responsive design complexity
**Best for**: Mobile-heavy usage patterns

## Component Architecture Decisions

### RSVP Component Design Options

**Option A: Inline Button Group**
```
[Yes] [Maybe] [No] - Current: 12 Yes, 3 Maybe, 1 No
```
**Trade-offs**: Simple, immediate feedback, but takes more horizontal space

**Option B: Dropdown Selection**
```
[RSVP: Yes ▼] - 16 total responses
```
**Trade-offs**: Compact, but requires extra click to see details

**Option C: Modal Dialog**
```
[RSVP] → Opens modal with options and current status
```
**Trade-offs**: More space for information, but adds interaction complexity

### Photo Gallery Design Options

**Option A: Grid Layout with Lightbox**
- Thumbnail grid with click-to-expand
- Best for: Large number of photos, desktop viewing

**Option B: Horizontal Scroll Carousel**
- Instagram-style horizontal scroll
- Best for: Mobile viewing, limited photos

**Option C: Masonry Layout**
- Pinterest-style variable height grid
- Best for: Photos of different aspect ratios

## Technical Implementation Details

### State Management
- Use React Context for global layout state (sidebar open/closed)
- Local component state for form data and UI interactions
- Server state management via existing API integration patterns

### Performance Considerations
- Implement lazy loading for photo galleries
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports for admin tools

### Accessibility Requirements
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

## Integration Points

### Existing API Endpoints
- `POST /api/runs` - Run creation
- `GET /api/runs/[id]` - Run details
- `PUT /api/runs/[id]/rsvp` - RSVP management
- `POST /api/runs/[id]/photos/*` - Photo upload

### External Services
- Mapbox GL JS for interactive maps
- AWS S3 for photo storage
- NextAuth.js for authentication

## Decision Required

**Recommended Approach**: Option 2 (Enhanced Sidebar Navigation) for main navigation, combined with Option A (Inline Button Group) for RSVP and Option A (Grid Layout with Lightbox) for photo galleries.

**Rationale**: This approach builds on the existing implementation, provides the best balance of usability and scalability, and aligns with the current shadcn/ui component patterns already established in the codebase.

**User Decision Needed**: Option 2 (Enhanced Sidebar Navigation) for main navigation, combined with Option A (Inline Button Group) for RSVP and Option A (Grid Layout with Lightbox) for photo galleries.
