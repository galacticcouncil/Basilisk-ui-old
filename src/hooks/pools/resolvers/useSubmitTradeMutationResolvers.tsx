import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { useCallback } from 'react'
import { PoolType } from '../../../components/Chart/shared';
import { Maybe, TradeType } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers'
import { SubmitTradeMutationVariables } from '../mutations/useSubmitTradeMutation';
import { useBuyXyk } from '../useBuyXyk'


export const useSubmitTradeMutationResolver = () => {
    const buyXyk = useBuyXyk();

    return useResolverToRef(
        useCallback(async (
            _obj,
            args: Maybe<SubmitTradeMutationVariables>,
            { cache }: { cache: ApolloCache<NormalizedCacheObject> }
        ) => {
            if (!args) return
            if (args?.poolType === PoolType.XYK && args?.tradeType === TradeType.Buy) {
                return await buyXyk(
                    cache,
                    args.assetAId,
                    args.assetBId,
                    args.assetAAmount,
                    args.assetBAmount
                );
            }

            throw new Error('We dont support this trade type yet');
        }, [buyXyk])
    )
}