import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback } from 'react';
import { GetActiveAccountQueryResponse, GET_ACTIVE_ACCOUNT } from '../accounts/queries/useGetActiveAccountQuery';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { gracefulExtensionCancelationErrorHandler, reject, resolve, vestingClaimHandler, withGracefulErrors } from '../vesting/useVestingMutationResolvers';

export const xykBuyHandler = (resolve: resolve, reject: reject, apiInstance: ApiPromise) => {
    return vestingClaimHandler(resolve, reject, apiInstance);
}

export const useSellXyk = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const discount = false;

    return useCallback(async (
        cache: ApolloCache<NormalizedCacheObject>,
        assetSell: string,
        assetBuy: string,
        amountSell: string,
        minBought: string,
    ) => {
        if (!apiInstance || loading) return;

        console.log('sellXyk', {
            assetSell, assetBuy, amountSell, minBought
        })

        await withGracefulErrors(async (resolve, reject) => {
            const address = cache.readQuery<GetActiveAccountQueryResponse>({
                query: GET_ACTIVE_ACCOUNT
            })?.account?.id;

            if (!address) return reject(new Error('No active account found!'));

            const { signer } = await web3FromAddress(address);

            await apiInstance.tx.xyk.sell(
                assetSell,
                assetBuy,
                amountSell,
                minBought,
                discount
            )
                .signAndSend(
                    address,
                    { signer },
                    xykBuyHandler(resolve, reject, apiInstance)
                )
        }, [
            gracefulExtensionCancelationErrorHandler
        ]);
    }, [apiInstance, loading])
}