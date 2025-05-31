## Phase 5: Frontend - Event Listing & Viewing, Basic Layout

### Objective

Develop the main application layout and the React components for listing (Events/Index) and viewing (Events/Show) events.

### PRD Alignment

- Section 6: Front-End: React Pages & Components (Global Layout, Events/Index.tsx, EventCard.tsx, Events/Show.tsx - basic structure)

### User Stories Covered

- User Story 6: View Featured Next Upcoming Run on Feed (partially, basic display)
- User Story 7: View List of Recent Runs on Feed
- User Story 11: View Detailed Run Information Page

### Key Tasks

1.  **Global Layout (`AppLayout.tsx`):**
    - Create `app/frontend/Components/Layouts/AppLayout.tsx` (`prd.md#6.1`).
    - Include basic structure: header (logo, nav links - placeholder for now), main content area (`{children}`), footer (optional).
    - Use TailwindCSS for styling.
    - Ensure `application.tsx` uses this layout for pages (e.g., via Inertia persistent layouts or wrapping each page).
2.  **Event Index Page (`Events/Index.tsx`):**
    - Create `app/frontend/Pages/Events/Index.tsx` (`prd.md#6.2`).
    - Fetch `events` array from props.
    - Map over events and render an `<EventCard />` for each.
    - Display basic "Next Run" banner placeholder.
    - Add a link/button to navigate to "New Event" page (`/events/new`).
    - **User Story 7:** Display list of recent runs.
3.  **Event Card Component (`EventCard.tsx`):**
    - Create `app/frontend/Components/EventCard.tsx` (`prd.md#6.3`).
    - Props: `event` object.
    - Display key event details: run number, descriptor, date, time, address, RSVP/attendance counts (mocked or 0 for now), intro link.
    - Style with Tailwind.
    - Link the card to the event's show page (`/events/:id`).
4.  **Event Show Page (`Events/Show.tsx`):**
    - Create `app/frontend/Pages/Events/Show.tsx` (`prd.md#6.5`).
    - Fetch `event` object from props.
    - Display all event details similar to `EventCard` but more comprehensively.
    - Placeholder sections for RSVP, Photos, Attendance Toggle.
    - Link to "Edit Event" if authorized (placeholder for now).
    - **User Story 11:** Display comprehensive run information.
5.  **Helper for Dates/Times:**
    - Create utility functions (e.g., in `app/frontend/utils/`) for formatting dates and times consistently.

### Best Practices & Considerations

- Component-based design: Break down UI into reusable pieces.
- Props validation using TypeScript interfaces.
- Consistent styling.
- Use `lucide-react` for icons as suggested.

### Testing

- **User-Verifiable:**
  - Navigate to `/events`. See a list of event cards. Each card shows correct basic data.
  - Click on an event card. Navigate to `/events/:id`. See detailed event information.
  - The `AppLayout` (header, footer) should be visible on these pages.
  - "New Event" link on `/events` should navigate to `/events/new`.
- **Component Tests (e.g., with Jest/RTL - optional for single dev, focus on E2E):**
  - `EventCard.tsx`: Renders event data correctly.
- **System Specs (Capybara - start building these out):**
  - `spec/system/events_spec.rb`:
    - Visit event index page, see list of events.
    - Click an event, visit show page, see event details.

### Deliverables

- `AppLayout` component.
- `Events/Index.tsx` page displaying a list of events.
- `EventCard.tsx` component.
- `Events/Show.tsx` page displaying detailed event information.
