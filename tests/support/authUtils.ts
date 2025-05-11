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
        password: '', // Added empty password
        csrfToken: csrfToken,
        json: 'true', // Ask for JSON response to see outcome
      },
      // NextAuth often expects application/x-www-form-urlencoded for this endpoint
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const responseBodyText = await loginResponse.text();

  if (!loginResponse.ok()) {
    throw new Error(
      `Credentials sign-in POST request failed: ${loginResponse.statusText()} - ${responseBodyText}`
    );
  }

  // The response from a successful credentials callback might be a redirect or JSON
  // We expect a session cookie to be set by NextAuth upon successful auth.
  // Check if the response URL indicates success (e.g., not an error page or back to signin with error)
  // If json: true is respected, it might return { url: "/" } or similar on success.
  const loginJson = JSON.parse(responseBodyText || '{}'); // Attempt to parse, default to empty object if text is empty
  if (loginJson && loginJson.url && loginJson.url.includes('error')) {
    throw new Error(
      `Credentials sign-in failed, error in response: ${loginJson.url}`
    );
  }
  // A successful response to a credentials callback with json:true usually redirects.
  // The body might contain { url: "/" } or similar upon success which indicates where to redirect.
  if (!loginJson.url && loginResponse.status() !== 200) {
    throw new Error(
      `Credentials sign-in possibly failed, status: ${loginResponse.status()}, body: ${responseBodyText}`
    );
  }

  // If loginJson.url points to an error page, it means auth failed.
  if (
    loginJson.url &&
    (loginJson.url.includes('error') || loginJson.url.includes('signin'))
  ) {
    throw new Error(
      `Credentials sign-in failed, NextAuth redirected to: ${loginJson.url}`
    );
  }

  // At this point, a session cookie should have been set if auth was successful and loginJson.url was / or similar.
  // The calling test should handle navigation/reload if needed.
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((cookie) =>
    cookie.name.includes('next-auth.session-token')
  );
  if (!sessionCookie) {
    throw new Error('Session token not found after login POST attempt.');
  }
}
