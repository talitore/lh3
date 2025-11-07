# Project Development Plan: LH3

This document outlines the phased development plan for the LH3 project, tailored for a single developer. It integrates requirements from the PRD (`prd.md`) and User Stories (`user-stories.md`).

## Guiding Principles

- **Iterative Development:** Each phase builds upon the previous one, delivering functional increments.
- **Test-Driven Approach:** Emphasize writing tests alongside or before feature implementation. User stories will be key to defining test cases.
- **User-Verifiable Steps:** Each phase will include steps for manual verification of implemented features.
- **Best Practices:** Adherence to clean code, centralized constants, and appropriate use of Dependency Injection.
- **Documentation:** Key decisions and architectural choices will be noted.

---

## Phase 1: Project Foundation & Core Setup

### Objective

Establish the foundational Rails application, Docker environment, essential gems, and frontend tooling.

### PRD Alignment

- Section 1: Initial Setup & Boilerplate
- Section 2: Rails + Inertia + Vite Integration (partial - initial setup)
- Section 9: Linting, Formatting & CI (initial setup)

### User Stories Covered

- (None directly, but sets the stage for all)

### Key Tasks

1.  **Provision Rails App:**
    - Generate Rails 8 app as per `prd.md#1.1`.
    - Initial commit.
2.  **Docker + Kamal Setup:**
    - Create `Dockerfile` (`prd.md#1.2`).
    - Create `docker-compose.yml` for local development (app, db, redis).
    - Initial Kamal configuration (`config/deploy.yml` or `kamal.rb`) (`prd.md#1.2`).
3.  **Gemfile & Package.json:**
    - Add core gems from `prd.md#1.3` to `Gemfile`.
    - Run `bundle install`.
    - Initialize `package.json` with `npm init -y`.
    - Add core JS packages from `prd.md#1.3`.
    - Run `npm install`.
    - Commit lockfiles.
4.  **Propshaft & Asset Pipeline:**
    - Configure Propshaft in `config/application.rb` (`prd.md#2.1`).
    - Create `app/assets/` structure if needed.
5.  **Vite Setup:**
    - Run `bundle exec vite install`.
    - Configure `vite.config.ts` (`prd.md#2.2`).
    - Add `dev` and `build` scripts to `package.json`.
6.  **Basic Inertia Rails Config:**
    - Create `config/initializers/inertia_rails.rb` (`prd.md#2.3`).
    - Create `app/views/layouts/application.html.erb` with Vite/Inertia tags (`prd.md#2.3`, `prd.md#2.4`).
7.  **React/TS Entrypoint:**
    - Create `app/frontend/entrypoints/application.tsx` (`prd.md#2.4`).
    - Create basic `app/frontend/Pages/Home.tsx` (e.g., displaying "Hello World").
    - Create a root route in `config/routes.rb` pointing to an action that renders `Inertia.render('Home')`.
8.  **Tailwind CSS Integration:**
    - Initialize Tailwind: `npm dlx tailwindcss init` (`prd.md#2.5`).
    - Configure `tailwind.config.js` (`prd.md#2.5`).
    - Create `app/frontend/styles/application.css` (`prd.md#2.5`).
9.  **Linting Setup:**
    - Configure RuboCop with `rubocop-rails-omakase` (`prd.md#9.1`).
    - Configure ESLint & Prettier for TSX (`prd.md#9.2`).
    - Add linting scripts to `package.json`.

### Best Practices & Considerations

- Create a `.env.example` and use `.env` for local development secrets.
- Establish initial directory structure in `app/frontend/` (Pages, Components, etc. as per `prd.md#6`).

### Testing

- **User-Verifiable:**
  - `docker-compose up` successfully starts app, db, redis.
  - Rails app runs: `bin/dev` (or equivalent using Vite and Rails server separately).
  - Navigate to the root URL. See "Hello World" (or similar) rendered via React/Inertia/Vite, styled by Tailwind.
  - `bundle exec rubocop` runs without errors on initial codebase.
  - `npm run lint:js` runs without errors on initial frontend code.

### Deliverables

- A running Rails application with Vite, Inertia, React, and TailwindCSS integrated.
- Dockerized development environment.
- Basic "Hello World" page rendered via Inertia.
- Linters configured and passing.

---

## Phase 2: Authentication & User Model

### Objective

Implement user authentication (registration, login, logout) and enhance the User model.

### PRD Alignment

- Section 3: Authentication & Authorization (Authentication Zero part)
- Section 4: Data Modeling & Migrations (User Model enhancements)

### User Stories Covered

- (Implicitly covers stories requiring authenticated users, e.g., User Story 12, 13, 14, 16, 19)

### Key Tasks

1.  **Authentication Zero Setup:**
    - Install and configure `authentication_zero` (`prd.md#3.1`).
    - Run migrations: `rails db:migrate`.
2.  **Setup `Current.user`:**
    - Create `app/models/current.rb` to define `Current.user`.
    - Add a `before_action` in `ApplicationController` to set `Current.user` from `current_user`. This makes the current user securely available to the model layer.
3.  **Inertia Views for Auth:**
    - Override `SessionsController` and `RegistrationsController` `new` actions to render Inertia pages (e.g., `Auth/Login`, `Auth/Register`) as suggested in `prd.md#3.1`.
    - Create corresponding React pages:
      - `app/frontend/Pages/Auth/Login.tsx`
      - `app/frontend/Pages/Auth/Register.tsx`
    - Implement forms using React Hook Form + Zod for validation.
4.  **User Model Enhancements:**
    - Add `display_name`, `avatar_url` to `User` model via migration (`prd.md#4.1`).
    - Update `User` model (`app/models/user.rb`) with any initial validations or methods.
5.  **Navigation for Auth:**
    - Add Login/Register/Logout links to `AppLayout.tsx` (to be created/enhanced in a later phase, but links can be conditional now).
    - Protect a sample route to test authentication.

### Best Practices & Considerations

- Store Zod schemas in `app/frontend/ZodSchemas/`.
- Create reusable form components if patterns emerge.
- The controller makes `current_user` available to Inertia props, while `Current.user` is used for model and service logic.

### Testing

- **User-Verifiable:**
  - Navigate to `/users/sign_up`. Register a new user.
  - Log out.
  - Navigate to `/users/sign_in`. Log in with the new user.
  - Access a protected page (should succeed).
  - Log out. Try to access protected page (should fail/redirect to login).
  - View user in database, confirm `display_name` and `avatar_url` fields exist (even if null).
- **Unit Tests (RSpec):**
  - `User` model: validations for email, password, new fields.
- **Controller Specs (RSpec):**
  - `SessionsController`, `RegistrationsController`: test Inertia rendering, successful/failed login/registration.

### Deliverables

- Functional user registration, login, and logout.
- Inertia-based authentication pages.
- Enhanced `User` model.

---

## Phase 3: Core Data Models & Migrations (HashEvent, RSVP, Photo)

### Objective

Define and migrate core data models: HashEvent, RSVP, and Photo. Establish their associations.

### PRD Alignment

- Section 4: Data Modeling & Migrations (HashEvent, RSVP, Photo models)
- Section 4.5: Geocoding (initial setup for HashEvent model)

### User Stories Covered

- (Foundation for most run and photo related stories)

### Key Tasks

1.  **Event Model:**
    - Generate `Event` model scaffold (`prd.md#4.2`).
    - Add associations to `app/models/event.rb` (`belongs_to :creator`, `has_many :rsvps`, `has_many :photos`).
    - Add a `before_validation :set_creator, on: :create` callback, where `set_creator` assigns `self.creator ||= Current.user`. This centralizes creator logic in the model.
    - Add validations (`run_number`, `descriptor`, `date`, `time`, `address`).
    - Run `rails db:migrate`.
2.  **RSVP Model:**
    - Generate `Rsvp` model scaffold (`prd.md#4.3`).
    - Add associations and validations to `app/models/rsvp.rb`.
    - Update `User` and `Event` models with `has_many :rsvps` and `has_many :events, through: :rsvps` etc.
    - Run `rails db:migrate`.
3.  **Photo Model:**
    - Generate `Photo` model scaffold (`prd.md#4.4`).
    - Add associations and validations to `app/models/photo.rb`.
    - Update `User` and `Event` models with `has_many :photos`.
    - Run `rails db:migrate`.
4.  **Geocoding Setup for Event:**
    - Add `geocoder` gem to `Gemfile`, `bundle install` (`prd.md#4.5`).
    - Configure `Event` model for geocoding: `geocoded_by :address`, `after_validation :geocode` (`prd.md#4.5`).

### Best Practices & Considerations

- Use `rails g model ... creator:references{to_table: :users}` for foreign keys to ensure consistency with associations like `belongs_to :creator`.
- Define constants for things like `Rsvp::STATUSES` in the respective models.

### Testing

- **User-Verifiable:**
  - (Manual DB inspection or Rails console checks)
  - Create a User.
  - Create an Event associated with the User as creator. `event.address = "10 Downing St, London"; event.save; event.latitude` should be populated.
  - Create an RSVP linking the User and Event.
  - Create a Photo linking the User and Event.
- **Unit Tests (RSpec & FactoryBot):**
  - Create factories for `User`, `Event`, `Rsvp`, `Photo` (`prd.md#8.2`).
  - `Event` model: Test validations, associations, geocoding callback.
  - `Rsvp` model: Test validations (status inclusion), associations.
  - `Photo` model: Test validations (image_url presence), associations.

### Deliverables

- Migrated `Event`, `Rsvp`, `Photo` tables in the database.
- Models with defined associations and validations.
- Geocoding configured for the `Event` model.
- Factories for all core models.

---

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
    - Implement `create` action (stub): Authorize, build event with `Event.new(event_params)`, and let the model callback handle setting the creator (`prd.md#5.1`).
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

---

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

---

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
    - Implement `create` action: Authorize, create event with `Event.new(event_params)`, save, handle success (redirect to show) and failure (re-render new with errors). The creator will be set automatically via the model callback using `Current.user`.
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

---

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
    - Implement `create` action: Authenticate user, find event, create/update RSVP (`@event.rsvps.find_or_initialize_by(user: current_user).update(status: params[:status])`). Using `current_user` here is appropriate as it's a direct controller action on a specific user's record. Return JSON response (`prd.md#5.2`).
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

---

## Phase 8: Photo Upload & Display (Basic)

### Objective

Allow users to upload photos for an event and display them in a gallery. (Simplified: direct URL storage, S3 integration later if needed).

### PRD Alignment

- Section 5.3: `PhotosController`
- Section 6.8: `PhotoUploader.tsx` & `PhotoGallery.tsx` (basic versions)

### User Stories Covered

- User Story 17: View Recent Photos on Feed (placeholder, actual recent photos later)
- User Story 18: View Photo Gallery for a Specific Run
- User Story 19: Upload Photo to a Run (Authenticated User) (simplified upload)

### Key Tasks

1.  **`PhotosController` Implementation:**
    - Implement `create` action: Authenticate, find event, create photo record. The `Photo` model should have a callback to assign the uploader from `Current.user`, similar to the `Event` model. Return JSON (`prd.md#5.3`).
    - Implement `destroy` action: Authorize, find photo, destroy.
    - Refine `PhotoPolicy` (uploader or event creator can delete).
    - Add `set_event` before_action.
2.  **`PhotoUploader.tsx` (Basic):**
    - Create `app/frontend/Components/PhotoUploader.tsx`.
    - Simple form with a text input for `image_url` and `alt_text`.
    - On submit, `POST` to `/events/:eventId/photos`.
    - **Note:** PRD describes S3 signed URLs. For MVP Phase 1, simplify to direct URL input. S3 can be an enhancement.
3.  **`PhotoGallery.tsx`:**
    - Create `app/frontend/Components/PhotoGallery.tsx`.
    - Props: `photos` array.
    - Renders a grid of images using `<img>` tags with `photo.image_url`.
4.  **Integrate Photo Components:**
    - In `EventsController#show`, include photo details in event JSON: `include: { photos: { include: :user } }`.
    - In `Events/Show.tsx`, add `<PhotoUploader eventId={event.id} />` and `<PhotoGallery photos={event.photos} />`.

### Testing

- **User-Verifiable:**
  - **US18 & US19 (Simplified):** On an event show page, use the `PhotoUploader` to submit an image URL.
  - Verify photo appears in the `PhotoGallery`.
  - Verify photo record in DB associated with correct event and user.
  - Delete an uploaded photo (if authorized).
- **Controller Specs (RSpec):**
  - `PhotosController`: Test `create`/`destroy`, authorization, photo record changes.
- **System Specs (Capybara):**
  - `spec/system/photos_spec.rb`: User uploads a photo URL to an event, sees it in gallery. Deletes photo.

### Deliverables

- Basic photo upload (via URL input) and display functionality.
- `PhotoUploader.tsx` and `PhotoGallery.tsx` components.

---

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
    - `EventsController#show` needs to ensure the `@event` JSON includes `current_user_rsvp: @event.rsvps.find_by(user: current_user)` or similar. This is a good example of when to use the `current_user` helper directly in the controller for a specific query.

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

---

## Phase 10: Refinements, Testing Expansion, and Basic Admin Stubs

### Objective

Refine existing features, expand test coverage, set up basic admin stubs, and prepare for more advanced features or deployment.

### PRD Alignment

- Section 6.6: "Dashboard.tsx" (Admin Mode) - stubs
- Section 8: Testing Strategy (RSpec + Capybara) - review and expand
- Section 7: Background Jobs & Real-Time Updates (consider if any simple caching can be added)
- Section 2.5 & 6 (folder structure): AddressInput.tsx, MapPicker.tsx, useGeocode.ts (more advanced stubs or basic implementation)

### User Stories Covered

- User Story 2, 3, 4 (Navigation refinements)
- User Story 8, 9, 10 (Feed filtering/sorting stubs or simplified version)
- User Story 20: View Community Statistics on Feed (mock data)
- User Story 21: Access "What's Hashing?" Information

### Key Tasks

1.  **Navigation & Layout Enhancements:**
    - Implement "Back to Runs" (US4), "View All Runs" (US2), "View All Photos" (US3) navigation links/buttons.
    - Create placeholder pages if destinations don't exist (e.g., `/photos` main page).
    - Refine `AppLayout.tsx` with actual navigation links.
2.  **"What's Hashing?" Info (`WhatsHashingInfo.tsx`):**
    - Create `app/frontend/Components/WhatsHashingInfo.tsx` (US21).
    - Add static content as per PRD.
    - Integrate into `Events/Show.tsx`.
3.  **Community Stats (Mock Data):**
    - Create `app/frontend/Components/CommunityStatsCard.tsx` (US20).
    - Display with mock data. Integrate into `Events/Index.tsx`.
4.  **Admin Dashboard Stub (`Dashboard.tsx`):**
    - Create `app/frontend/Pages/Admin/Dashboard.tsx` (`prd.md#6.6`).
    - Add basic conditional link in `AppLayout` to `/admin/dashboard` if the current user is an admin. The controller will check `Current.user.is_admin?` and pass a prop to the frontend.
    - Stub out sections mentioned in PRD (Attendance Tracking, Hash Cash, Achievements).
5.  **Advanced Address Input (Consideration):**
    - If time permits, start basic integration of Google Maps Autocomplete for `AddressInput.tsx` (PRD section 6.4) or defer.
    - Create `app/frontend/Hooks/useGeocode.ts` stub.
6.  **Test Suite Expansion:**
    - Review all user stories and ensure corresponding system tests in Capybara.
    - Increase unit test coverage for models and controllers.
    - Refine factories for better test data.
7.  **Basic Caching (Optional):**
    - If `solid_cache` is set up (from Phase 1 gems), apply simple caching to `Event#rsvp_count` as per `prd.md#7.2`.
8.  **Feed Filtering/Sorting (Simplified/Stubs):**
    - Add UI elements for search, filter, sort on `Events/Index.tsx` (US8, US9).
    - For MVP, these might be non-functional or implement very basic client-side filtering if feasible. Backend filtering can be an enhancement.
    - "Load More" button (US10) can be stubbed or implement simple pagination if backend supports it.

### Testing

- **User-Verifiable:**
  - All navigation links work as expected.
  - "What's Hashing?" info is viewable.
  - Mock community stats are displayed.
  - Admin users can see a link to a stubbed admin dashboard.
  - All previously implemented features still work.
- **System Specs (Capybara):**
  - Cover all remaining user stories that are part of this phase.
  - Test admin dashboard link visibility based on user role.

### Deliverables

- Refined UI and navigation.
- Stubbed or simplified versions of remaining feed features and admin dashboard.
- Expanded and robust test suite.
- `WhatsHashingInfo.tsx` and `CommunityStatsCard.tsx` with content.

---

## Post-MVP / Future Phases

- Full S3/Cloudinary integration for photo uploads (PRD 6.8, 7.1).
- Background jobs with Solid Queue (Email reminders, photo processing) (PRD 7.1, 11.1).
- Advanced caching with Solid Cache / Redis (PRD 7.2, 12.7).
- Solid Cable for real-time updates (PRD 7.3).
- Full implementation of Admin Dashboard features (PRD 6.6).
- Advanced feed filtering, sorting, and pagination (User Stories 8, 9, 10).
- User-submitted trails database (PRD 12.2).
- Club-wide map of runs (PRD 12.3).
- Inertia SSR (PRD 12.4).
- Gamification & Hash Cash (PRD 12.5).
- Full CI/CD pipeline and deployment to staging/production (PRD 10).
- Analytics and Monitoring (PRD 11).
