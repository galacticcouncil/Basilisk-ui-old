import { useCallback } from 'react';
import { Asset } from '../../../generated/graphql';
import { useGetAssets } from '../useGetAssets';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsResolvers';

export const __typename: Asset['__typename'] = 'Asset';

export const useGetAssetsQueryResolver = () => {
  const getAssets = useGetAssets();

  return useResolverToRef(
    useCallback(async () => {
      return (await getAssets())?.map((asset) => ({
        ...asset,
        __typename,
      }));
    }, [getAssets])
  );
};
