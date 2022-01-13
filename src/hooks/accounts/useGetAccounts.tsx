import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { useCallback } from 'react';

// prefix for the ss58 address formatting of substrate addresses
export const basiliskAddressPrefix = 10041;

/**
 * Used to fetch either all accounts, or accounts matching the given
 * set of parameters e.g. 'isActive'.
 */
export const useGetAccounts = () =>
  useCallback(async () => {
    // TODO: use `config.appName`
    // ensure we're connected to the polkadot.js extension
    await web3Enable('basilisk-ui');

    // get all the accounts from the polkadot.js extension
    const accounts = (await web3Accounts())
      // transform the returned accounts into the required entity format
      .map((account) => {
        console.log('getAccounts', account);
        const address = encodeAddress(
          decodeAddress(account.address),
          basiliskAddressPrefix
        );
        return {
          id: address,
          name: account.meta.name,
          balances: [],
        };
      });

    // return all retrieved accounts
    return accounts;
  }, []);
