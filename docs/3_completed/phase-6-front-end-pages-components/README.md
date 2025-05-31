# Phase 6 – Front-end Pages & Components

## Goal

Implement the core user-facing pages and components for the LH3 (Larryville Hash House Harriers) application, including run creation, run details, feed functionality, and admin tools. This phase focuses on creating a complete, functional user interface that allows members to create runs, view run details, RSVP, check-in, browse community content, and manage administrative tasks.

## Key Requirements

### Functional Requirements
- **Run Creation Form** (`/runs/new`): Allow organizers to create new runs with all necessary details
- **Run Details Page** (`/runs/[id]`): Display comprehensive run information with interactive features
- **Feed Page** (`/`): Show a dynamic mix of upcoming runs and community posts
- **Admin Tools Area**: Provide administrative functionality for managing runs, attendance, and achievements
- **Global Layout Enhancement**: Improve the existing layout with proper navigation and sidebar functionality

### Technical Requirements
- Utilize existing shadcn/ui component library and design system
- Follow Next.js App Router patterns for file-system based routing
- Integrate with existing API endpoints for runs, RSVPs, and photo management
- Maintain responsive design across all screen sizes
- Implement proper TypeScript interfaces and error handling
- Follow established architecture patterns from `docs/_reference/architecture.md`

### Data Integration Requirements
- Connect to existing Prisma database schema for runs, users, RSVPs, and photos
- Integrate with Mapbox for location selection and display
- Support AWS S3 photo upload functionality
- Implement NextAuth.js authentication flows

## Target Audience

### Primary Users
- **Hash House Harriers Members**: Regular participants who need to view runs, RSVP, and check-in
- **Run Organizers**: Members who create and manage runs, including setting locations and details
- **Administrators**: Leadership members who track attendance, manage achievements, and oversee operations

### Secondary Users
- **New Members**: People exploring the community and learning about upcoming events
- **Occasional Participants**: Members who participate infrequently but need easy access to run information

## Open Questions

1. **RSVP Workflow**: Should RSVPs be immediately visible to other users, or should there be a delay/ap__proval process? Immediately.
2. **Photo Gallery Permissions**: Who can upload photos to a run? Should there be moderation or automatic approval? Anyone logged in can upload photos to a run they are attending or have attended.
3. **Admin Tool Access Control**: What specific roles/permissions should be required for different admin functions (attendance tracking vs. achievement management)? Attendance tracking requires new role: `HASH_CASH` or admin.
4. **Feed Content Prioritization**: How should the feed algorithm prioritize content (chronological, engagement-based, proximity to events)? Chronological.
5. **Mobile-First Considerations**: Given the likely mobile usage during runs, what specific mobile optimizations are needed for check-in and photo upload flows? Ease of use.
6. **Offline Functionality**: Should any features work offline (like viewing run details when at the location)? No.
7. **Notification Integration**: Should the UI include hooks for future push notification features? No.
8. **Data Retention**: How long should run data, photos, and RSVP history be retained and displayed? indefinitely.
