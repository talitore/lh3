## Phase 4: Authorization (Pundit) & Core API/Controller Stubs

### Objective

Set up Pundit for authorization and create initial controllers for Events, RSVPs, and Photos with basic Inertia/JSON responses.

### PRD Alignment

- Section 3: Authentication & Authorization (Pundit Setup)
- Section 5: Core Controller & Policy Development (initial setup and index/show for Events)

### User Stories Covered

- (Foundation for actions requiring authorization, e.g., User Story 13)

### Key Tasks

1.  **Pundit Setup:**
    - Add `pundit` gem, `bundle install`.
    - Include `Pundit` in `ApplicationController` and set up `user_not_authorized` rescue (`prd.md#3.2`).
    - Create `app/policies/` directory.
    - Generate `ApplicationPolicy`.
    - Generate initial policies: `UserPolicy`, `EventPolicy`, `RsvpPolicy`, `PhotoPolicy` (`prd.md#3.2`). Stub basic actions (e.g., `show?`, `create?`, `update?`, `destroy?` returning `true` or `user.present?` for now).
2.  **EventsController (Initial):**
    - Generate `EventsController` (`prd.md#5.1`).
    - Implement `index` action: Fetch events, render `Events/Index` Inertia page with events JSON (`prd.md#5.1`).
    - Implement `show` action: Fetch event, authorize, render `Events/Show` Inertia page with event JSON (`prd.md#5.1`).
    - Implement `new` action: Authorize, render `Events/New` Inertia page.
    - Implement `create` action (stub): Authorize, build event, handle save (success/failure rendering Inertia) (`prd.md#5.1`).
    - Implement `set_event` private method.
    - Define `event_params`.
    - Add routes for events (`resources :events`).
3.  **RsvpsController (Stub):**
    - Generate `RsvpsController` (`prd.md#5.2`).
    - Stub `create` and `update` actions (e.g., returning placeholder JSON for now).
    - Add nested routes for RSVPs under events: `resources :events do resources :rsvps, only: [:create, :update] end`.
4.  **PhotosController (Stub):**
    - Generate `PhotosController` (`prd.md#5.3`).
    - Stub `create` and `destroy` actions.
    - Add nested routes for Photos under events: `resources :events do resources :photos, only: [:create, :destroy] end`.

### Best Practices & Considerations

- Policies should be restrictive by default.
- Controller actions should be lean, delegating logic to models or service objects (later).
- Define JSON structures for API responses carefully (e.g., using `as_json` with `include` and `only`).

### Testing

- **User-Verifiable:**
  - Create some events in the console.
  - As a logged-in user, navigate to `/events`. See a list of events (or empty state).
  - Navigate to `/events/:id` for an existing event. See event details.
  - Navigate to `/events/new`. See a form placeholder.
  - Attempt actions that should be unauthorized (e.g., trying to access an edit page for an event not owned by the user, once edit is implemented) and verify redirection or "Unauthorized" message.
- **Unit Tests (RSpec):**
  - `EventPolicy`, `RsvpPolicy`, `PhotoPolicy`: Test basic permissions for logged-in users.
- **Controller Specs (RSpec):**
  - `EventsController`:
    - `index`: returns 200, renders correct Inertia component, passes events.
    - `show`: returns 200 for existing event, renders component, passes event. Returns 404 for non-existent. Tests authorization.
    - `new`: returns 200, renders component. Tests authorization.
    - `create`: (initial tests for authorization, parameter handling).

### Deliverables

- Pundit configured with basic policies.
- `EventsController` with working `index`, `show`, `new` actions rendering Inertia pages.
- Stubbed `create` action for `EventsController`.
- Stubbed `RsvpsController` and `PhotosController`.
- Basic authorization working for event actions.
