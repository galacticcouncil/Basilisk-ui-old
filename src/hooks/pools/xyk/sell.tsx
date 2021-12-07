import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback } from 'react';
import { GetActiveAccountQueryResponse, GET_ACTIVE_ACCOUNT } from '../../accounts/queries/useGetActiveAccountQuery';
import { readActiveAccount } from '../../accounts/readActiveAccount';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs'
import { gracefulExtensionCancelationErrorHandler, reject, resolve, vestingClaimHandler, withGracefulErrors } from '../../vesting/useVestingMutationResolvers';

export const xykBuyHandler = (resolve: resolve, reject: reject, apiInstance: ApiPromise) => {
    return vestingClaimHandler(resolve, reject, apiInstance);
}

export const discount = false;

export const sell = async (
    cache: ApolloCache<NormalizedCacheObject>,
    apiInstance: ApiPromise,
    assetSell: string,
    assetBuy: string,
    amountSell: string,
    minBought: string,
) => {
    await withGracefulErrors(async (resolve, reject) => {
        const activeAccount = readActiveAccount(cache);
        const address = activeAccount?.id;

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
}