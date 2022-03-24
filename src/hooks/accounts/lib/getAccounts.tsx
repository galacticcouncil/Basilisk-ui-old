import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Account, Extension } from '../../../generated/graphql';
import constants from '../../../constants';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { ApolloCache } from '@apollo/client';
import { gql } from 'graphql.macro';
import { extensionAdapter } from '../../extension/lib/extensionAdapter';

/**
 * Used to fetch all accounts
 * @returns an array of accounts in required format
 */
export const getAccounts = async (cache: ApolloCache<any>): Promise<Account[] | undefined> => {
  const extension = extensionAdapter(cache);

  console.log('getAccounts', extension);
  // ensure we're connected to the polkadot.js extension
  await extension?.web3Enable(constants.basiliskWeb3ProviderName);

  // get all the accounts from the polkadot.js extension
  // return all retrieved accounts
  const accounts = await extension?.web3Accounts();

  console.log('getAccounts accounts', accounts);

  // transform the returned accounts into the required entity format
  return accounts?.map((account) => {
    return {
      id: encodeAddress(decodeAddress(account.address), constants.basiliskAddressPrefix),
      name: account.meta.name,
      source: account.meta.source,
      genesisHash: account.meta.genesisHash || null,
      balances: [],
    };
  });
};
