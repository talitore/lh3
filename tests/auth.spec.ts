import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './support/authUtils';

test.describe('Authentication', () => {
  test.describe('API Route Protection', () => {
    test('should return 401 for protected route if not authenticated', async ({
      request,
    }) => {
      const response = await request.get('/api/protected-example');
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(
        'Unauthorized: Please log in to access this resource.'
      );
    });

    test('should return 200 and user data for protected route if authenticated', async ({
      page,
      request,
    }) => {
      await page.goto('/');
      await loginAsTestUser(page);

      const response = await page.request.get('/api/protected-example');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.message).toBe(
        'You are authenticated and can see this secret message!'
      );
      expect(body.user.name).toBe('Test User');
      expect(body.user.email).toBe('testuser@example.com');
    });
  });

  test.describe('UI Elements and Flow', () => {
    test('should display "Sign in with Google" button when unauthenticated', async ({
      page,
    }) => {
      await page.goto('/');
      const signInButton = page.getByRole('button', {
        name: /Sign in with Google/i,
      });
      await expect(signInButton).toBeVisible();
      await expect(page.getByText('Test User')).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: /Sign Out/i })
      ).not.toBeVisible();
    });

    test('should display user info and sign-out button when authenticated', async ({
      page,
    }) => {
      await page.goto('/');
      await loginAsTestUser(page);
      await page.reload({ waitUntil: 'domcontentloaded' });

      await expect(
        page.getByRole('button', { name: /Sign in with Google/i })
      ).not.toBeVisible({ timeout: 10000 });

      await expect(page.getByText('Test User')).toBeVisible();
      const signOutButton = page.getByRole('button', { name: /Sign Out/i });
      await expect(signOutButton).toBeVisible();
    });

    test('should allow user to sign out', async ({ page }) => {
      await page.goto('/');
      await loginAsTestUser(page);
      await page.reload({ waitUntil: 'domcontentloaded' });

      await expect(
        page.getByRole('button', { name: /Sign in with Google/i })
      ).not.toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Test User')).toBeVisible();
      const signOutButton = page.getByRole('button', { name: /Sign Out/i });
      await expect(signOutButton).toBeVisible();

      const csrfTokenResponse = await page.request.get('/api/auth/csrf');
      const csrfJson = await csrfTokenResponse.json();
      const csrfToken = csrfJson.csrfToken;

      const signoutResponse = await page.request.post('/api/auth/signout', {
        form: {
          csrfToken: csrfToken,
          json: 'true',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      expect(signoutResponse.ok()).toBe(true);

      await page.reload();
      await page.waitForTimeout(500);

      await expect(
        page.getByRole('button', { name: /Sign in with Google/i })
      ).toBeVisible();
      await expect(page.getByText('Test User')).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: /Sign Out/i })
      ).not.toBeVisible();

      const response = await page.request.get('/api/protected-example');
      expect(response.status()).toBe(401);
    });
  });
});
