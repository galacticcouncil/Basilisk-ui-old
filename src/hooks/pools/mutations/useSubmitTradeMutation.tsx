import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

const SUBMIT_TRADE = loader('./../graphql/SubmitTrade.mutation.graphql');

export interface SubmitTradeMutationVariables {

}

export const useSubmitTradeMutation = useMutation<void, SubmitTradeMutationVariables>(
    SUBMIT_TRADE
)

/**
 * lbp.buy(assetOut, assetIn, amount, maxLimit)
 * lbp.sell(assetIn, assetOut, amount, maxLimit)
 * 
 * exchange.buy(assetBuy, assetSell, amountBuy, maxSold, discount)
 * exchange.sell(assetSell, assetBuy, amountSell, minBought, discount)
 */