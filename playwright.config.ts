import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 30 * 1000,
  },
  testDir: './src/__tests__/tests',
});
