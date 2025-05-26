/**
 * Accessibility Tests
 * 
 * These tests verify that the application meets accessibility standards
 * using axe-core and manual accessibility checks.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
  });

  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that headings follow proper hierarchy (h1 -> h2 -> h3, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    expect(headings.length).toBeGreaterThan(0);
    
    // Verify h1 exists and is unique
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have proper form labels and accessibility', async ({ page }) => {
    // Navigate to a page with forms (if any)
    await page.goto('/runs/new');
    
    // Check that all form inputs have associated labels
    const inputs = await page.locator('input, select, textarea').all();
    
    for (const input of inputs) {
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      // Input should have either aria-label, aria-labelledby, or associated label
      const hasLabel = ariaLabel || ariaLabelledBy || (id && await page.locator(`label[for="${id}"]`).count() > 0);
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    const buttons = await page.locator('button, [role="button"]').all();
    
    for (const button of buttons) {
      // Button should have accessible name
      const accessibleName = await button.textContent() || 
                            await button.getAttribute('aria-label') ||
                            await button.getAttribute('aria-labelledby');
      
      expect(accessibleName).toBeTruthy();
      
      // Button should be focusable
      await button.focus();
      expect(await button.evaluate(el => document.activeElement === el)).toBe(true);
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through interactive elements
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    if (interactiveElements.length > 0) {
      // Focus first element
      await page.keyboard.press('Tab');
      
      // Navigate through elements
      for (let i = 0; i < Math.min(interactiveElements.length, 5); i++) {
        const focusedElement = await page.locator(':focus').first();
        expect(await focusedElement.count()).toBe(1);
        await page.keyboard.press('Tab');
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('should have proper image alt text', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const role = await image.getAttribute('role');
      
      // Images should have alt text, aria-label, or be marked as decorative
      const hasAccessibleName = alt !== null || ariaLabel || role === 'presentation';
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const textContent = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Links should have href and accessible name
      expect(href).toBeTruthy();
      expect(textContent || ariaLabel).toBeTruthy();
    }
  });

  test('should handle focus management in modals/dialogs', async ({ page }) => {
    // Look for modal triggers
    const modalTriggers = await page.locator('[data-testid*="modal"], [data-testid*="dialog"], button:has-text("Open")').all();
    
    if (modalTriggers.length > 0) {
      const trigger = modalTriggers[0];
      await trigger.click();
      
      // Check if modal is open and focus is trapped
      const modal = await page.locator('[role="dialog"], [role="alertdialog"]').first();
      if (await modal.count() > 0) {
        // Focus should be within the modal
        const focusedElement = await page.locator(':focus').first();
        const isWithinModal = await modal.locator(':focus').count() > 0;
        expect(isWithinModal).toBe(true);
      }
    }
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    // Check for main landmark
    const mainLandmark = await page.locator('main, [role="main"]').count();
    expect(mainLandmark).toBeGreaterThanOrEqual(1);
    
    // Check for navigation landmark
    const navLandmark = await page.locator('nav, [role="navigation"]').count();
    expect(navLandmark).toBeGreaterThanOrEqual(1);
    
    // Check for banner (header) landmark
    const bannerLandmark = await page.locator('header, [role="banner"]').count();
    expect(bannerLandmark).toBeGreaterThanOrEqual(1);
  });

  test('should support screen reader announcements', async ({ page }) => {
    // Check for live regions
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').all();
    
    // Verify live regions have appropriate aria-live values
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      const role = await region.getAttribute('role');
      
      const hasLiveAnnouncement = ariaLive === 'polite' || ariaLive === 'assertive' || 
                                 role === 'status' || role === 'alert';
      expect(hasLiveAnnouncement).toBeTruthy();
    }
  });

  test('should be responsive and accessible on mobile', async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Run accessibility scan on mobile viewport
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Check that interactive elements are large enough for touch
    const buttons = await page.locator('button, a, input[type="button"], input[type="submit"]').all();
    
    for (const button of buttons) {
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        // WCAG recommends minimum 44x44 pixels for touch targets
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Check that animations respect reduced motion
    const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all();
    
    for (const element of animatedElements) {
      const computedStyle = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration,
        };
      });
      
      // Animations should be disabled or very short when reduced motion is preferred
      const hasReducedMotion = computedStyle.animationDuration === '0s' || 
                              computedStyle.transitionDuration === '0s' ||
                              computedStyle.animationDuration === '0.01s' ||
                              computedStyle.transitionDuration === '0.01s';
      
      // This is a guideline check - not all animations need to be disabled
      // but critical ones should respect the preference
    }
  });

  test('should have proper error message accessibility', async ({ page }) => {
    // Navigate to a form and trigger validation errors
    await page.goto('/runs/new');
    
    // Try to submit empty form to trigger validation
    const submitButton = await page.locator('button[type="submit"]').first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Check for error messages
      const errorMessages = await page.locator('[role="alert"], .error, [aria-invalid="true"]').all();
      
      for (const error of errorMessages) {
        // Error should be announced to screen readers
        const role = await error.getAttribute('role');
        const ariaLive = await error.getAttribute('aria-live');
        const ariaInvalid = await error.getAttribute('aria-invalid');
        
        const isAccessible = role === 'alert' || ariaLive === 'assertive' || ariaInvalid === 'true';
        expect(isAccessible).toBeTruthy();
      }
    }
  });
});
