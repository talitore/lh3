## Phase 9: Attendance Tracking (Basic Check-in)

### Objective

Implement basic attendance tracking where users can mark themselves present on the day of the event.

### PRD Alignment

- Section 5.2 `RsvpsController` (update `attended_at`)
- Section 6.5.1 Self‐Check-In / `AttendanceToggle.tsx`
- Section 6.7 `AttendanceToggle.tsx` (reused name, but specifically for check-in)

### User Stories Covered

- User Story 16: Check-in to a Run on Event Day (Authenticated User)

### Key Tasks

1.  **Update `Rsvp` Model & Controller:**
    - Ensure `Rsvp` model has `attended_at:datetime` field (already in PRD `prd.md#4.3`).
    - Modify `RsvpsController#update` (or a new dedicated action like `check_in`) to handle updating `attended_at` for a user's RSVP to the current time. It should find the RSVP by `event_id` and `user_id`.
    - Update `RsvpPolicy` if needed for this action.
2.  **`AttendanceToggle.tsx` Component:**
    - Create `app/frontend/Components/AttendanceToggle.tsx` (`prd.md#6.7` and `prd.md#6.5.1`).
    - Props: `eventId`, `userRsvp` (containing `id` and `attended_at`).
    - Logic:
      - If `userRsvp.attended_at` is present, show "You were here at HH:MM".
      - Else, show "Mark Me Present" button.
      - Button click calls `PATCH /events/:eventId/rsvps/:rsvpId` (or a dedicated check-in route) with `{ attended_at: new Date().toISOString() }`.
      - Conditionally render this component only if it's the event day (add helper `isEventDay(eventDate)`).
3.  **Integrate `AttendanceToggle`:**
    - Add to `Events/Show.tsx`. Pass necessary props. This means the `event` prop for `Events/Show.tsx` must include the current user's RSVP details for that event.
    - `EventsController#show` needs to ensure the `@event` JSON includes `current_user_rsvp: @event.rsvps.find_by(user: current_user)` or similar.

### Testing

- **User-Verifiable:**
  - **US16:** Create an event for today. As a logged-in user who has RSVP'd, navigate to the event show page.
  - Click "Mark Me Present". See confirmation.
  - Verify `attended_at` is updated in the database for the user's RSVP.
  - Refresh page, see "You were here..." message.
  - For an event on a different day, the button should not be active or visible.
- **System Specs (Capybara):**
  - `spec/system/attendance_spec.rb`: User RSVPs, then on event day, checks in.

### Deliverables

- Basic attendance check-in functionality.
- `AttendanceToggle.tsx` component.
