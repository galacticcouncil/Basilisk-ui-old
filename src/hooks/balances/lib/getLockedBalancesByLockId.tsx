import { ApiPromise } from '@polkadot/api';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import '@polkadot/api-augment';

type LockedBalance = Balance & { lockId: string };

export const getLockedBalancesByLockId = async (
  apiInstance: ApiPromise,
  address: string,
  lockId: string
): Promise<LockedBalance | undefined> => {
  // fetch native asset lock + id
  const nativeLockedBalance = await getNativeLockedBalance(
    apiInstance,
    address
  );

  // filter out the one that has ID
  // return object
  if (nativeLockedBalance && nativeLockedBalance.lockId === lockId)
    return nativeLockedBalance;
  // fetch non-native assets that are locked

  // filter out the one that has ID
  // return object
};

export const getNativeLockedBalance = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance | undefined> => {
  // returns empty array
  const lockedBalances = await apiInstance.query.balances.locks(address);
  if (!lockedBalances.length) return undefined;

  return {
    lockId: lockedBalances[0].id.toString(),
    assetId: constants.nativeAssetId,
    balance: lockedBalances[0].amount.toString(),
  };
};

export const getNonNativeLockedBalances = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance[] | undefined> => {
  // TODO implement
  //const lockedBalances  = await apiInstance.query.tokens.locks(address);

  return undefined;
};
