import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* Consolidated Global Settings */
  use: {
    baseURL: 'http://localhost:5173', // Matches your Vite port
    trace: 'on-first-retry',         // Records a video/trace if a test fails
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Automatically start local dev server */
  webServer: {
    command: 'npm run dev',           // Command to start your app
    url: 'http://localhost:5173',     // Playwright waits for this URL to be ready
    reuseExistingServer: !process.env.CI,
  },
});