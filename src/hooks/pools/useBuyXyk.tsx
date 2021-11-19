import { ApolloCache, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback } from 'react'
import { GetActiveAccountQueryResponse, GET_ACTIVE_ACCOUNT } from '../accounts/queries/useGetActiveAccountQuery';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { withGracefulErrors, gracefulExtensionCancelationErrorHandler, vestingClaimHandler, resolve, reject } from '../vesting/useVestingMutationResolvers';

export const xykBuyHandler = (resolve: resolve, reject: reject, apiInstance: ApiPromise) => {
    return vestingClaimHandler(resolve, reject, apiInstance);
}

export const useBuyXyk = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const discount = false;

    return useCallback(async (
        cache: ApolloCache<NormalizedCacheObject>,
        assetBuy: string,
        assetSell: string,
        amountBuy: string,
        maxSold: string,
    ) => {
        if (!apiInstance || loading) return console.log('not buying', loading, apiInstance);
        console.log('buying xyk')
        await withGracefulErrors(async (resolve, reject) => {
            const address = cache.readQuery<GetActiveAccountQueryResponse>({
                query: GET_ACTIVE_ACCOUNT
            })?.account?.id;

            if (!address) return reject();

            const { signer } = await web3FromAddress(address);

            await apiInstance.tx.exchange.buy(
                assetBuy,
                assetSell,
                amountBuy,
                maxSold,
                discount
            )
                .signAndSend(
                    address,
                    { signer },
                    xykBuyHandler(resolve, reject, apiInstance)
                )
        }, [
            gracefulExtensionCancelationErrorHandler
        ])
    }, [apiInstance, loading]);
}