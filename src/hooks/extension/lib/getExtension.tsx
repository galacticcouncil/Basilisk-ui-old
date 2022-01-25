import { Extension } from '../../../generated/graphql';

// id for cache normalization purposes, serves no other purpose
const id = '0';
// how long to wait before we check for the presence of the extension
const waitForIsAvailableDuration = 100;

// TODO: handle multiple extensions e.g. Talisman and polkadot.js
// function that checks if an extension is available or not
export const getExtension = async (): Promise<Extension> => {
  // import the constant here to enable mocking in tests
  const { isAvailable }: Pick<Extension, 'isAvailable'> = await new Promise(
    (resolve) => {
      setTimeout(async () => {
        resolve({
          /**
           * We're not using isWeb3Available from `@polkadot/extension-dapp`,
           * because it does not detect the `injectedWeb3` reliably.
           */
          // TODO: add polling of the extension availability,
          // that will resolve as soon as this is available, or timeout after a certain time
          isAvailable: !!(window as any).injectedWeb3['polkadot-js'],
        });
      }, waitForIsAvailableDuration);
    }
  );

  return {
    id,
    // we don't call web3Enable here
    // to avoid triggering the polkadot.js permission popup right away
    isAvailable,
  };
};
