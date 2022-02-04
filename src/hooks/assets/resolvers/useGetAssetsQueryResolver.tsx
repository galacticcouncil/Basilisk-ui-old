import { useCallback } from 'react';
import { Asset } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/mutation/useAccountsMutationResolvers';
import { useGetAssets } from '../useGetAssets';

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
