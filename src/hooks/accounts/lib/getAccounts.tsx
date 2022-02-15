import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Account } from '../../../generated/graphql';
import constants from '../../../constants';

/**
 * Used to fetch all accounts
 * @returns an array of accounts in required format
 */
export const getAccounts = async (): Promise<Account[]> => {
  // ensure we're connected to the polkadot.js extension
  await web3Enable(constants.basiliskWeb3ProviderName);

  // get all the accounts from the polkadot.js extension
  // return all retrieved accounts
  const accounts = await web3Accounts({
    ss58Format: constants.basiliskAddressPrefix,
  });

  // transform the returned accounts into the required entity format
  return accounts.map((account) => {
    return {
      id: account.address,
      name: account.meta.name,
      source: account.meta.source,
      balances: [],
    };
  });
};
