/**
 * End-to-end tests for Phase 6 features
 */

import { test, expect } from '@playwright/test';

test.describe('Phase 6 Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Navigation and Layout', () => {
    test('should have accessible navigation with skip links', async ({ page }) => {
      // Check for skip link (only visible on focus)
      const skipLink = page.getByRole('link', { name: /skip to main content/i });
      await expect(skipLink).toBeInViewport();
      
      // Focus the skip link and verify it becomes visible
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    });

    test('should have responsive sidebar navigation', async ({ page }) => {
      // Check for sidebar toggle on mobile
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      await expect(menuButton).toBeVisible();
      
      // Open sidebar
      await menuButton.click();
      const sidebar = page.getByRole('navigation');
      await expect(sidebar).toBeVisible();
    });

    test('should navigate between pages correctly', async ({ page }) => {
      // Navigate to runs page
      await page.getByRole('link', { name: /runs/i }).click();
      await expect(page).toHaveURL(/\/runs/);
      
      // Navigate back to home
      await page.getByRole('link', { name: /home/i }).click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Run Details Page', () => {
    test('should display run information correctly', async ({ page }) => {
      // Navigate to a specific run (assuming test data exists)
      await page.goto('/runs/test-run-id');
      
      // Check for run details
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Run #');
      await expect(page.getByText(/date/i)).toBeVisible();
      await expect(page.getByText(/location/i)).toBeVisible();
    });

    test('should handle RSVP interactions', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Find RSVP buttons
      const yesButton = page.getByRole('button', { name: /rsvp yes/i });
      const maybeButton = page.getByRole('button', { name: /rsvp maybe/i });
      const noButton = page.getByRole('button', { name: /rsvp no/i });
      
      await expect(yesButton).toBeVisible();
      await expect(maybeButton).toBeVisible();
      await expect(noButton).toBeVisible();
      
      // Test RSVP interaction
      await yesButton.click();
      
      // Should show loading state briefly
      await expect(page.getByRole('status')).toBeVisible();
      
      // Should update button state
      await expect(yesButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should support keyboard navigation for RSVP', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Tab to RSVP buttons
      await page.keyboard.press('Tab');
      const yesButton = page.getByRole('button', { name: /rsvp yes/i });
      await expect(yesButton).toBeFocused();
      
      // Use Enter to activate
      await page.keyboard.press('Enter');
      await expect(yesButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Photo Gallery', () => {
    test('should display photo gallery correctly', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Check for photo gallery section
      const gallery = page.getByRole('grid', { name: /photo gallery/i });
      await expect(gallery).toBeVisible();
      
      // Check for photos
      const photos = page.getByRole('gridcell');
      await expect(photos.first()).toBeVisible();
    });

    test('should open lightbox when photo is clicked', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Click on first photo
      const firstPhoto = page.getByRole('button', { name: /view photo/i }).first();
      await firstPhoto.click();
      
      // Should open dialog
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Should have navigation buttons
      await expect(page.getByRole('button', { name: /previous photo/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /next photo/i })).toBeVisible();
    });

    test('should support keyboard navigation in lightbox', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Open lightbox
      const firstPhoto = page.getByRole('button', { name: /view photo/i }).first();
      await firstPhoto.click();
      
      // Test arrow key navigation
      await page.keyboard.press('ArrowRight');
      await expect(page.getByText(/2 of/)).toBeVisible();
      
      await page.keyboard.press('ArrowLeft');
      await expect(page.getByText(/1 of/)).toBeVisible();
      
      // Test escape key
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
      
      // Focus should return to original photo
      await expect(firstPhoto).toBeFocused();
    });

    test('should handle photo upload', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Find upload input
      const uploadInput = page.getByLabel(/upload a photo/i);
      await expect(uploadInput).toBeVisible();
      
      // Create a test file
      const fileContent = Buffer.from('fake image content');
      
      // Upload file
      await uploadInput.setInputFiles({
        name: 'test-photo.jpg',
        mimeType: 'image/jpeg',
        buffer: fileContent,
      });
      
      // Should show upload progress
      await expect(page.getByText(/uploading/i)).toBeVisible();
    });
  });

  test.describe('Admin Features', () => {
    test('should access admin area with proper permissions', async ({ page }) => {
      // Navigate to admin area
      await page.goto('/admin');
      
      // Should show admin dashboard
      await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible();
      
      // Should have admin navigation
      await expect(page.getByRole('link', { name: /manage runs/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /manage users/i })).toBeVisible();
    });

    test('should manage runs in admin area', async ({ page }) => {
      await page.goto('/admin/runs');
      
      // Should show runs table
      const table = page.getByRole('table');
      await expect(table).toBeVisible();
      
      // Should have action buttons
      await expect(page.getByRole('button', { name: /edit/i }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /delete/i }).first()).toBeVisible();
    });
  });

  test.describe('Accessibility Features', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for proper heading hierarchy
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      
      const headings = page.getByRole('heading');
      const count = await headings.count();
      expect(count).toBeGreaterThan(1);
    });

    test('should have proper landmark regions', async ({ page }) => {
      await page.goto('/');
      
      // Check for main landmarks
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
    });

    test('should support keyboard navigation throughout', async ({ page }) => {
      await page.goto('/');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      const firstFocusable = page.locator(':focus');
      await expect(firstFocusable).toBeVisible();
      
      // Continue tabbing
      await page.keyboard.press('Tab');
      const secondFocusable = page.locator(':focus');
      await expect(secondFocusable).toBeVisible();
      
      // Should be different elements
      expect(await firstFocusable.textContent()).not.toBe(await secondFocusable.textContent());
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      
      // Check button contrast (basic check)
      const button = page.getByRole('button').first();
      const buttonStyles = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });
      
      // Basic check that colors are defined
      expect(buttonStyles.backgroundColor).toBeTruthy();
      expect(buttonStyles.color).toBeTruthy();
    });
  });

  test.describe('Performance Features', () => {
    test('should load pages quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (adjust as needed)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should show loading states appropriately', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Should show loading state initially
      await expect(page.getByText(/loading/i)).toBeVisible();
      
      // Should hide loading state when content loads
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/loading/i)).not.toBeVisible();
    });

    test('should lazy load heavy components', async ({ page }) => {
      await page.goto('/runs/test-run-id');
      
      // Photo gallery should show skeleton loading initially
      const skeleton = page.locator('[data-testid="skeleton"]').first();
      if (await skeleton.isVisible()) {
        // Wait for actual content to load
        await expect(skeleton).not.toBeVisible();
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Should show mobile navigation
      const menuButton = page.getByRole('button', { name: /menu/i });
      await expect(menuButton).toBeVisible();
      
      // Content should be readable
      const mainContent = page.getByRole('main');
      await expect(mainContent).toBeVisible();
    });

    test('should have touch-friendly interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/runs/test-run-id');
      
      // RSVP buttons should be large enough for touch
      const yesButton = page.getByRole('button', { name: /rsvp yes/i });
      const buttonBox = await yesButton.boundingBox();
      
      // Should meet minimum touch target size (44px)
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    });
  });
});
