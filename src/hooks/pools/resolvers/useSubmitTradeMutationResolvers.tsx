import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql.macro';
import { useCallback } from 'react'
import { PoolType } from '../../../components/Chart/shared';
import { Maybe, TradeType } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers'
import { SubmitTradeMutationVariables } from '../mutations/useSubmitTradeMutation';
import { useBuyXyk } from '../useBuyXyk'
import { useSellXyk } from '../useSellXyk';

// this is for buy, for sell we need to use minus, not plus
export const applyAllowedSlippage = (
    amount: string, 
    allowedSlippage: string,
    tradeType: TradeType
) => {
    let slippageAmount = new BigNumber(amount)
        .multipliedBy(
            new BigNumber(allowedSlippage)
                .dividedBy(100)
        )

    const amountBN = new BigNumber(amount);
    
    const amountWithSlippage = tradeType === TradeType.Buy
            // if you're buying an exact amount,
            // you must be willing to pay more
            ? amountBN.plus(slippageAmount)
            // if you're selling an exact amount,
            // you should be willing to receive less
            : amountBN.minus(slippageAmount)
    
    return amountWithSlippage.toFixed(0);
}

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
                    args.amountWithSlippage,
                );
            }

            if (args?.poolType === PoolType.XYK && args?.tradeType === TradeType.Sell) {
                return await sellXyk(
                    cache,
                    args.assetAId,
                    args.assetBId,
                    args.assetAAmount,
                    args.amountWithSlippage,
                );
            }

            throw new Error('We dont support this trade type yet');
        }, [buyXyk])
    )
}