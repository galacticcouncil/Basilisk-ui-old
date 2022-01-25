import { ApiPromise } from '@polkadot/api';
import { includes } from 'lodash';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import { OrmlAccountData } from '@open-web3/orml-types/interfaces';

// this function fetches asset balances only for a given set of assetIds
export const getBalancesByAddress = async (
  apiInstance: ApiPromise,
  address: string,
  assetIds: string[]
): Promise<Balance[]> => {
  const nativeBalance: Balance[] = [];
  if (includes(assetIds, constants.nativeAssetId)) {
    const balance = await fetchNativeAssetBalance(apiInstance, address);
    nativeBalance.push(balance);
  }

  // make sure that there is no native assetId
  const nonNativeAssetIds = assetIds.filter(
    (id) => id !== constants.nativeAssetId
  );
  let nonNativeBalances: Balance[] = [];
  // fetch non-native assets only if needed
  if (nonNativeAssetIds.length !== 0) {
    nonNativeBalances = await fetchNonNativeAssetBalances(
      apiInstance,
      address,
      nonNativeAssetIds
    );
  }

  const balances = [...nativeBalance, ...nonNativeBalances];
  return balances;
};

export const fetchNativeAssetBalance = async (
  apiInstance: ApiPromise,
  address: string
): Promise<Balance> => {
  const nativeAssetBalance = await apiInstance.query.system.account(address);

  return {
    assetId: constants.nativeAssetId,
    balance: nativeAssetBalance.data.free.toString(),
  };
};

/**
 * This function fetches balances for multiple non-native assetIds.
 *
 * @param apiInstance PolkadotJS ApiPromise
 * @param address of the account
 * @param assetIds of non-native tokens
 * @returns balance object with assetId and balance
 */
export const fetchNonNativeAssetBalances = async (
  apiInstance: ApiPromise,
  address: string,
  assetIds: string[]
): Promise<Balance[]> => {
  // compose search parameters as [[address, assetIdA], [address, assetIdB], ...]
  const searchParameters: string[][] = assetIds.map((assetId) => [
    address,
    assetId,
  ]);
  const searchResult =
    await apiInstance.query.tokens.accounts.multi<OrmlAccountData>(
      searchParameters
    );

  const balances: Balance[] = searchResult.map((balanceData, i) => {
    // extract free balance as string
    const freeBalance = balanceData.free.toString();

    return {
      assetId: assetIds[i], // pair assetId in the same order as provided as search parameter
      balance: freeBalance,
    };
  });
  return balances;
};
