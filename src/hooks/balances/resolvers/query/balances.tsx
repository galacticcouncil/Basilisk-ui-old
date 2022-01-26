import { useMemo } from 'react';
import {
  Account,
  AssetIds,
  Balance,
  LbpPool,
  XykPool,
} from '../../../../generated/graphql';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { getBalancesByAddress } from '../../lib/getBalancesByAddress';
import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';

export const __typename: Balance['__typename'] = 'Balance';
const errorApiInstanceNotInitialized = 'ApiPromise is not initialized';

const withTypename = (balance: Balance) => ({
  __typename,
  ...balance,
});

export interface BalancesByAddressResolverArgs {
  assetIds: AssetIds;
}

export const balancesByAddressQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  async (
    _obj: Account | LbpPool | XykPool,
    args: BalancesByAddressResolverArgs
  ) => {
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw errorApiInstanceNotInitialized;

    return (
      await getBalancesByAddress(apiInstance, _obj.id, args.assetIds)
    )?.map((balance: Balance) => {
      // add id to balance entity
      balance.id = `${_obj.id}-${balance.assetId}`;
      // add typename
      return withTypename(balance);
    });
  };

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useBalanceQueryResolvers = () => {
  const { apiInstance } = usePolkadotJsContext();
  return {
    // key is the entity, value is the resolver
    balances: useResolverToRef(
      // practically we dont have to wrap this in useCallback
      // since it does not have any contextual dependencies
      useMemo(
        () => balancesByAddressQueryResolverFactory(apiInstance),
        [apiInstance]
      ),
      'balances'
    ),
  };
};
