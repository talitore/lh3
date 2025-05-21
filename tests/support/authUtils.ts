import { Page } from '@playwright/test';

// This function will be executed in the browser context via page.evaluate()
// async function browserSignIn(username: string) { ... } // This was the old unused approach

export async function loginAsTestUser(
  page: Page,
  username: string = 'testuser@example.com'
) {
  // 1. Get CSRF token
  const csrfTokenResponse = await page.request.get('/api/auth/csrf');
  if (!csrfTokenResponse.ok()) {
    throw new Error(
      `Failed to fetch CSRF token: ${csrfTokenResponse.statusText()}`
    );
  }
  const csrfJson = await csrfTokenResponse.json();
  const csrfToken = csrfJson.csrfToken;
  if (!csrfToken) {
    throw new Error('CSRF token not found in response');
  }

  // 2. Make a POST request to the credentials callback URL
  const loginResponse = await page.request.post(
    '/api/auth/callback/test-credentials',
    {
      form: {
        username: username,
        csrfToken: csrfToken,
      },
      // NextAuth often expects application/x-www-form-urlencoded for this endpoint
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const responseBodyText = await loginResponse.text();

  console.log(
    `[AuthUtils Debug] Login Response Status: ${loginResponse.status()}`
  );
  console.log(
    `[AuthUtils Debug] Login Response Body Text: ${responseBodyText.slice(
      0,
      100
    )}`
  );

  if (!loginResponse.ok()) {
    throw new Error(
      `Credentials sign-in POST request failed: ${loginResponse.statusText()} - ${responseBodyText}`
    );
  }

  // The response from a successful credentials callback might be a redirect or JSON
  // We expect a session cookie to be set by NextAuth upon successful auth.
  // Playwright's request.post follows redirects by default, so loginResponse
  // should be the final 200 OK response from the redirected page (e.g., '/').

  // A successful response to a credentials callback results in a redirect,
  // which page.request.post follows. Check for the final 200 status.

  // At this point, a session cookie should have been set if auth was successful.
  // The calling test should handle navigation/reload if needed.
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((cookie) =>
    cookie.name.includes('next-auth.session-token')
  );
  if (!sessionCookie) {
    throw new Error('Session token not found after login POST attempt.');
  }
}
