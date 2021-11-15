import { useCallback } from 'react'
import { FeePaymentAsset } from '../../generated/graphql';
import { useResolverToRef } from '../accounts/useAccountsMutationResolvers'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const useFeePaymentAssetsQueryResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const feePaymentAssets = useResolverToRef(
        useCallback(async () => {
            if (!apiInstance || loading) return;

            const acceptedCurrencies = await apiInstance.query.multiTransactionPayment.acceptedCurrencies.entries()
            const feePaymentAssets: FeePaymentAsset[] = acceptedCurrencies.map((acceptedCurrency) => {
                return {
                    // TODO: is there a safer type way to do this?
                    assetId: (acceptedCurrency[0].toHuman() as string[])[0],
                    fallbackPrice: acceptedCurrency[1].toString()
                }
            })
            
            console.log('feePaymentAssets', feePaymentAssets);
        }, [apiInstance, loading])
    );

    return {
        feePaymentAssets
    }
}