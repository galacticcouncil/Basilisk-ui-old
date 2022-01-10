import { Page, ChromiumBrowserContext } from 'playwright';
import {
  toMatchImageSnapshot,
} from 'jest-image-snapshot';
import {
  initBrowserWithExtension,
  importPolkadotDappAccount,
} from '../../utils/polkadot-dapp-utils';

import testUnitWalletPage from './units/wallet-page';
import testUnitPolkadotUiDemoTest from './units/polkadot-dapp';

const { test, expect } = require('@playwright/test');

// More info https://github.com/playwright-community/expect-playwright
expect.extend({ toMatchImageSnapshot });

let page: Page;
let browserContext: ChromiumBrowserContext;
let extensionURL: string;

test.skip().describe('The Polkadot.js Extension browser should', () => {
  test.beforeAll(async () => {
    const init = await initBrowserWithExtension();

    browserContext = init.browserContext;
    extensionURL = init.extensionURL;

    await browserContext.tracing.start({ screenshots: true, snapshots: true });
    await browserContext.tracing.startChunk({
      title: 'Init Browser with Polkadot.js extension',
    });

    page = await importPolkadotDappAccount({
      browserContext,
      extensionURL,
      accountCredentials: {
        seed: process.env.E2E_TEST_ACCOUNT_SEED_ALICE || '',
        name: process.env.E2E_TEST_ACCOUNT_NAME_ALICE || '',
        password: process.env.E2E_TEST_ACCOUNT_PASSWORD_ALICE || '',
      },
    });
    await browserContext.tracing.stopChunk({
      path: './traces/wallet-page/initPolkadotJsExt.zip',
    });
  });

  test.afterAll(async () => {
    // await browserContext.tracing.stop({ path: './traces/wallet-page.zip' });

    await browserContext?.close();

    // browserContext = null;
    // page = null;
    extensionURL = '';
  });

  test('open Basilisk UI app Wallet page', async () =>
    await testUnitWalletPage(browserContext));

  test('open PolkadotUI app', async () =>
    await testUnitPolkadotUiDemoTest(browserContext));
});
