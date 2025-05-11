# Task List: Phase 3 - Authentication

- [x] **Environment Setup:**

  - [x] Define and configure `NEXTAUTH_URL` environment variable.
  - [x] Define and configure `NEXTAUTH_SECRET` (or `AUTH_SECRET`) environment variable.
  - [x] Obtain and configure `GOOGLE_ID` (or `AUTH_GOOGLE_ID`) environment variable.
  - [x] Obtain and configure `GOOGLE_SECRET` (or `AUTH_GOOGLE_SECRET`) environment variable.

- [x] **NextAuth Installation & Configuration:**

  - [x] Install `next-auth` package (`pnpm add next-auth`).
  - [x] Create the NextAuth API route file: `app/api/auth/[...nextauth].ts`.
  - [x] Configure the Google OAuth provider in `app/api/auth/[...nextauth].ts`.
  - [x] Define `authOptions` for NextAuth configuration.

- [x] **Client-Side Integration (UI):**

  - [x] Wrap the root application component (e.g., root layout) with `SessionProvider`.
  - [x] Create a "Sign in with Google" button component.
  - [x] Implement logic in the header to display either the "Sign in" button or user information (name/profile picture) and a "Sign out" button/option based on `useSession` hook.
  - [x] Implement the sign-out functionality.

- [x] **API Route Protection:**

  - [x] Identify existing or planned API routes that require authentication.
  - [x] Update identified API routes to use `getServerSession(authOptions)` to protect them.
  - [x] Ensure unauthorized access to protected routes returns a 401 error.

- [x] **Testing:**

  - [x] Write tests for the sign-in process.
  - [x] Write tests for the sign-out process.
  - [x] Write tests for accessing protected API routes (authenticated and unauthenticated).

- [x] **Documentation & Review:**
  - [x] Update `implementation_notes.md` with any technical decisions or challenges.
  - [x] Review implementation against `spec.md` and `design.md`.
