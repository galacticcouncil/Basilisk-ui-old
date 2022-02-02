import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  globalTeardown: require.resolve('./teardown'),
  outputDir: './results/screenshot-comparison-fails',
  snapshotDir: './screenshots-to-test-against',
  testDir: '../src',
  testMatch: /.*\.stories.test\.ts/,
  use: {
    baseURL: process.env.NODE_ENV === 'CI' ? 'http://10.0.0.227:6006/iframe.html?id=' : 'http://localhost:6006/iframe.html?id=',
    channel: 'chromium',
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
  },
  reporter: [
    [process.env.NODE_ENV === 'CI' ? 'github' : 'list'],
    ['junit', { outputFile: 'storybook-testing/results/storybook-testing-results.xml' }],
  ],
};

export default config;