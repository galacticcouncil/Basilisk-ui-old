import { BrowserExtension, Extension, InputMaybe, Maybe } from '../../../generated/graphql';
import promiseRetry from 'promise-retry';

// id for cache normalization purposes, serves no other purpose
const id = '0';
// how long to wait before we check for the presence of the extension

export const extensionToKey = (browserExtension: BrowserExtension) => ({
  [BrowserExtension.Polkadotjs]: 'polkadot-js',
  [BrowserExtension.Talisman]: 'talisman',
  [BrowserExtension.Unset]: null
})[browserExtension]

export const checkBrowserExtension = async (browserExtension: BrowserExtension): Promise<{ isAvailable: boolean, browserExtension: BrowserExtension }> => (
  await new Promise(
    (resolve, reject) => {
      promiseRetry(async (retry, attempt) => {
        const key = extensionToKey(browserExtension)
        const isAvailable = key && !!(window as any).injectedWeb3?.[key];
        console.log('attempt', attempt, browserExtension, key, isAvailable);
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
export const getExtension = async (persistedBrowserExtension?: { browserExtension?: Maybe<BrowserExtension> | undefined }): Promise<Extension> => {
  // import the constant here to enable mocking in tests
  const allBrowserExtensions = (await Promise.allSettled([
    checkBrowserExtension(BrowserExtension.Polkadotjs),
    checkBrowserExtension(BrowserExtension.Talisman)
  ]))
    .map(promiseResult => (
      promiseResult.status === 'fulfilled' ? promiseResult.value : undefined
    ));

  console.log('allBrowserExtensions', allBrowserExtensions);


  const isAvailable = !!allBrowserExtensions.find(extension => extension?.isAvailable);
  // available browser extensions
  const browserExtensions = allBrowserExtensions
    .filter(extension => extension?.isAvailable)
    .map(extension => extension?.browserExtension);

  return {
    id,
    // we don't call web3Enable here
    // to avoid triggering the polkadot.js permission popup right away
    // turn `isAvailable` into a type policy field derived from the
    // `browserExtensions` array length
    isAvailable,
    // TODO: get rid of this typecast in prior code
    browserExtensions: (browserExtensions as BrowserExtension[]),
    // put this to local stoarge
    activeBrowserExtension: persistedBrowserExtension?.browserExtension || null
  };
};
