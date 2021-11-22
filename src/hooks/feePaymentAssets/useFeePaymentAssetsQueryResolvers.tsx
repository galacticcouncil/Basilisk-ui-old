import { useCallback } from 'react'
import { FeePaymentAsset } from '../../generated/graphql';
import { useResolverToRef } from '../accounts/resolvers/useAccountsMutationResolvers'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const __typename: FeePaymentAsset['__typename'] = 'FeePaymentAsset';
export const useFeePaymentAssetsQueryResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const feePaymentAssets = useResolverToRef(
        useCallback(async () => {
            if (!apiInstance || loading) return;

            const acceptedCurrencies = await apiInstance.query.multiTransactionPayment.acceptedCurrencies.entries()
            const feePaymentAssets: FeePaymentAsset[] = acceptedCurrencies.map((acceptedCurrency) => {
                const assetId = (acceptedCurrency[0].toHuman() as string[])[0];
                return {
                    // TODO: is there a safer type way to do this?
                    // TODO: maybe? combine this with known asset data
                    __typename,
                    id: assetId,
                    assetId: assetId,
                    fallbackPrice: acceptedCurrency[1].toString()
                }
            })
            
            return feePaymentAssets;
        }, [apiInstance, loading])
    );

    return {
        feePaymentAssets
    }
}