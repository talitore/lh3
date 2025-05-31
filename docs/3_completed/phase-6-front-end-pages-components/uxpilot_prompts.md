# UX Pilot Prompts: Phase 6 Front-end Pages & Components

## Run Creation Form (`/runs/new`)

### Prompt 1: Desktop Layout
```
Create a clean, modern run creation form for a Hash House Harriers running club web application. The form should have a white background with subtle shadows and rounded corners. Include the following elements arranged vertically with proper spacing:

- Page header with "Create New Run" title and a secondary "Cancel" button in the top right
- Two-column layout for the first row: "Run #" (small numeric input, 80px wide) and "Descriptor" (larger text input taking remaining width)
- Full-width "Date & Time" section with side-by-side date and time pickers
- "Location" section containing:
  - Address search input with placeholder "Search for address..." and a "Use Current Location" button
  - Large interactive map component (400px height) with a draggable red marker
- Optional "Intro Link" text input for URLs
- Primary "Create Run" button at bottom right, styled in blue with white text

Use a modern, clean design system similar to shadcn/ui with proper form validation states. Ensure 16px padding throughout and consistent 12px spacing between form elements. The overall layout should be contained within a max-width of 800px and centered on the page.
```

### Prompt 2: Mobile-Optimized Layout
```
Design a mobile-first run creation form for a Hash House Harriers app. Create a single-column, touch-friendly layout optimized for phones:

- Sticky header with "Create New Run" title and "Cancel" link
- Stack all form elements vertically with 16px spacing
- "Run #" and "Descriptor" fields stacked (not side-by-side)
- Large, thumb-friendly date and time picker buttons
- Address search with autocomplete dropdown
- Compact map view (250px height) with easy-to-tap marker
- Full-width "Create Run" button at bottom with 48px height for easy tapping

Use large, readable fonts (16px minimum), high contrast colors, and ensure all interactive elements are at least 44px in height. Include subtle loading states and success animations. The design should work well on screens as small as 320px wide.
```

### Prompt 3: Progressive Enhancement Version
```
Create an accessible, progressively enhanced run creation form that works without JavaScript. Design a traditional HTML form layout with:

- Clear, semantic form structure with proper labels
- Fieldset groupings for related inputs (Basic Info, Location, Additional Details)
- Server-side validation error states shown inline
- Fallback address input (text field) when map/geocoding isn't available
- Submit button that shows loading state during form submission
- Clear visual hierarchy using typography and spacing
- High contrast mode support with proper focus indicators

Style with a clean, professional appearance using system fonts and ensure WCAG 2.1 AA compliance. Include helpful placeholder text and field descriptions. The form should be fully functional even with CSS disabled.
```

## Run Details Page (`/runs/[id]`)

### Prompt 1: Desktop Card Layout
```
Design a comprehensive run details page for a Hash House Harriers web application. Create a card-based layout with:

- Hero section showing run title, number, date/time, and location with a subtle background gradient
- Prominent RSVP section with three buttons (Yes/Maybe/No) showing current counts and user's selection highlighted
- "Check In" call-to-action card (only visible on event day) with running emoji and encouraging text
- Information icon for "What's Hashing?" that opens a helpful tooltip or modal
- Photo gallery section with thumbnail grid (3-4 photos per row) and upload button
- Attendee list showing profile pictures and names in a clean grid
- Map component showing the run location with custom marker

Use a modern card design with subtle shadows, rounded corners, and proper spacing. Implement a cohesive color scheme with blue as the primary color and green for positive actions. Ensure the layout is scannable and information hierarchy is clear.
```

### Prompt 2: Mobile-First Details View
```
Create a mobile-optimized run details page that prioritizes the most important information:

- Compact header with run title and essential details (date, time, location)
- Large, prominent RSVP buttons that are easy to tap
- Collapsible sections for additional details to save screen space
- Horizontal scrolling photo gallery with smooth touch interactions
- Quick actions bar at the bottom with "Check In", "Share", and "Directions" buttons
- Progressive disclosure pattern - show essential info first, details on demand

Design for thumb navigation with all primary actions in the bottom half of the screen. Use bold typography for key information and subtle animations for state changes. Ensure the page loads quickly and works well on slower connections.
```

### Prompt 3: Event Day Optimized View
```
Design a special "event day" version of the run details page optimized for use during the actual run:

- Large, prominent "Check In" button at the top (primary action)
- Essential run info in a compact, glanceable format
- Quick photo upload with camera integration
- Simplified navigation to reduce cognitive load
- Offline-ready design with cached content indicators
- Emergency contact information easily accessible
- Weather information and any last-minute updates prominently displayed

Use high contrast colors and large touch targets. Minimize data usage and battery drain. Include helpful contextual information like "You're 0.2 miles from the start location" if location services are available.
```

## Feed Page (`/`)

### Prompt 1: Social Media Inspired Feed
```
Create a social media style feed for a Hash House Harriers community app:

- "Next Run" card prominently featured at the top with eye-catching design and quick RSVP options
- Mixed content cards including:
  - Recent run photos with engagement metrics (likes, comments)
  - Achievement announcements with celebration graphics
  - Community updates and announcements
  - Weekly/monthly statistics in visually appealing charts
- Infinite scroll with smooth loading animations
- Floating action button for creating new runs (for organizers)
- Filter options in a collapsible header (Upcoming Runs, Photos, Achievements)

Use a Pinterest/Instagram inspired card layout with varying heights based on content. Implement engaging micro-animations and a warm, community-focused color palette. Ensure content is easily shareable and discoverable.
```

### Prompt 2: Dashboard-Style Feed
```
Design a dashboard-style feed that emphasizes information density and quick scanning:

- Grid layout with consistent card sizes for different content types
- "Next Run" as a hero card spanning multiple columns
- Quick stats widgets showing member count, upcoming events, recent activity
- Tabbed interface for different content categories (Runs, Photos, Stats, Admin)
- Sidebar with upcoming events calendar and member highlights
- Search and filter functionality prominently placed

Use a clean, professional design with plenty of white space. Implement data visualization elements like progress bars and simple charts. Focus on information hierarchy and quick decision-making for busy users.
```

### Prompt 3: Mobile-First Activity Stream
```
Create a mobile-optimized activity stream that works well for on-the-go browsing:

- Single column layout with full-width cards
- Pull-to-refresh functionality with satisfying animation
- Sticky "Next Run" summary at the top
- Swipeable cards for quick actions (RSVP, like, share)
- Bottom navigation for main app sections
- Progressive loading with skeleton screens
- Offline reading capability with sync indicators

Design for one-handed use with important actions in thumb-reach zones. Use bold imagery and clear typography that's readable in various lighting conditions. Implement smooth scrolling and responsive touch interactions.
```

## Admin Tools Area

### Prompt 1: Professional Dashboard
```
Design a comprehensive admin dashboard for Hash House Harriers leadership:

- Clean, professional layout with sidebar navigation for different admin functions
- Overview dashboard with key metrics (attendance trends, member engagement, upcoming events)
- Attendance tracking interface with searchable member list and check-in status
- Hash Cash management with transaction history and balance tracking
- Achievement management system with badge creation and assignment tools
- Data export functionality with date range selectors and format options
- User management with role assignment and permission controls

Use a business application design pattern with data tables, charts, and form interfaces. Implement proper loading states and error handling. Ensure the interface scales well for different screen sizes while maintaining functionality.
```

### Prompt 2: Mobile Admin Interface
```
Create a mobile-friendly admin interface for managing runs on-the-go:

- Simplified navigation with bottom tab bar for main admin functions
- Quick actions for common tasks (mark attendance, update run details)
- Streamlined forms optimized for mobile input
- Photo approval workflow with swipe gestures
- Push notification management interface
- Emergency contact and communication tools

Focus on the most critical admin tasks that need to be done during or immediately after runs. Use large, touch-friendly controls and minimize text input requirements. Implement voice-to-text capabilities where appropriate.
```

### Prompt 3: Role-Based Admin Views
```
Design adaptive admin interfaces that change based on user permissions:

- Organizer view: Focus on run creation, attendance tracking, and basic member management
- Treasurer view: Emphasize Hash Cash management, payment tracking, and financial reporting
- Grand Master view: Full access with member management, achievement systems, and club settings
- Hash Master view: Run-specific tools with trail planning and logistics features

Each role should have a customized dashboard showing relevant metrics and quick actions. Use progressive disclosure to show advanced features only to users with appropriate permissions. Implement clear visual indicators for different permission levels.
```

## Design System Notes

### Color Palette Recommendations
- Primary: Blue (#3B82F6) for main actions and navigation
- Secondary: Green (#10B981) for positive actions (RSVP Yes, Check In)
- Warning: Orange (#F59E0B) for Maybe responses and cautions
- Error: Red (#EF4444) for No responses and errors
- Neutral: Gray scale (#F9FAFB to #111827) for backgrounds and text

### Typography Scale
- Headings: Inter font family, weights 600-700
- Body text: Inter font family, weight 400
- Captions: Inter font family, weight 500
- Mobile minimum: 16px for body text, 14px for captions

### Component Consistency
All prompts should reference shadcn/ui design patterns for consistency with the existing codebase, including proper use of CSS variables for theming and responsive design patterns.
