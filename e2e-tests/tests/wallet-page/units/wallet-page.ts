import { Page, ChromiumBrowserContext } from 'playwright';
// import { ElementHandleForTag } from 'playwright-core';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const { expect } = require('@playwright/test');

// More info https://github.com/playwright-community/expect-playwright
expect.extend({ toMatchImageSnapshot });

const testUnitWalletPage = async (browserContext: ChromiumBrowserContext) => {
  await browserContext.tracing.startChunk({ title: 'testUnitWalletPage' });

  const page: Page = await browserContext.newPage();

  await page.goto('http://127.0.0.1:3000/#/wallet');

  await page.waitForLoadState();

  // await page.click('//a[(text()="Wallet")]');

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

  await page.waitForTimeout(15000);

  await page.reload();

  await page.waitForTimeout(4000);

  const testAccItem = await page.waitForSelector(
    `//h3[text()="${process.env.E2E_TEST_ACCOUNT_NAME_ALICE}"]`,
    { timeout: 20000 }
  );
  await browserContext.tracing.stopChunk({ path: './traces/wallet-page/testUnitWalletPage.zip' });

  await expect(testAccItem).not.toBe(null);
};

export default testUnitWalletPage;
