import { ApiPromise } from '@polkadot/api';
import { includes } from 'lodash';
import { useCallback } from 'react';
import { Balance } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const nativeAssetId = '0';
export const assetBalanceDataType = 'AccountData';

export const getBalancesByAddress = async (
    apiInstance: ApiPromise, 
    address: string, 
    assetIds?: string[]
) => {
    const balances: Balance[] = [];
        
    // fetch the native balance, only if no assetIds were specified, or if it was explicitly requested
    if (!assetIds || includes(assetIds, nativeAssetId)) {
        const nativeAssetBalance = await apiInstance.query.system.account(address);    

        balances.push({
            assetId: nativeAssetId,
            balance: nativeAssetBalance?.data.free.toString()
        });
    }

    // we've already fetched the native balance above, ignore it down the line
    assetIds = assetIds ? assetIds.filter(e => e !== nativeAssetId) : assetIds;

    // TODO: write type definitions for `query.tokens`
    const assetBalances = assetIds
        // if there are specific assetIds to fetch, query only those
        ? (await apiInstance.query.tokens.accounts.multi(
            // query for [address, assetId]
            assetIds
                ?.map((assetId) => [address, assetId])
        ))
            .map((codec, i) => ({
                // pair the assetId in the same order as asked for in the multi query above
                assetId: assetIds![i],
                balance: codec
            }))
        // if no assetIds were specified, fetch all balances
        : (await apiInstance.query.tokens.accounts.entries(address))
            .map(([storageKey, codec]) => ({
                assetId: (storageKey.toHuman() as string[])[1],
                balance: codec
            }))

    assetBalances?.forEach(assetBalance => {
        // only extracting the free balance as of now
        const balance = apiInstance?.createType(
            assetBalanceDataType,
            assetBalance.balance
        ).free.toString();

        balances.push({ assetId: assetBalance.assetId, balance });
    });

    // TODO: treat Balance as a top level entity for caching purposes
    return balances;
}

export const useGetBalancesByAddress = () => {
    const { apiInstance, loading } = usePolkadotJsContext()

    return useCallback(async (address?: string, assetIds?: string[]) => {
        if (!apiInstance || !address) return;
        return await getBalancesByAddress(apiInstance, address, assetIds)
    }, [apiInstance, loading]);
}