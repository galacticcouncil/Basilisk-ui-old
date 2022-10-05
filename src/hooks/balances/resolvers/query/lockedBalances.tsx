import { useMemo } from 'react'
import {
  Scalars,
  LockedBalance,
  Query,
  QueryLockedBalancesArgs
} from '../../../../generated/graphql'
import { getLockedBalancesByLockId } from '../../lib/getLockedBalancesByLockId'
import { ApiPromise } from '@polkadot/api'
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs'
import errors from '../../../../errors'
import { withErrorHandler } from '../../../apollo/withErrorHandler'

const __typename: LockedBalance['__typename'] = 'LockedBalance'

const withTypename = (lockedBalance: LockedBalance) => ({
  __typename,
  ...lockedBalance
})

export interface Entity {
  id: Scalars['String']
}

export const lockedBalancesByLockIdQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  /**
   *
   * @param obj Any entity that has the address as id. Eg. LBPPool, XYKPool, Account
   * @param args AssetIds or string[]
   * @returns
   */
  async (
    obj: Entity,
    args: QueryLockedBalancesArgs
  ): Promise<Query['lockedBalances']> => {
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized)
    if (!args.lockId) throw Error(errors.missingArgumentsLockedBalanceQuery)
    // can't fetch lockedBalance without address
    if (!args.address && !obj.id)
      throw Error(errors.missingArgumentsLockedBalanceQuery)

    const address = args.address ? args.address : obj.id

    return (
      await getLockedBalancesByLockId(apiInstance, address, args.lockId)
    ).map((lockedBalance: LockedBalance) => {
      // add id(address-assetId-lockId) and typename to each balance
      lockedBalance.id = `${address}-${lockedBalance.assetId}-${lockedBalance.lockId}`
      return withTypename(lockedBalance)
    })
  }

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useLockedBalanceQueryResolvers = () => {
  const { apiInstance } = usePolkadotJsContext()

  return {
    // key is the entity, value is the resolver
    lockedBalances: useMemo(
      () =>
        withErrorHandler(
          lockedBalancesByLockIdQueryResolverFactory(apiInstance),
          'lockedBalances'
        ),
      [apiInstance]
    )
  }
}
