## Phase 7: RSVP Functionality

### Objective

Implement the ability for authenticated users to RSVP to events and for those RSVPs to be displayed.

### PRD Alignment

- Section 5.2: `RsvpsController`
- Section 6.7: `RSVPButton.tsx`
- Section 6.3 (`EventCard.tsx`): Display RSVP counts.
- Section 6.5 (`Events/Show.tsx`): Display RSVP list and attendance toggle placeholder.

### User Stories Covered

- User Story 14: RSVP to a Run (Authenticated User)
- User Story 15: View RSVP Counts and Attendee List on Run Detail Page (RSVP counts part, attendee list later)

### Key Tasks

1.  **`RsvpsController` Implementation:**
    - Implement `create` action: Authenticate user, find event, create/update RSVP (`@event.rsvps.find_or_initialize_by(user: current_user).update(status: params[:status])`). Return JSON response (`prd.md#5.2`).
    - Implement `update` action (can be merged with `create` if using upsert logic, or separate for distinct status changes).
    - Refine `RsvpPolicy` (e.g., user can only manage their own RSVP). Authorize actions.
    - Add `set_event` before_action.
2.  **`RSVPButton.tsx` Component:**
    - Create `app/frontend/Components/RSVPButton.tsx` (`prd.md#6.7`).
    - Props: `eventId`, `initialUserRsvpStatus`.
    - State: current RSVP status.
    - On click, makes API call to `RsvpsController` (`POST /events/:eventId/rsvps` or `PATCH` to update).
    - Updates button text/style based on status.
    - For now, focus on "RSVP (Yes)" / "Cancel RSVP (Pending/No)" toggle.
3.  **Integrate `RSVPButton`:**
    - Add to `EventCard.tsx`.
    - Add to `Events/Show.tsx`.
    - Pass `eventId` and current user's RSVP status if available (requires backend to provide this).
4.  **Display RSVP Counts:**
    - In `Event` model, add methods like `rsvp_yes_count`, `rsvp_maybe_count`, `rsvp_no_count`. Initially simple counts, later can be cached (`prd.md#7.2`).
    - Update `EventsController#index` and `show` to include these counts in the JSON props (e.g., `event.as_json(methods: [:rsvp_yes_count])`).
    - Display these counts in `EventCard.tsx` and `Events/Show.tsx`.
5.  **Display RSVP List (Basic):**
    - In `EventsController#show`, include RSVP details in the event JSON: `include: { rsvps: { include: :user } }`.
    - In `Events/Show.tsx`, display a simple list of users who RSVP'd "yes".

### Testing

- **User-Verifiable:**
  - **US14:** On an event card or show page, as a logged-in user, click "RSVP". Button changes, count updates. Click again to cancel/change.
  - Verify RSVP is recorded in the database with correct user, event, and status.
  - **US15 (Counts):** RSVP counts on event cards and show page update correctly.
  - On event show page, see a list of users who RSVP'd "Yes".
- **Controller Specs (RSpec):**
  - `RsvpsController`: Test `create`/`update` for valid/invalid requests, authorization, RSVP record changes.
- **System Specs (Capybara):**
  - `spec/system/rsvp_spec.rb`: User logs in, RSVPs to an event, sees status change. Cancels RSVP.

### Deliverables

- Functional RSVP system (create/update RSVPs).
- `RSVPButton.tsx` component.
- RSVP counts displayed on events.
- Basic list of "yes" RSVPs on event show page.
