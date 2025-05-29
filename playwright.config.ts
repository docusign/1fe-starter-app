import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 30 * 1000,
  },
  use: {
    testIdAttribute: 'data-qa',
  },
  testDir: './src/__tests__/tests',
  testMatch: '**/*.playwright.ts',
});
