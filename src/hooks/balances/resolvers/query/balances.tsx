import { useCallback } from 'react';
import {
  Account,
  Balance,
  LbpPool,
  XykPool,
} from '../../../../generated/graphql';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { useGetBalancesByAddress as getBalancesByAddress } from '../../lib/getBalancesByAddress';

export const __typename: Balance['__typename'] = 'Balance';

const withTypename = (balance: Balance) => ({
  __typename,
  ...balance,
});

export const balancesByAddressQueryResolver = async (
  parent: Account | LbpPool | XykPool,
  args: any
) => {
  let assetIds;
  // TODO: how to extract the typename from the LbpPool[__typename] directly?
  if (parent.__typename === 'LBPPool' || parent.__typename === 'XYKPool') {
    parent = parent as LbpPool | XykPool;
    assetIds = [parent.assetInId, parent.assetOutId];
  }

  return (await getBalancesByAddress()(parent.id, assetIds))?.map(function (
    balance: Balance
  ) {
    balance.id = `${parent.id}-${balance.assetId}`;
    return withTypename(balance);
  });
};

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useBalanceQueryResolvers = () => ({
  // key is the entity, value is the resolver
  balances: useResolverToRef(
    // practically we dont have to wrap this in useCallback
    // since it does not have any contextual dependencies
    useCallback(balancesByAddressQueryResolver, [getBalancesByAddress]),
    'balances'
  ),
});
