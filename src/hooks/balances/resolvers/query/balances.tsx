import { ApiPromise } from '@polkadot/api'
import { useMemo } from 'react'
import errors from '../../../../errors'
import { AssetIds, Balance, Scalars } from '../../../../generated/graphql'
import { withErrorHandler } from '../../../apollo/withErrorHandler'
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs'
import { getBalancesByAddress } from '../../lib/getBalancesByAddress'

export const __typename: Balance['__typename'] = 'Balance'

const withTypename = (balance: Balance) => ({
  __typename,
  ...balance
})

export interface BalancesByAddressResolverArgs {
  assetIds: AssetIds | string[]
}

export interface Entity {
  id: Scalars['String']
}

/**
 * Returns all values of an object as an array and filters out null and undefined values.
 * When an array is passed, an array is returned.
 */
export const objectToArrayWithFilter = (obj: object): any[] => {
  return Object.values(obj).filter((value) => value)
}

export const balancesByAddressQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  /**
   *
   * @param _obj Any entity that has the address as id. Eg. LBPPool, XYKPool, Account
   * @param args AssetIds or string[]
   * @returns
   */
  async (
    obj: Entity,
    args: BalancesByAddressResolverArgs
  ): Promise<Balance[]> => {
    // TODO: add apiInstance loading handling, this isnt sufficient
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized)

    // if no arguments are provided, use an empty array of assets
    const resolverArguments = args ? args.assetIds : ([] as string[])
    const assetIds = objectToArrayWithFilter(resolverArguments)

    return (await getBalancesByAddress(apiInstance, obj.id, assetIds))?.map(
      (balance: Balance) => {
        // add id and typename to each balance
        balance.id = `${obj.id}-${balance.assetId}`
        return withTypename(balance)
      }
    )
  }

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useBalanceQueryResolvers = () => {
  const { apiInstance } = usePolkadotJsContext()

  return {
    // key is the entity, value is the resolver
    balances:
      /**
       * practically we dont have to wrap this in useCallback
       * since it does not have any contextual dependencies
       */
      useMemo(
        () =>
          withErrorHandler(
            balancesByAddressQueryResolverFactory(apiInstance),
            'balances'
          ),
        [apiInstance]
      )
  }
}
