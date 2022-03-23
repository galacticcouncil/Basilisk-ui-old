import { BrowserExtension, Extension } from '../../../generated/graphql';
import promiseRetry from 'promise-retry';

// id for cache normalization purposes, serves no other purpose
const id = '0';
// how long to wait before we check for the presence of the extension

export const extensionToKey = (browserExtension: BrowserExtension) => ({
  [BrowserExtension.Polkadotjs]: 'polkadot-js',
  [BrowserExtension.Talisman]: 'talisman'
})[browserExtension]

export const checkBrowserExtension = async (browserExtension: BrowserExtension): Promise<{ isAvailable: boolean, browserExtension: BrowserExtension }> => (
  await new Promise(
    (resolve, reject) => {
      promiseRetry(async (retry, attempt) => {
        console.log('attempt', attempt);
        const key = extensionToKey(browserExtension)
        const isAvailable = !!(window as any).injectedWeb3?.[key];
        isAvailable
          ? (
            resolve({
              /**
               * We're not using isWeb3Available from `@polkadot/extension-dapp`,
               * because it does not detect the `injectedWeb3` reliably.
               */
              isAvailable,
              browserExtension
            })
          )
          : retry('')
      }, {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 200,
      }).catch(reject);
    }
  )
)

// TODO: handle multiple extensions e.g. Talisman and polkadot.js
// function that checks if an extension is available or not
export const getExtension = async (): Promise<Extension> => {
  // import the constant here to enable mocking in tests
  const allBrowserExtensions = await Promise.all([
    checkBrowserExtension(BrowserExtension.Polkadotjs),
    checkBrowserExtension(BrowserExtension.Talisman)
  ]);

  const isAvailable = !!allBrowserExtensions.find(({ isAvailable }) => isAvailable);
  // available browser extensions
  const browserExtensions = allBrowserExtensions
    .filter(({ isAvailable }) => isAvailable)
    .map(({ browserExtension }) => browserExtension);

  return {
    id,
    // we don't call web3Enable here
    // to avoid triggering the polkadot.js permission popup right away
    // turn `isAvailable` into a type policy field derived from the
    // `browserExtensions` array length
    isAvailable,
    browserExtensions,
    // put this to local stoarge
    activeBrowserExtension: undefined
  };
};
