import { Extension } from '../../../generated/graphql';

// id for cache normalization purposes, serves no other purpose
const id = '0';

// TODO: handle multiple extensions e.g. Talisman and polkadot.js
// function that checks if an extension is available or not
export const getExtension = (): Extension => {
  // import the constant here to enable mocking in tests
  const { isWeb3Injected } = require('@polkadot/extension-dapp');

  return {
    id,
    // we don't call web3Enable here
    // to avoid triggering the polkadot.js permission popup right away
    isAvailable: isWeb3Injected,
  };
};
