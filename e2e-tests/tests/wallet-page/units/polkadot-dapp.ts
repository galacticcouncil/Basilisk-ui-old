import { Page, ChromiumBrowserContext } from 'playwright';
const { expect } = require('@playwright/test');

import { toMatchImageSnapshot } from 'jest-image-snapshot';

// More info https://github.com/playwright-community/expect-playwright
expect.extend({ toMatchImageSnapshot });

const testUnitPolkadotUiDemoTest = async (
  browserContext: ChromiumBrowserContext
) => {
  await browserContext.tracing.startChunk({
    title: 'testUnitPolkadotUiDemoTest',
  });

  const page: Page = await browserContext.newPage();

  await page.goto(
    'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9988#/accounts'
  );

  await new Promise((res) => {
    browserContext.on('page', async (confPage) => {
      await confPage.waitForLoadState();
      await page.waitForTimeout(3000);

      await confPage.click(
        '//div[(text()="Yes, allow this application access")]/..'
      );
      res(0);
    });
  });

  await page.waitForTimeout(2000);
  const testAccItem = await page.waitForSelector(
    `//div[text()="${process.env.TEST_ACCOUNT_NAME} (EXTENSION)"]/ancestor-or-self::tr`,
    { timeout: 20000 }
  );

  await browserContext.tracing.stopChunk({
    path: './traces/wallet-page/testUnitPolkadotUiDemoTest.zip',
  });

  await expect(testAccItem).not.toBe(null);
};

export default testUnitPolkadotUiDemoTest;
