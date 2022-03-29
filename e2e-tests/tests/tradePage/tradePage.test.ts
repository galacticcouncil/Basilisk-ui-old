import { faTasks } from '@fortawesome/free-solid-svg-icons'
import { test, expect, ChromiumBrowserContext } from '@playwright/test'
import { importPolkadotDappAccount, initBrowserWithExtension } from '../../utils/polkadot-dapp-utils'

test.describe('tradePage', async () => {

    let browserContext: ChromiumBrowserContext
    let extensionURL

    test.beforeAll(async () => {
        // start chromium with the extension configured
        // TODO: rename init to launch
        const launch = await initBrowserWithExtension();
        browserContext = launch.browserContext;
        extensionURL = launch.extensionURL;

        await browserContext.tracing.start({ screenshots: true, snapshots: true });
        await browserContext.tracing.startChunk({
            title: 'Init Browser with Polkadot.js extension',
        });

        // import Alice to the polkadot extension
        await importPolkadotDappAccount({
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

    test('testing', async () => {
        console.log('testing');
        // browserContext.newPage
        // browserContext.waitForEvent
        const page = await browserContext.newPage();
        await page.goto('http://localhost:3000/#/')
        await page.locator('text=Connect wallet').click();

        await new Promise((res) => {
            const listener = async (confPage) => {
                await confPage.waitForLoadState();
                await confPage.click(
                    '//div[(text()="Yes, allow this application access")]/..'
                );
                browserContext.removeListener('page', listener);
                res(0);
            }
            browserContext.on('page', listener);
        });

        await page.locator('.account-item :text("Alice")').click();
        const wallet = page.locator('.wallet');
        await expect(wallet).toContainText('Alice');
        await page.locator('.asset-balance-input__asset-info').last().click();
        await page.locator('.asset-selector__asset-item :text("kUSD")').first().click();
        await page.fill('.asset-balance-input input', '1');
        await page.locator('.submit-button').click();
        const notification = page.locator('.notifications-bar');
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('transaction pending')

        await new Promise((res) => {
            const listener = async (passwordPage) => {
                await passwordPage.waitForLoadState();
                await passwordPage.fill('input[type="password"]', 'qweqweqwe');
                await passwordPage.locator(':text("Sign the transaction")').click();
                browserContext.removeListener('page', listener);
                res(0);
            }
            browserContext.on('page',listener );
        });
        await expect(notification).toContainText('transaction success',{timeout:30000})

        await page.pause();
    });
})