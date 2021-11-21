import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { gql } from 'graphql.macro';
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
                    args.assetBId,
                    args.assetAId,
                    args.assetBAmount,
                    `${(parseInt(args.assetAAmount) * 1.3)}`
                );
                
                // TODO: wait for the intention id and return it so it can be observed
                // cache.writeQuery({
                //     query: gql`
                //         query GetIntentionIds {
                //             intentions {
                //                 id
                //                 test
                //             }
                //         }
                //     `,
                //     data: {
                //         intentions: [{
                //             __typename: 'Intention',
                //             id: 1,
                //             test: 5
                //         }]
                //     }
                // })
            }

            throw new Error('We dont support this trade type yet');
        }, [buyXyk])
    )
}