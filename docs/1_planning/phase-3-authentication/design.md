### Architectural Thoughts

The authentication flow will leverage NextAuth.js, which handles much of the underlying complexity of OAuth 2.0 and session management.

1.  **NextAuth.js API Route**: `app/api/auth/[...nextauth].ts` will be the central hub for authentication requests. It will be configured with the Google provider, using `GOOGLE_ID` and `GOOGLE_SECRET` environment variables.
2.  **Session Strategy**: The default JWT (JSON Web Token) session strategy will be used. This is stateless and suitable for serverless environments. The JWT will be stored in a secure, HTTP-only cookie.
3.  **Environment Variables**: Crucial for security and configuration:
    - `NEXTAUTH_URL`: The canonical URL of the application. Essential for OAuth redirects.
    - `NEXTAUTH_SECRET`: A strong secret used for signing and encrypting JWTs and other sensitive data. (The new `AUTH_SECRET` can also be used).
    - `GOOGLE_ID` / `AUTH_GOOGLE_ID`: Google OAuth Client ID.
    - `GOOGLE_SECRET` / `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret.
4.  **API Route Protection**: API routes will use `getServerSession(authOptions)` (where `authOptions` are the NextAuth configuration) to verify the user's session. If no valid session is found, a 401 Unauthorized response will be returned.
5.  **Client-Side Integration**: The client-side will use `SessionProvider` at the root of the application (e.g., in `_app.tsx` or the root layout in the App Router) and the `useSession` hook to access session data and display UI elements conditionally (e.g., Sign In/Sign Out buttons, user profile information).

### Visual Sketches / Descriptions

Since this is primarily an authentication flow, the visual elements are standard but crucial:

- **Sign-In Button**: A clear "Sign in with Google" button. This could be a simple button with the Google logo and text.
  - _Visual_: `[ G | Sign in with Google ]`
- **User Profile Display (Post Sign-In)**: Once authenticated, the sign-in button area could transform to show the user's name or profile picture (if available from Google). Clicking this could reveal a dropdown.
  - _Visual (Header)_: `Welcome, [User Name] ▼`
- **Dropdown Menu (Post Sign-In)**: Contains options like "Account Settings" (if applicable) and "Sign Out".
  - _Visual (Dropdown)_:
    ```
    ---------------------
    | Account Settings  |
    |-------------------|
    | Sign Out          |
    ---------------------
    ```

### Component Interactions

1.  **User Clicks "Sign in with Google"**: The client initiates the NextAuth sign-in flow for the Google provider.
2.  **Redirection to Google**: The user is redirected to Google's OAuth consent screen.
3.  **User Consents**: User logs into their Google account (if not already) and approves the application's request for access.
4.  **Redirection to Callback URL**: Google redirects the user back to the application's predefined callback URL (e.g., `/api/auth/callback/google`).
5.  **NextAuth Handles Callback**: NextAuth processes the callback, exchanges the authorization code for tokens, creates a session, and sets a session cookie.
6.  **Redirection to Application**: User is redirected back to the application page they were on or a default page post-login.
7.  **UI Updates**: Client-side `useSession` hook detects the new session, and the UI updates to reflect the authenticated state (e.g., shows user name, sign-out button).
8.  **User Clicks "Sign Out"**: Client initiates NextAuth sign-out flow.
9.  **Session Cleared**: NextAuth clears the session cookie.
10. **UI Updates**: `useSession` hook detects the signed-out state, UI updates to show "Sign In" button.
11. **Accessing Protected API**: Client makes a request to a protected API route. The session cookie is sent with the request. `getServerSession` on the server validates the session. If valid, API returns data; otherwise, returns 401.

### SLC Principles (Simple, Lovable, Complete)

- **Simple**: The primary login method is Google OAuth, a widely understood and trusted flow. The number of steps for the user is minimized. The UI for sign-in/out should be unambiguous.
- **Lovable**: Provide a seamless and quick sign-in experience. Avoid unnecessary friction. Clear visual feedback during the process (e.g., loading states if redirects take a moment).
- **Complete**: The authentication system should securely handle sign-in, sign-out, and session management. Protected routes must robustly deny unauthorized access. For the initial phase, "complete" means a fully working Google OAuth integration that protects specified API routes.
