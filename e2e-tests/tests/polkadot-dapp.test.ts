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

describe('The Extension page should', () => {
  beforeAll(async () => {
    const init = await initBrowserWithExtension();

    browserContext = init.browserContext;
    extensionURL = init.extensionURL;

    await browserContext.tracing.start({ screenshots: true, snapshots: true });

    page = await importPolkadotDappAccount({
      browserContext,
      extensionURL,
      accountCredentials: {
        seed: process.env.TEST_ACCOUNT_SEED || '',
        name: process.env.TEST_ACCOUNT_NAME || '',
        password: process.env.TEST_ACCOUNT_PASS || '',
      },
    });
  });

  afterAll(async () => {
    await browserContext.tracing.stop({ path: './traces/polkadot-dapp.zip' });
    await browserContext?.close();
    // browserContext = null;
    // page = null;
    extensionURL = '';
  });

  it('Open Polkadot UI', async () => {
    await page.goto(
      'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9988#/accounts'
    );
    // await page.goto(
    //   'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbasilisk.api.onfinality.io%2Fpublic-ws#/accounts'
    // );

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

    await expect(testAccItem).not.toBe(null);
  });
});
