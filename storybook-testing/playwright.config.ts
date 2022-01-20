// baseURL

import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: '../src',
  outputDir: './results',
  globalTeardown: require.resolve('./teardown'),
  timeout: 60000,
  expect: {
    timeout: 60 * 1000,
  },
  use: {
    actionTimeout: 10 * 1000,
    channel: 'chromium',
    headless: true,
    ignoreHTTPSErrors: true,
    navigationTimeout: 60 * 1000,
    screenshot: 'only-on-failure',
  },
  reporter: [
    [process.env.NODE_ENV !== 'CI' ? 'list' : 'github'],
    ['junit', { outputFile: 'storybook-testing/results/storybook-testing-results.xml' }],
  ],
};

export default config;
