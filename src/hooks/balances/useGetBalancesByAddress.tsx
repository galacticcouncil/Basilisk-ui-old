import { Codec } from '@polkadot/types/types';
import { useCallback, useEffect } from 'react';
import { Balance } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const nativeAssetId = '0';
export const assetBalanceDataType = 'AccountData';
export const useGetBalancesByAddress = () => {
    const { apiInstance, loading } = usePolkadotJsContext()

    const getBalancesByAddress = useCallback(async (address: string) => {
        if (!apiInstance) return;

        const balances: Balance[] = [];
        const nativeAssetBalance = await apiInstance.query.system.account(address);    

        balances.push({
            assetId: nativeAssetId,
            balance: nativeAssetBalance?.data.free.toString()
        });

        // TODO: write type definitions for `query.tokens`
        const assetBalances = await apiInstance.query.tokens.accounts.entries(address);

        assetBalances?.forEach(assetBalanceTuple => {
            const assetIdTuple = assetBalanceTuple[0].toHuman() as string[];
            const assetId = assetIdTuple[1];

            const balance = apiInstance?.createType(
                assetBalanceDataType,
                assetBalanceTuple[1]
            ).free.toString();

            balances.push({ assetId, balance });
        });

        return balances;
    }, [apiInstance, loading]);

    return getBalancesByAddress;
}