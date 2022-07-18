import { MutationHookOptions, useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { PoolType } from '../../../components/Chart/shared';
import { TradeType } from '../../../generated/graphql';

const SUBMIT_TRADE = loader('./../graphql/SubmitTrade.mutation.graphql');

export interface SubmitTradeMutationVariables {
  assetInId: string;
  assetOutId: string;
  assetInAmount: string;
  assetOutAmount: string;
  poolType: PoolType;
  tradeType: TradeType;
  amountWithSlippage: string;
}

export const useSubmitTradeMutation = (
  options?: MutationHookOptions<any, any>
) =>
  useMutation<void, SubmitTradeMutationVariables>(SUBMIT_TRADE, {
    notifyOnNetworkStatusChange: true,
    ...options,
  });

/**
 * lbp.buy(assetOut, assetIn, amount, maxLimit)
 * lbp.sell(assetIn, assetOut, amount, maxLimit)
 *
 * exchange.buy(assetBuy, assetSell, amountBuy, maxSold, discount)
 * exchange.sell(assetSell, assetBuy, amountSell, minBought, discount)
 */
