import { ApolloClient } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import log from 'loglevel';
import { useCallback } from 'react';
import { HydraDxMath, useMathContext } from '../math/useMath';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { mapToPool } from './useGetLbpPools';

export const getLbpPool = async (
    math: HydraDxMath,
    client: ApolloClient<object>,
    apiInstance: ApiPromise,
    poolId: string,
) => {
    return await mapToPool(math, client, apiInstance)([
        poolId,
        await apiInstance.query.lbp.poolData(poolId)
    ])
}

export const useGetLbpPool = () => {
    const { apiInstance } = usePolkadotJsContext();
    const { math } = useMathContext();

    return useCallback(async (
        client: ApolloClient<object>, 
        poolId?: string
    ) => {
        log.debug('useGetLbpPool', apiInstance, poolId, math)
        if (!apiInstance || !poolId || !math) return;
        return getLbpPool(math, client, apiInstance, poolId);
    }, [apiInstance, math])
}