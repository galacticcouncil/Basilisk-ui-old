import { useCallback } from 'react';
import { Asset } from '../../../generated/graphql';
import { withErrorHandler } from '../../apollo/withErrorHandler';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs'
import { useGetAssets } from '../useGetAssets';

export const __typename: Asset['__typename'] = 'Asset';

export const useGetAssetsQueryResolver = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const getAssets = useGetAssets();

    return withErrorHandler(
        useCallback(async () => {
            return (await getAssets())
                ?.map(asset => ({
                    ...asset,
                    __typename
                }))
        }, [
            apiInstance,
            loading
        ])
    )
}