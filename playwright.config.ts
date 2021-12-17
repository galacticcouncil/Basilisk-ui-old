import { PlaywrightTestConfig } from '@playwright/test';

const env = require('dotenv');
env.config({
  path:
    process.env.NODE_ENV !== 'CI' ? `.env.test.e2e.local` : '.env.test.e2e.ci',
});

const config: PlaywrightTestConfig = {
  globalTeardown: require.resolve('./global-teardown'),
  timeout: 60000,
  expect: {
    timeout: 60 * 1000,
  },
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 60 * 1000,
    screenshot: 'only-on-failure',
    channel: 'chromium',
  },
  reporter: [['list'], ['junit', { outputFile: 'ui-app-e2e-results.xml' }]],
};

export default config;
