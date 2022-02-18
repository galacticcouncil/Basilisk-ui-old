import { useMemo } from 'react';
import { Scalars, LockedBalance } from '../../../../generated/graphql';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { getLockedBalancesByLockId } from '../../lib/getLockedBalancesByLockId';
import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import errors from '../../../../errors';

const __typename: LockedBalance['__typename'] = 'LockedBalance';

const withTypename = (lockedBalance: LockedBalance) => ({
  __typename,
  ...lockedBalance,
});

export interface LockedBalancesByLockIdResolverArgs {
  lockId: string;
}

export interface Entity {
  id: Scalars['String'];
}

export const lockedBalancesByLockIdQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  /**
   *
   * @param _obj Any entity that has the address as id. Eg. LBPPool, XYKPool, Account
   * @param args AssetIds or string[]
   * @returns
   */
  async (
    obj: Entity,
    args: LockedBalancesByLockIdResolverArgs
  ): Promise<LockedBalance[]> => {
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    if (!args.lockId) throw Error(errors.noArgumentsProvidedLockedBalanceQuery);

    return (
      await getLockedBalancesByLockId(apiInstance, obj.id, args.lockId)
    ).map((lockedBalance: LockedBalance) => {
      // add id and typename to each balance
      lockedBalance.id = `${obj.id}-${lockedBalance.assetId}-${lockedBalance.lockId}`;
      return withTypename(lockedBalance);
    });
  };

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useLockedBalanceQueryResolvers = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    // key is the entity, value is the resolver
    lockedBalances: useResolverToRef(
      // practically we dont have to wrap this in useCallback
      // since it does not have any contextual dependencies
      useMemo(
        () => lockedBalancesByLockIdQueryResolverFactory(apiInstance),
        [apiInstance]
      ),
      'lockedBalances'
    ),
  };
};
