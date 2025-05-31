## Phase 6: Event Creation & Editing (Frontend & Backend)

### Objective

Implement the functionality for creating and editing events, including the frontend form and backend controller actions.

### PRD Alignment

- Section 5.1: `EventsController` (create, new, edit, update, destroy actions)
- Section 6.4: `EventForm.tsx` Component
- Section 6 (Folder structure): `app/frontend/ZodSchemas/eventSchema.ts`

### User Stories Covered

- User Story 1: Navigate to Create New Run Page
- User Story 5: Cancel Creating a New Run (navigation part)
- User Story 12: Create a New Run with Full Details
- User Story 13: Edit an Existing Run (Organizer Only) (Form part and basic save)

### Key Tasks

1.  **Event Schema (`eventSchema.ts`):**
    - Create `app/frontend/ZodSchemas/eventSchema.ts` with Zod schema for event form validation (`prd.md#6.4`).
2.  **Event Form Component (`EventForm.tsx`):**
    - Create `app/frontend/Components/EventForm.tsx` (`prd.md#6.4`).
    - Use React Hook Form with `zodResolver` and `eventSchema`.
    - Include fields for: Run Number, Descriptor, Date, Time, Address (basic text input for now), Intro Link.
    - Props: `onSubmit`, `initialData` (for editing), `submitButtonText`.
3.  **New Event Page (`Events/New.tsx`):**
    - Create `app/frontend/Pages/Events/New.tsx`.
    - Render `<EventForm />`.
    - Handle form submission: `Inertia.post('/events', data)`.
    - Handle errors from backend and display them.
    - **User Story 1:** Navigation to this page already exists.
4.  **Edit Event Page (`Events/Edit.tsx`):**
    - Create `app/frontend/Pages/Events/Edit.tsx`.
    - Fetch event data (passed as prop from controller's `edit` action).
    - Render `<EventForm />` with `initialData`.
    - Handle form submission: `Inertia.put(`/events/${event.id}`, data)`.
5.  **Update `EventsController`:**
    - Implement `create` action: Authorize, build event with `current_user.created_events.build`, save, handle success (redirect to show) and failure (re-render new with errors) (`prd.md#5.1`).
    - Implement `edit` action: `set_event`, authorize, render `Events/Edit` with event prop.
    - Implement `update` action: `set_event`, authorize, update event, handle success/failure.
    - Implement `destroy` action: `set_event`, authorize, destroy event, redirect to index.
    - Refine `EventPolicy` for `create?`, `edit?`, `update?`, `destroy?` (e.g., only creator can edit/update/destroy).
6.  **Address Input & Map Picker (Basic Stub):**
    - Create `app/frontend/Components/AddressInput.tsx` and `MapPicker.tsx` stubs. For now, `AddressInput` can be a simple text field. Geocoding on backend will handle lat/lng from this address string. Full map integration deferred.

### Testing

- **User-Verifiable:**
  - **US12:** Navigate to `/events/new`. Fill and submit the form. Verify event is created and user is redirected to the show page. Check DB for correct data including `created_by` and geocoded lat/lng.
  - Attempt to create an event with invalid data (e.g., missing run number). Verify error messages are shown.
  - **US13:** Navigate to an event's show page (for an event created by the logged-in user). Click "Edit". Page navigates to `/events/:id/edit` with form pre-filled. Modify data and save. Verify changes on show page and in DB.
  - Try to edit an event not created by the logged-in user. Verify access is denied / redirected by Pundit.
  - **US5:** On `/events/new` or `/events/:id/edit`, have a "Cancel" button that navigates back (e.g., using `Inertia.visit` or `window.history.back()`).
- **Controller Specs (RSpec):**
  - `EventsController`:
    - `create`: valid/invalid params, authorization, event count changes.
    - `edit`: authorization, correct event is fetched.
    - `update`: valid/invalid params, authorization, event attributes change.
    - `destroy`: authorization, event count changes.
- **System Specs (Capybara):**
  - `spec/system/events_management_spec.rb`:
    - Full CRUD flow: Create, Read, Update, Delete an event by its creator.
    - Test authorization for edit/delete by non-creator.
    - Test form validations.

### Deliverables

- Fully functional event creation and editing.
- `EventForm.tsx` component.
- `Events/New.tsx` and `Events/Edit.tsx` pages.
- Updated `EventsController` and `EventPolicy`.
