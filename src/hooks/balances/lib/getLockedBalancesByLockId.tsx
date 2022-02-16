import { ApiPromise } from '@polkadot/api';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import { StorageKey, Vec } from '@polkadot/types';
import { OrmlBalanceLock } from '@open-web3/orml-types/interfaces';
import { AnyTuple } from '@polkadot/types/types';
import '@polkadot/api-augment';

export type LockedBalance = Balance & { lockId: string };

export const getLockedBalancesByLockId = async (
  apiInstance: ApiPromise,
  address: string,
  lockId: string
): Promise<LockedBalance[]> => {
  const nativeBalanceForLockId = await getNativeBalanceByLockId(
    apiInstance,
    address,
    lockId
  );
  if (nativeBalanceForLockId.length) return nativeBalanceForLockId;

  const nonNativeBalanceForLockId = await getNonNativeBalanceByLockId(
    apiInstance,
    address,
    lockId
  );
  if (nonNativeBalanceForLockId.length) return nonNativeBalanceForLockId;

  return [];
};

async function getNativeBalanceByLockId(
  apiInstance: ApiPromise,
  address: string,
  lockId: string
) {
  const nativeLockedBalances = await getNativeLockedBalances(
    apiInstance,
    address
  );

  const nativeBalanceForLockId = filterBalancesWithLockId(
    nativeLockedBalances,
    lockId
  );

  return nativeBalanceForLockId;
}

export const getNativeLockedBalances = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance[]> => {
  // query returns empty array if there is no locked balance for native token
  const lockedBalances = await apiInstance.query.balances.locks(address);

  return lockedBalances.map((lockedBalance) => {
    return {
      lockId: lockedBalance.id.toString(),
      assetId: constants.nativeAssetId,
      balance: lockedBalance.amount.toString(),
    };
  });
};

/**
 * This function is used to search for locked balances
 * for given lockId in an array of locked balances.
 * Returns an empty array if no locked balance was found.
 *
 * @param lockedBalances array of locked balances
 * @param lockId search parameter
 * @returns locked balance(s) or empty array
 */
export const filterBalancesWithLockId = (
  lockedBalances: LockedBalance[],
  lockId: string
): LockedBalance[] => {
  return lockedBalances.filter(
    (lockedBalance) => lockedBalance.lockId === lockId
  );
};

async function getNonNativeBalanceByLockId(
  apiInstance: ApiPromise,
  address: string,
  lockId: string
) {
  const nonNativeLockedBalances = await getNonNativeLockedBalances(
    apiInstance,
    address
  );

  const nonNativeBalanceForLockId = filterBalancesWithLockId(
    nonNativeLockedBalances,
    lockId
  );

  return nonNativeBalanceForLockId;
}

type address = string;
type assetId = string;
interface lockedBalanceStorageKey extends AnyTuple {
  args?: [address, assetId];
}

export const getNonNativeLockedBalances = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance[]> => {
  const nonNativeLockedBalances = await apiInstance.query.tokens.locks.entries<
    Vec<OrmlBalanceLock>
  >(address);

  return nonNativeLockedBalances.flatMap(
    ([storageKey, lockedBalances]: [
      StorageKey<lockedBalanceStorageKey>,
      Vec<OrmlBalanceLock>
    ]) => {
      return lockedBalances.map((lockedBalance: OrmlBalanceLock) => {
        return {
          // lockId is hex representation eg.: "0x6f726d6c76657374"; .toHuman() would be "ormlvest"
          lockId: lockedBalance.id.toString(),
          assetId: storageKey.args[1].toString(), // args = [address, assetId]
          balance: lockedBalance.amount.toString(),
        };
      });
    }
  );
};
