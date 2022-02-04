import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { PoolType } from '../../../components/Chart/shared';
import { Maybe, TradeType } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/mutation/useAccountsMutationResolvers';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs';
import { SubmitTradeMutationVariables } from '../mutations/useSubmitTradeMutation';
import { buy as buyLbp } from '../lbp/buy';
import { sell as sellLbp } from '../lbp/sell';
import { buy as buyXyk } from '../xyk/buy';
import { sell as sellXyk } from '../xyk/sell';

// this is for buy, for sell we need to use minus, not plus
export const applyAllowedSlippage = (
  amount: string,
  allowedSlippage: string,
  tradeType: TradeType
) => {
  let slippageAmount = new BigNumber(amount).multipliedBy(
    new BigNumber(allowedSlippage).dividedBy(100)
  );

  const amountBN = new BigNumber(amount);

  const amountWithSlippage =
    tradeType === TradeType.Buy
      ? // if you're buying an exact amount,
        // you must be willing to pay more
        amountBN.plus(slippageAmount)
      : // if you're selling an exact amount,
        // you should be willing to receive less
        amountBN.minus(slippageAmount);

  return amountWithSlippage.toFixed(0);
};

export const applyTradeFee = (
  amount: string,
  // TODO: get this from constants
  tradeFee: string = '0.002', // 0.2% default
  tradeType: TradeType
) => {
  let fee = new BigNumber(amount).multipliedBy(new BigNumber(tradeFee));

  const amountBN = new BigNumber(amount);

  const amountWithFee =
    tradeType === TradeType.Buy ? amountBN.plus(fee) : amountBN.minus(fee);

  return amountWithFee.toFixed(0);
};

export const useSubmitTradeMutationResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return useResolverToRef(
    useCallback(
      async (
        _obj,
        args: Maybe<SubmitTradeMutationVariables>,
        { cache }: { cache: ApolloCache<NormalizedCacheObject> }
      ) => {
        if (!args || !apiInstance) return;
        if (
          args?.poolType === PoolType.XYK &&
          args?.tradeType === TradeType.Buy
        ) {
          return await buyXyk(
            cache,
            apiInstance,
            args.assetOutId,
            args.assetInId,
            args.assetOutAmount,
            args.amountWithSlippage
          );
        }

        if (
          args?.poolType === PoolType.XYK &&
          args?.tradeType === TradeType.Sell
        ) {
          return await sellXyk(
            cache,
            apiInstance,
            args.assetInId,
            args.assetOutId,
            args.assetInAmount,
            args.amountWithSlippage
          );
        }

        if (
          args?.poolType === PoolType.LBP &&
          args?.tradeType === TradeType.Buy
        ) {
          return await buyLbp(
            cache,
            apiInstance,
            args.assetOutId,
            args.assetInId,
            args.assetOutAmount,
            args.amountWithSlippage
          );
        }

        if (
          args?.poolType === PoolType.LBP &&
          args?.tradeType === TradeType.Sell
        ) {
          return await sellLbp(
            cache,
            apiInstance,
            args.assetOutId,
            args.assetInId,
            args.assetOutAmount,
            args.amountWithSlippage
          );
        }

        throw new Error('We dont support this trade type yet');
      },
      [apiInstance]
    )
  );
};
