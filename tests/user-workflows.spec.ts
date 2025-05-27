/**
 * User Workflow Tests
 *
 * These tests verify complete user workflows from start to finish,
 * covering the main user journeys through the application.
 */

import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './support/authUtils';

test.describe('Complete User Workflows', () => {
  test.describe('Organizer Workflow: Create Run → Manage Attendance → View Results', () => {
    test('should complete full organizer workflow', async ({ page }, testInfo) => {
      // Step 1: Login as organizer
      await loginAsTestUser(page, 'organizer@example.com');
      await page.goto('/');

      // Verify organizer is logged in
      await expect(page.locator('text=organizer@example.com')).toBeVisible();

      // Step 2: Navigate to create run page
      await page.click('[data-testid="create-run-button"]');
      await expect(page).toHaveURL(/.*\/runs\/new/);

      // Step 3: Fill out run creation form
      const runNumber = `test-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      await page.fill('[data-testid="run-number"]', runNumber);
      await page.fill('[data-testid="run-descriptor"]', `Test Run #${runNumber}`);
      await page.fill('[data-testid="run-datetime"]', '2024-12-31T10:00');
      await page.fill('[data-testid="run-address"]', '123 Test Street, Lawrence, KS');
      await page.fill('[data-testid="intro-link"]', 'https://example.com/intro');

      // Step 4: Submit run creation
      await page.click('[data-testid="submit-run"]');

      // Verify run was created successfully
      await expect(page.locator('text=Run created successfully')).toBeVisible();
      await expect(page).toHaveURL(/.*\/runs\/\w+/);

      // Step 5: Verify run details are displayed
      await expect(page.locator(`text=Test Run #${runNumber}`)).toBeVisible();
      await expect(page.locator('text=123 Test Street, Lawrence, KS')).toBeVisible();

      // Step 6: Mark attendance for users
      await page.click('[data-testid="manage-attendance"]');

      // Mark a user as attended
      const attendanceCheckbox = page.locator('[data-testid="attendance-checkbox"]').first();
      if ((await attendanceCheckbox.count()) > 0) {
        await attendanceCheckbox.check();
        await expect(page.locator('text=Attendance marked')).toBeVisible();
      }

      // Step 7: View run statistics
      await page.click('[data-testid="view-stats"]');
      await expect(page.locator('[data-testid="attendance-count"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-count"]')).toBeVisible();
    });
  });

  test.describe('User Workflow: Browse Runs → RSVP → Upload Photo', () => {
    test('should complete full user workflow', async ({ page }) => {
      // Step 1: Login as regular user
      await loginAsTestUser(page, 'user@example.com');
      await page.goto('/');

      // Verify user is logged in
      await expect(page.locator('text=user@example.com')).toBeVisible();

      // Step 2: Browse available runs
      await page.click('[data-testid="view-runs"]');
      await expect(page).toHaveURL(/.*\/runs/);

      // Verify runs are displayed
      await expect(page.locator('[data-testid="run-card"]').first()).toBeVisible();

      // Step 3: Select a run to view details
      await page.click('[data-testid="run-card"]').first();
      await expect(page).toHaveURL(/.*\/runs\/\w+/);

      // Step 4: RSVP to the run
      const rsvpButton = page.locator('[data-testid="rsvp-yes"]');
      if ((await rsvpButton.count()) > 0) {
        await rsvpButton.click();
        await expect(page.locator('text=RSVP updated')).toBeVisible();

        // Verify RSVP status is displayed
        await expect(page.locator('[data-testid="rsvp-status"]')).toContainText('Yes');
      }

      // Step 5: Upload a photo (if run allows it)
      const photoUploadSection = page.locator('[data-testid="photo-upload"]');
      if ((await photoUploadSection.count()) > 0) {
        // Create a test file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
          name: 'test-photo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-data'),
        });

        await page.fill('[data-testid="photo-caption"]', 'Great run today!');
        await page.click('[data-testid="upload-photo"]');

        // Verify photo was uploaded
        await expect(page.locator('text=Photo uploaded successfully')).toBeVisible();
      }

      // Step 6: View photo gallery
      await page.click('[data-testid="view-gallery"]');
      await expect(page.locator('[data-testid="photo-gallery"]')).toBeVisible();
    });
  });

  test.describe('Mobile Responsive Workflow', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Login on mobile
      await loginAsTestUser(page, 'user@example.com');
      await page.goto('/');

      // Test mobile navigation
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

      // Navigate to runs on mobile
      await page.click('[data-testid="mobile-runs-link"]');
      await expect(page).toHaveURL(/.*\/runs/);

      // Verify mobile layout
      const runCards = page.locator('[data-testid="run-card"]');
      await expect(runCards.first()).toBeVisible();

      // Test mobile form interaction
      await page.click(runCards.first());

      // Test mobile RSVP
      const mobileRsvpButton = page.locator('[data-testid="mobile-rsvp"]');
      if ((await mobileRsvpButton.count()) > 0) {
        await mobileRsvpButton.click();
        await expect(page.locator('[data-testid="rsvp-modal"]')).toBeVisible();
      }
    });
  });

  test.describe('Error Handling Workflow', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Login first
      await loginAsTestUser(page, 'organizer@example.com');
      await page.goto('/');

      // Intercept network requests to simulate errors
      await page.route('**/api/runs', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      });

      // Try to create a run
      await page.click('[data-testid="create-run-button"]');
      await page.fill('[data-testid="run-number"]', '999');
      await page.fill('[data-testid="run-descriptor"]', 'Error Test Run');
      await page.fill('[data-testid="run-datetime"]', '2024-12-31T10:00');
      await page.fill('[data-testid="run-address"]', '123 Error Street');

      await page.click('[data-testid="submit-run"]');

      // Verify error is displayed
      await expect(page.locator('text=Error creating run')).toBeVisible();

      // Verify form is still accessible for retry
      await expect(page.locator('[data-testid="run-number"]')).toBeVisible();
    });

    test('should handle validation errors properly', async ({ page }) => {
      await loginAsTestUser(page, 'organizer@example.com');
      await page.goto('/runs/new');

      // Try to submit form with invalid data
      await page.fill('[data-testid="run-number"]', '-1'); // Invalid number
      await page.fill('[data-testid="run-descriptor"]', ''); // Empty required field

      await page.click('[data-testid="submit-run"]');

      // Verify validation errors are displayed
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

      // Verify form fields are highlighted
      const invalidFields = page.locator('[aria-invalid="true"]');
      await expect(invalidFields).toHaveCount(1); // At least one invalid field
    });
  });

  test.describe('Accessibility Workflow', () => {
    test('should be fully navigable with keyboard only', async ({ page }) => {
      await page.goto('/');

      // Navigate through the page using only keyboard
      await page.keyboard.press('Tab'); // Focus first interactive element

      // Continue tabbing through elements
      for (let i = 0; i < 10; i++) {
        const focusedElement = await page.locator(':focus').first();
        await expect(focusedElement).toBeVisible();
        await page.keyboard.press('Tab');
      }

      // Test keyboard activation
      const focusedButton = page.locator(':focus[role="button"], :focus button').first();
      if ((await focusedButton.count()) > 0) {
        await page.keyboard.press('Enter');
        // Verify action was triggered (implementation specific)
      }
    });

    test('should announce important changes to screen readers', async ({ page }) => {
      await loginAsTestUser(page, 'user@example.com');
      await page.goto('/runs');

      // Look for ARIA live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      await expect(liveRegions).toHaveCount(1); // At least one live region

      // Trigger an action that should announce changes
      const runCard = page.locator('[data-testid="run-card"]').first();
      if ((await runCard.count()) > 0) {
        await runCard.click();

        // Check if status updates are announced
        const statusRegion = page.locator('[role="status"]');
        if ((await statusRegion.count()) > 0) {
          await expect(statusRegion).not.toBeEmpty();
        }
      }
    });
  });

  test.describe('Performance Workflow', () => {
    test('should load pages within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');

      // Wait for main content to be visible
      await expect(page.locator('main')).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      await page.goto('/runs');

      // Wait for runs to load
      await expect(page.locator('[data-testid="run-card"]').first()).toBeVisible();

      // Test pagination or infinite scroll
      const loadMoreButton = page.locator('[data-testid="load-more"]');
      if ((await loadMoreButton.count()) > 0) {
        const initialCount = await page.locator('[data-testid="run-card"]').count();

        await loadMoreButton.click();

        // Verify more items were loaded
        await expect(page.locator('[data-testid="run-card"]')).toHaveCount(initialCount + 10); // Assuming 10 more items
      }
    });
  });
});
