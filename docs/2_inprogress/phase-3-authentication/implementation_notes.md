# Implementation Notes: Phase 3 - Authentication

## Google OAuth Configuration (Local Development)

When setting up the Google OAuth 2.0 Client ID in the Google Cloud Console for local development, the following URIs need to be configured:

- **Authorized JavaScript origins**:

  - `http://localhost:3000` (or your local development port)

- **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google` (assuming `NEXTAUTH_URL` is `http://localhost:3000`)

This corresponds to the default callback URL structure used by NextAuth for the Google provider.

## Environment Variable Naming Convention

For forward compatibility with future versions of Auth.js (formerly NextAuth.js), it is recommended to use the `AUTH_` prefixed environment variables where available:

- `AUTH_URL` (instead of `NEXTAUTH_URL`)
- `AUTH_SECRET` (instead of `NEXTAUTH_SECRET`)
- `AUTH_GOOGLE_ID` (instead of `GOOGLE_ID`)
- `AUTH_GOOGLE_SECRET` (instead of `GOOGLE_SECRET`)

The current NextAuth v4 configuration in `app/api/auth/[...nextauth]/route.ts` supports the newer `AUTH_` prefixed names.

**Decision**: Use `AUTH_` prefixed variables (`AUTH_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`) in the `.env.local` file for this project.
