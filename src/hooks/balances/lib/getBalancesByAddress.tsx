import { ApiPromise } from '@polkadot/api';
import { includes } from 'lodash';
import { AssetIds, Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import { OrmlAccountData } from '@open-web3/orml-types/interfaces';

// this function fetches asset balances only for a given set of assetIds
export const getBalancesByAddress = async (
  apiInstance: ApiPromise,
  address: string,
  assetIds: AssetIds
): Promise<Balance[]> => {
  const assets = objectToArrayWithoutNull(assetIds);
  let balances: Balance[] = [];

  if (includes(assets, constants.nativeAssetId)) {
    const nativeBalance = await fetchNativeAssetBalance(apiInstance, address);
    balances.push(nativeBalance);
  }

  // make sure that there is no native assetId
  const nonNativeAssetIds = assets.filter(
    (id) => id !== constants.nativeAssetId
  );
  // fetch non-native assets only if needed
  if (nonNativeAssetIds.length) {
    const nonNativeBalances = await fetchNonNativeAssetBalances(
      apiInstance,
      address,
      nonNativeAssetIds
    );

    balances.push(...nonNativeBalances);
  }

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
  // compose search parameter as [[address, assetIdA], [address, assetIdB], ...]
  const queryParameter: string[][] = assetIds.map((assetId) => [
    address,
    assetId,
  ]);
  const searchResult =
    await apiInstance.query.tokens.accounts.multi<OrmlAccountData>(
      queryParameter
    );

  const balances: Balance[] = searchResult.map((balanceData, i) => {
    // extract free balance as string
    const freeBalance = balanceData.free.toString();

    return {
      assetId: assetIds[i], // pair assetId in the same order as provided in query parameter
      balance: freeBalance,
    };
  });
  return balances;
};

export const objectToArrayWithoutNull = (obj: object): any[] => {
  return Object.values(obj).filter((value) => value != null);
};
