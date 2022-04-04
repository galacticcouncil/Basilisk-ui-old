import { Extension } from '../../../generated/graphql';
import promiseRetry from 'promise-retry';

// id for cache normalization purposes, serves no other purpose
const id = '0';
// how long to wait before we check for the presence of the extension

// TODO: handle multiple extensions e.g. Talisman and polkadot.js
// function that checks if an extension is available or not
export const getExtension = async (): Promise<Extension> => {
  // import the constant here to enable mocking in tests
  const { isAvailable }: Pick<Extension, 'isAvailable'> = await new Promise(
    (resolve, reject) => {
      promiseRetry(async (retry, attempt) => {
        console.log('attempt', attempt);
        const isAvailable = !!(window as any).injectedWeb3?.['polkadot-js'];
        console.log('getExtension attempt: #', attempt, isAvailable);
        isAvailable
          ? (
            resolve({
              /**
               * We're not using isWeb3Available from `@polkadot/extension-dapp`,
               * because it does not detect the `injectedWeb3` reliably.
               */
              isAvailable,
            })
          )
          : retry('')
      }, {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 200,
      }).catch(reject);
    }
  );

  return {
    id,
    // we don't call web3Enable here
    // to avoid triggering the polkadot.js permission popup right away
    isAvailable,
  };
};
