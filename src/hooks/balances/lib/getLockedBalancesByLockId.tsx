import { OrmlBalanceLock } from '@open-web3/orml-types/interfaces'
import { ApiPromise } from '@polkadot/api'
import '@polkadot/api-augment'
import { StorageKey, Vec } from '@polkadot/types'
import constants from '../../../constants'
import { LockedBalance } from '../../../generated/graphql'
import { lockedBalanceStorageKey } from '../types'

/**
 * This function returns the assetId and balance for a given lockId.
 * If locks for native and non native assets are present and match
 * the given lockId, the native asset lock takes precedence and non native assets
 * are not returned.
 *
 * @param apiInstance polkadotJs ApiPromise instance
 * @param address of the entity eg. account, LBPPool, XYKPool
 * @param lockId identifier of the lock scheme
 * @returns locked balance and assetId
 */
export const getLockedBalancesByLockId = async (
  apiInstance: ApiPromise,
  address: string,
  lockId: string
): Promise<LockedBalance[]> => {
  const nativeBalanceForLockId = await getNativeBalanceByLockId(
    apiInstance,
    address,
    lockId
  )
  if (nativeBalanceForLockId.length) return nativeBalanceForLockId

  const nonNativeBalanceForLockId = await getNonNativeBalanceByLockId(
    apiInstance,
    address,
    lockId
  )
  if (nonNativeBalanceForLockId.length) return nonNativeBalanceForLockId

  return []
}

async function getNativeBalanceByLockId(
  apiInstance: ApiPromise,
  address: string,
  lockId: string
) {
  const nativeLockedBalances = await getNativeLockedBalances(
    apiInstance,
    address
  )

  const nativeBalanceForLockId = filterBalancesByLockId(
    nativeLockedBalances,
    lockId
  )

  return nativeBalanceForLockId
}

export const getNativeLockedBalances = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance[]> => {
  // query returns empty array if there is no locked balance for native token
  const lockedBalances = await apiInstance.query.balances.locks(address)

  return lockedBalances.map((lockedBalance) => {
    return {
      lockId: lockedBalance.id.toString(),
      assetId: constants.nativeAssetId,
      balance: lockedBalance.amount.toString()
    }
  })
}

/**
 * This function is used to search for locked balances
 * for given lockId in an array of locked balances.
 * Returns an empty array if no locked balance was found.
 *
 * @param lockedBalances array of locked balances
 * @param lockId search parameter
 * @returns locked balance(s) or empty array
 */
export const filterBalancesByLockId = (
  lockedBalances: LockedBalance[],
  lockId: string
): LockedBalance[] => {
  return lockedBalances.filter(
    (lockedBalance) => lockedBalance.lockId === lockId
  )
}

async function getNonNativeBalanceByLockId(
  apiInstance: ApiPromise,
  address: string,
  lockId: string
) {
  const nonNativeLockedBalances = await getNonNativeLockedBalances(
    apiInstance,
    address
  )

  const nonNativeBalanceForLockId = filterBalancesByLockId(
    nonNativeLockedBalances,
    lockId
  )

  return nonNativeBalanceForLockId
}

export const getNonNativeLockedBalances = async (
  apiInstance: ApiPromise,
  address: string
): Promise<LockedBalance[]> => {
  const nonNativeLockedBalances = await apiInstance.query.tokens.locks.entries<
    Vec<OrmlBalanceLock>
  >(address)

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
          balance: lockedBalance.amount.toString()
        }
      })
    }
  )
}
