import { useMemo } from 'react';
import { AssetIds, Balance, Scalars } from '../../../../generated/graphql';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { getBalancesByAddress } from '../../lib/getBalancesByAddress';
import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import errors from '../../../../errors';

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
 * Returns all values of an object as an array and filters out null and undefined values.
 * When an array is passed, an array is returned.
 */
export const objectToArrayWithFilter = (obj: object): any[] => {
  return Object.values(obj).filter((value) => value);
};

export const balancesByAddressQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  /**
   *
   * @param _obj Any entity that has the address as id. Eg. LBPPool, XYKPool, Account
   * @param args AssetIds or string[]
   * @returns
   */
  async (
    _obj: Entity,
    args: BalancesByAddressResolverArgs
  ): Promise<Balance[] | undefined> => {
    // every component is supposed to have an initialized apiInstance
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    if (!args.assetIds) throw Error(errors.noArgumentsProvidedBalanceQuery);

    const assets = objectToArrayWithFilter(args.assetIds);

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
