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
2.  **Inertia Views for Auth:**
    - Override `SessionsController` and `RegistrationsController` `new` actions to render Inertia pages (e.g., `Auth/Login`, `Auth/Register`) as suggested in `prd.md#3.1`.
    - Create corresponding React pages:
      - `app/frontend/Pages/Auth/Login.tsx`
      - `app/frontend/Pages/Auth/Register.tsx`
    - Implement forms using React Hook Form + Zod for validation.
3.  **User Model Enhancements:**
    - Add `display_name`, `avatar_url` to `User` model via migration (`prd.md#4.1`).
    - Update `User` model (`app/models/user.rb`) with any initial validations or methods.
4.  **Navigation for Auth:**
    - Add Login/Register/Logout links to `AppLayout.tsx` (to be created/enhanced in a later phase, but links can be conditional now).
    - Protect a sample route to test authentication.

### Best Practices & Considerations

- Store Zod schemas in `app/frontend/ZodSchemas/`.
- Create reusable form components if patterns emerge.
- Ensure `current_user` helper is available in Inertia props.

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
