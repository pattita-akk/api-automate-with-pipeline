import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apiTests',
  timeout: 30000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: 'https://automationexercise.com'
  }
});
