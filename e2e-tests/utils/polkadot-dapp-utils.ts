import { chromium, ChromiumBrowserContext, Page } from 'playwright';
import { join } from 'path';

export const EXTENSION_PATH = join(__dirname, process.env.EXTENSSION_SRC || '');

export const isExtensionURL = (url: string) =>
  url.startsWith('chrome-extension://');

export const CLOSE_PAGES = async (browserContext: ChromiumBrowserContext) => {
  const pages = (await browserContext?.pages()) || [];
  for (const page of pages) {
    const url = await page.url();
    if (!isExtensionURL(url)) {
      await page.close();
    }
  }
};

export const initBrowserWithExtension = async () => {
  const userDataDir = `/tmp/test-user-data-${Math.random()}`;
  let extensionURL: string = '';
  const browserContext = (await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      // Follow suggestions on https://playwright.dev/docs/ci#docker
      '--disable-dev-shm-usage',
      '--ipc=host',
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
    locale: 'en-GB',
  })) as ChromiumBrowserContext;

  /**
   * The background page is useful to retrieve the extension id so that we
   * could programatically open the extension page.
   *
   * There is uncertain timing of backgroundPages. Sometimes the
   * `browserContext.backgroundPages()` will return empty at the beginning,
   * so we have to rely on the `browserContext.on('backgroundpage')` to get
   * the background page. But sometimes the 'backgroundpage' would never be
   * triggered and the `browserContext.backgroundPages()` would give an array
   * with the existing background page.
   */
  const setExtensionURL = (backgroundPage: Page) => {
    const url = backgroundPage.url();
    const [, , extensionId] = url.split('/');
    // extensionURL = `chrome-extension://${extensionId}/popup.html?not_popup=1`
    extensionURL = `chrome-extension://${extensionId}/index.html#/`;
  };

  const page = await browserContext.newPage();
  await page.bringToFront();
  await page.goto('chrome://inspect/#extensions');

  browserContext.on('backgroundpage', setExtensionURL);
  const backgroundPages = browserContext.backgroundPages();
  if (backgroundPages.length) {
    setExtensionURL(backgroundPages[0]);
  }
  for (const x in [...Array(100)]) {
    if (extensionURL || !x) {
      break;
    }
    await page.waitForTimeout(1000);
  }
  return { browserContext, extensionURL };
};

export const initPolkadotDapp = async (
  browserContext: ChromiumBrowserContext,
  extensionURL: string
) => {
  const page = browserContext.pages()[0];
  // await browserContext.tracing.start({ screenshots: true, snapshots: true });

  await page.goto(extensionURL);
  await page.bringToFront();

  await page.click('.Button-sc-1gyneog-0');
  await page.click('.popupMenus .popupToggle');
  await page.click('.menuItem a[href="#/account/import-seed"]');
  await page.fill(
    'textarea[class*="TextInputs__TextArea-sc"]',
    process.env.TEST_ACCOUNT_SEED || ''
  );
  await page.click('button[class*=Button-]');
  await page.fill('input[type=text]', process.env.TEST_ACCOUNT_NAME || '');
  await page.fill('input[type=password]', process.env.TEST_ACCOUNT_PASS || '');
  await page.fill(
    '//label[(text()="Repeat password for verification")]/following-sibling::input',
    process.env.TEST_ACCOUNT_PASS || ''
  );
  await page.click(
    '//div[(text()="Add the account with the supplied seed")]/..'
  );

  return page;
};

export const openPages = async (
  browserContext: ChromiumBrowserContext,
  urls: string[]
) => {
  return await Promise.all(
    urls.map(async url => {
      const newPage = await browserContext.newPage();
      await newPage.goto(url);
      await newPage.waitForLoadState('load');
    })
  );
};
