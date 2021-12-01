import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoolType } from '../../../components/Chart/shared';
import { TradeType } from '../../../generated/graphql';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';
import { useSubmitTradeMutation } from '../../../hooks/pools/mutations/useSubmitTradeMutation';
import { applyAllowedSlippage } from '../../../hooks/pools/resolvers/useSubmitTradeMutationResolvers';
import { SpotPrice } from '../../../pages/TradePage/TradePage';
import { TradeFormProps } from '../TradeForm';
import { Slippage } from './useSlippage';
import { TradeFormFields } from './useTradeForm';

/**
 * Submit the trade mutation once the trade form has been submitted
 * @param tradeType
 * @param pool 
 * @returns 
 */
 export const useHandleSubmit = (
    tradeType: TradeType,
    allowedSlippage: string,
    slippage?: Slippage,
    pool?: TradeFormProps['pool'],

) => {
    const [submitTrade] = useSubmitTradeMutation();
    return useCallback(({
        assetInId,
        assetOutId,
        assetInAmount,
        assetOutAmount
    }: TradeFormFields) => {
        if (!pool) throw new Error(`Can't submit a trade mutation without a pool`);

        assetInAmount = toPrecision12(assetInAmount);
        assetOutAmount = toPrecision12(assetOutAmount);

        if (!assetInId || !assetOutId || !assetInAmount || !assetOutAmount || !slippage?.spotPriceAmount) {
            throw new Error(`Can't submit a trade mutation without all the required arguments`)
        }

        const amountWithSlippage = applyAllowedSlippage(
            slippage?.spotPriceAmount,
            allowedSlippage,
            tradeType
        );

        const poolType = pool.__typename === 'LBPPool'
            ? PoolType.LBP
            : PoolType.XYK

        // Submit a trade with the given parameters to be handled by Apollo
        submitTrade({ variables: {
            tradeType,
            assetInId,
            assetInAmount,
            assetOutId,
            assetOutAmount,
            amountWithSlippage,
            poolType,
        }});

    }, [submitTrade, pool, tradeType, slippage]);
}