import { useMemo } from 'react';
import { AssetIds, Balance, Scalars } from '../../../../generated/graphql';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { getBalancesByAddress } from '../../lib/getBalancesByAddress';
import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import error from '../../../../errors';

export const __typename: Balance['__typename'] = 'Balance';

const withTypename = (balance: Balance) => ({
  __typename,
  ...balance,
});

export interface BalancesByAddressResolverArgs {
  assetIds: AssetIds | string[];
}

export interface Entity {
  id: Scalars['String'];
}

/**
 * Returns all values of an object as array and filters out null values.
 * When an array is passed, an array is returned.
 */
export const objectToArrayWithoutNull = (obj: object): any[] => {
  return Object.values(obj).filter((value) => value != null);
};

export const balancesByAddressQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  async (
    _obj: Entity,
    args: BalancesByAddressResolverArgs
  ): Promise<Balance[] | undefined> => {
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw Error(error.apiInstanceNotInitialized);
    if (!args.assetIds) throw Error(error.noArgumentsProvidedBalanceQuery);

    const assets = objectToArrayWithoutNull(args.assetIds);

    return (await getBalancesByAddress(apiInstance, _obj.id, assets))?.map(
      (balance: Balance) => {
        // add id and typename to each balance
        balance.id = `${_obj.id}-${balance.assetId}`;
        return withTypename(balance);
      }
    );
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
