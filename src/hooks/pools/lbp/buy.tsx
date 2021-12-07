import { ApolloCache } from '@apollo/client'
import { ApiPromise } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { useCallback } from 'react'
import { readActiveAccount } from '../../accounts/readActiveAccount'
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs'
import { gracefulExtensionCancelationErrorHandler, reject, resolve, vestingClaimHandler, withGracefulErrors } from '../../vesting/useVestingMutationResolvers'

export const buyHandler = (resolve: resolve, reject: reject, apiInstance: ApiPromise) => {
    return vestingClaimHandler(resolve, reject, apiInstance);
}

export const buy = async (
    cache: ApolloCache<object>,
    apiInstance: ApiPromise,
    assetBuy: string,
    assetSell: string,
    amountBuy: string,
    maxSold: string,
) => {
    await withGracefulErrors(async (resolve, reject) => {
        const activeAccount = readActiveAccount(cache);
        const address = activeAccount?.id;

        if (!address) return reject(new Error('No active account found'));

        const { signer } = await web3FromAddress(address);
        
        await apiInstance.tx.lbp.buy(
            assetBuy,
            assetSell,
            amountBuy,
            maxSold
        )
            .signAndSend(
                address,
                { signer },
                buyHandler(resolve, reject, apiInstance)
            )
    }, [
        gracefulExtensionCancelationErrorHandler
    ])
}