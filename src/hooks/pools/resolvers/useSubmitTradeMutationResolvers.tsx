import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { gql } from 'graphql.macro';
import { useCallback } from 'react'
import { PoolType } from '../../../components/Chart/shared';
import { Maybe, TradeType } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers'
import { SubmitTradeMutationVariables } from '../mutations/useSubmitTradeMutation';
import { useBuyXyk } from '../useBuyXyk'
import { useSellXyk } from '../useSellXyk';


export const useSubmitTradeMutationResolver = () => {
    const buyXyk = useBuyXyk();
    const sellXyk = useSellXyk();

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
                    args.assetBId,
                    args.assetAId,
                    args.assetBAmount,
                    `${(parseInt(args.assetAAmount) * 1.3)}`
                );
            }

            if (args?.poolType === PoolType.XYK && args?.tradeType === TradeType.Sell) {
                return await sellXyk(
                    cache,
                    args.assetAId,
                    args.assetBId,
                    args.assetAAmount,
                    `${(parseInt(args.assetBAmount) * 1.3)}`
                );
            }

            throw new Error('We dont support this trade type yet');
        }, [buyXyk])
    )
}