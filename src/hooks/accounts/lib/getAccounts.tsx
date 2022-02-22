import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { Account } from '../../../generated/graphql';
import constants from '../../../constants';

/**
 * Used to fetch all accounts
 */
export const getAccounts = async (): Promise<Account[]> => {
  // ensure we're connected to the polkadot.js extension
  await web3Enable(constants.basiliskWeb3ProviderName);

  // get all the accounts from the polkadot.js extension
  // return all retrieved accounts
  const accounts = await web3Accounts();

  // transform the returned accounts into the required entity format
  return accounts.map((account) => {
    const address = encodeAddress(
      decodeAddress(account.address),
      constants.basiliskAddressPrefix
    );
    return {
      id: address,
      name: account.meta.name,
      source: account.meta.source,
      balances: [],
    };
  });
};
