import { isArray, isObject } from 'lodash';
import { useCallback } from 'react';
import { LbpPool, XykPool } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers';
import { __typename } from '../../accounts/resolvers/useGetAccountsQueryResolver';
import { useGetLbpPools } from '../useGetLbpPools';
import { useGetXykPools } from '../useGetXykPools';

export interface PoolQueryResolverArgs {
    poolId?: string
}

export const useGetPoolsQueryResolver = () => {
    const getLbpPools = useGetLbpPools();
    const getXykPools = useGetXykPools();

    return useResolverToRef(
        useCallback(async (
            _obj,
            args: PoolQueryResolverArgs,
        ) => {
            const [lbpPools, xykPools] = await Promise.all([
                getLbpPools(),
                getXykPools()
            ]);
            
            return ([] as (LbpPool | XykPool)[])
                .concat(
                    lbpPools
                        ?.map(pool => ({
                            ...pool,
                            __typename: 'LBPPool'
                        }) as LbpPool)
                )
                .concat(
                    xykPools
                        ?.map(pool => ({
                            ...pool,
                            __typename: 'XYKPool'
                        }) as XykPool)
                )

        }, [getLbpPools]),
        'pools'
    )
}