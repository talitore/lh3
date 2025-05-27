import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: './playwright.reporter.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Enable accessibility testing
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'cross-env E2E_TESTING_MODE=true SKIP_AUTH_CHECKS=true MOCK_AUTH_FOR_TESTS=true USE_MOCK_DATA=true pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'ignore',
    timeout: 60000, // Increase timeout to 60 seconds
  },
  // Global timeout for tests
  timeout: 30000,
  // Set environment variables for tests
  env: {
    E2E_TESTING_MODE: 'true',
    SKIP_AUTH_CHECKS: 'true',
    MOCK_AUTH_FOR_TESTS: 'true',
    USE_MOCK_DATA: 'true',
  },
});
