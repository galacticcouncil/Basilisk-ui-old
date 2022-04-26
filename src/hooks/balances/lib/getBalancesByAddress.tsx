import { ApiPromise } from '@polkadot/api';
import { includes, max } from 'lodash';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import { OrmlAccountData } from '@open-web3/orml-types/interfaces';
import '@polkadot/api-augment';
import BigNumber from 'bignumber.js';
import errors from '../../../errors';

/**
 * This function fetches asset balances for a given set of assetIds.
 * If no assetIds are specified, then it will fetch all asset balances.
 *
 * @param apiInstance polkadotJs ApiPromise instance
 * @param address of the entity eg. account, LBPPool, XYKPool
 * @param assetIds an array of assetIds, can be empty
 * @returns an array of balances
 */
export const getBalancesByAddress = async (
  apiInstance: ApiPromise,
  address: string,
  assetIds: string[]
): Promise<Balance[]> => {
  let balances: Balance[] = [];
  // fetch native balance if native assetId is specified OR no assetIds are specified
  if (includes(assetIds, constants.nativeAssetId) || !assetIds.length) {
    const nativeBalance = await fetchNativeAssetBalance(apiInstance, address);
    balances.push(nativeBalance);
  }

  // make sure that there is no native assetId
  const nonNativeAssetIds = assetIds.filter(
    (id) => id !== constants.nativeAssetId
  );
  // fetch non-native assets by assetId
  if (nonNativeAssetIds.length) {
    const nonNativeBalances = await fetchNonNativeAssetBalancesByAssetIds(
      apiInstance,
      address,
      nonNativeAssetIds
    );

    balances.push(...nonNativeBalances);
  }

  // fetch all non-native assets if no assetIds are specified
  if (!assetIds.length) {
    const allNonNativeBalances = await fetchNonNativeAssetBalances(
      apiInstance,
      address
    );

    balances.push(...allNonNativeBalances);
  }

  return balances;
};

export const fetchNativeAssetBalance = async (
  apiInstance: ApiPromise,
  address: string
): Promise<Balance> => {
  // no handling of undefined because apiInstance returns default value of 0 for native asset
  const nativeAssetBalance = await apiInstance.query.system.account(address);
  // usable native asset balance
  const freeBalance = nativeAssetBalance.data.free.toString();
  const miscFrozenBalance = nativeAssetBalance.data.miscFrozen.toString();
  const feeFrozenBalance = nativeAssetBalance.data.feeFrozen.toString();
  const maxFrozenBalance = max([miscFrozenBalance, feeFrozenBalance]);

  if (!maxFrozenBalance) throw new Error(errors.usableBalanceNotAvailable);

  let balance = new BigNumber(freeBalance).minus(maxFrozenBalance).toFixed();

  balance = new BigNumber(balance).gte('0') ? balance : '0';

  return {
    assetId: constants.nativeAssetId,
    balance,
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
export const fetchNonNativeAssetBalancesByAssetIds = async (
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

  return searchResult.map((balanceData, i) => {
    // extract free balance as string
    const freeBalance = balanceData.free.toString();
    const frozenBalance = balanceData.frozen.toString();
    let balance = new BigNumber(freeBalance).minus(frozenBalance).toFixed();

    balance = new BigNumber(balance).gte('0') ? balance : '0';

    return {
      assetId: assetIds[i], // pair assetId in the same order as provided in query parameter
      balance,
    };
  });
};

/**
 * This function fetches all non-native token balances for given address.
 *
 * @param apiInstance PolkadotJS ApiPromise
 * @param address of the account
 * @returns balance object with assetId and balance
 */
export const fetchNonNativeAssetBalances = async (
  apiInstance: ApiPromise,
  address: string
) => {
  const allNonNativeTokens =
    await apiInstance.query.tokens.accounts.entries<OrmlAccountData>(address);

  const balances: Balance[] = allNonNativeTokens.map(([key, balanceData]) => {
    // TODO: better type casting for next line
    const [, assetId] = key.toHuman() as [string, string]; // [Address, AssetId]

    const freeBalance = balanceData.free.toString();
    const frozenBalance = balanceData.frozen.toString();
    let balance = new BigNumber(freeBalance).minus(frozenBalance).toString();

    balance = new BigNumber(balance).gte('0') ? balance : '0';

    return {
      assetId: assetId,
      balance: balance,
    };
  });

  return balances;
};
