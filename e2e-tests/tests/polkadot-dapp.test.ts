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
    // page = browserContext.pages()[0]
  });

  afterAll(async () => {
    await browserContext.tracing.stop({ path: './traces/polkadot-dapp.zip' });
    await browserContext?.close();
    // browserContext = null;
    // page = null;
    extensionURL = '';
  });

  // beforeEach(async () => {
  //   if (!extensionURL) {
  //     console.error('Invalid extensionURL', { extensionURL })
  //   }
  //   await page.bringToFront()
  //   await page.goto(extensionURL)
  //   await page.waitForTimeout(1000)
  //   await CLOSE_PAGES(browserContext)
  // })

  // await importPolkadotDappAccount();
  // await page.waitForTimeout(2000);
  // await browserContext.tracing.stop({ path: './trace.zip' });
  //
  // // await page.goto('https://polkadot.js.org/apps/#/explorer');
  // await page.goto(
  //   'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9988#/accounts'
  // );
  // console.log('>>> page ', await page.title());
  //
  // browserContext.on('page', async confPage => {
  //   await confPage.waitForLoadState();
  //   await confPage.click(
  //     '//div[(text()="Yes, allow this application access")]/..'
  //   );
  // });
  //
  // await page.waitForTimeout(2000);
  // await page.click(
  //   `//div[text()="${process.env.TEST_ACCOUNT_NAME} (EXTENSION)"]/ancestor-or-self::tr/descendant-or-self::button[contains(@class, "send-button")]`
  // );
  // await page.click(
  //   `//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="send to address"]/../descendant-or-self::i`
  // );
  // await page.click(
  //   `//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="send to address"]/../descendant-or-self::div[@name="alice"]/descendant-or-self::div[@class="address"]`,
  //   { force: true }
  // );
  // await page.fill(
  //   `//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="amount"]/../descendant-or-self::input`,
  //   '3'
  // );
  // await page.click(
  //   `//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::button[text()="Make Transfer"]`
  // );
  // await page.click(
  //   `//div[@data-testid="modal"]/descendant-or-self::button[text()="Sign and Submit"]`
  // );
  //
  // browserContext.on('page', async confPage => {
  //   await confPage.waitForLoadState('load');
  //   await confPage.fill(
  //     '//body/descendant-or-self::input[@type="password"]',
  //     process.env.TEST_ACCOUNT_PASS
  //   );
  //   await confPage.click(
  //     '//body/descendant-or-self::div[(text()="Sign the transaction")]/..'
  //   );
  // });

  it('Open Polkadot UI', async () => {
    await page.goto(
      'https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9988#/accounts'
    );
    // await page.goto(
    //   'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbasilisk.api.onfinality.io%2Fpublic-ws#/accounts'
    // );

    browserContext.on('page', async (confPage) => {
      await confPage.waitForLoadState();
      await confPage.click(
        '//div[(text()="Yes, allow this application access")]/..'
      );
    });

    await page.waitForTimeout(2000);
    const testAccItem = await page.waitForSelector(
      `//div[text()="${process.env.TEST_ACCOUNT_NAME} (EXTENSION)"]/ancestor-or-self::tr`,
      { timeout: 20000 }
    );

    // await expect(testAccItem).resolves.any(ElementHandleForTag);
    await expect(testAccItem).not.toBe(null);
  });
});
