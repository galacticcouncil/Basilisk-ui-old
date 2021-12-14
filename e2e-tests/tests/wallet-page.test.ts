import { Page, ChromiumBrowserContext } from 'playwright';
// import { ElementHandleForTag } from 'playwright-core';
import {
  MatchImageSnapshotOptions,
  toMatchImageSnapshot,
} from 'jest-image-snapshot';
import {
  CLOSE_PAGES,
  initBrowserWithExtension,
  importPolkadotDappAccount,
} from '../utils/polkadot-dapp-utils';

expect.extend({ toMatchImageSnapshot });

let page: Page;
let browserContext: ChromiumBrowserContext;
let extensionURL: string;

describe('The App Wallet page should', () => {
  beforeAll(async () => {
    const init = await initBrowserWithExtension();

    browserContext = init.browserContext;
    extensionURL = init.extensionURL;

    await browserContext.tracing.start({ screenshots: true, snapshots: true });

    page = await importPolkadotDappAccount({
      browserContext,
      extensionURL,
      accountCredentials: {
        seed: process.env.TEST_ACCOUNT_SEED_ALICE || '',
        name: process.env.TEST_ACCOUNT_NAME_ALICE || '',
        password: process.env.TEST_ACCOUNT_PASS_ALICE || '',
      },
    });
    // page = browserContext.pages()[0]
  });

  afterAll(async () => {
    await browserContext.tracing.stop({ path: './traces/wallet-page.zip' });
    await browserContext?.close();
    // browserContext = null;
    // page = null;
    extensionURL = '';
  });

  it('Open Polkadot UI', async () => {
    await page.goto('http://localhost:3000/wallet');
    await page.waitForLoadState();

    browserContext.on('page', async (confPage) => {
      await confPage.waitForLoadState();

      await confPage.click(
        '//div[(text()="Yes, allow this application access")]/..'
      );
    });

    await page.waitForTimeout(1000);

    await page.reload();

    const testAccItem = await page.waitForSelector(
      `//h3[text()="${process.env.TEST_ACCOUNT_NAME_ALICE}"]`,
      { timeout: 20000 }
    );
    // await page.waitForTimeout(100000);

    // await expect(testAccItem).resolves.any(ElementHandleForTag);
    await expect(testAccItem).not.toBe(null);
  });
});
