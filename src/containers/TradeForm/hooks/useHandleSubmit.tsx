import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoolType } from '../../../components/Chart/shared';
import { TradeType } from '../../../generated/graphql';
import { useSubmitTradeMutation } from '../../../hooks/pools/mutations/useSubmitTradeMutation';
import { SpotPrice } from '../../../pages/TradePage/TradePage';
import { TradeFormFields, TradeFormProps } from '../TradeForm';

/**
 * Submit the trade mutation once the trade form has been submitted
 * @param tradeType
 * @param pool 
 * @returns 
 */
 export const useHandleSubmit = (
    tradeType: TradeType,
    form: UseFormReturn<TradeFormFields>,
    spotPrice?: SpotPrice,
    pool?: TradeFormProps['pool'],

) => {
    const [submitTrade] = useSubmitTradeMutation();
    return useCallback(({
        assetAId,
        assetBId,
        assetAAmount,
        assetBAmount
    }: TradeFormFields) => {
        if (!pool) throw new Error(`Can't submit a trade mutation without a pool`);
        if (!assetAId || !assetBId || !assetAAmount || !assetBAmount) {
            throw new Error(`Can't submit a trade mutation without all the required arguments`)
        }

        const amountWithSlippage = '0';

        const poolType = pool.__typename === 'LBPPool'
            ? PoolType.LBP
            : PoolType.XYK

        // Submit a trade with the given parameters to be handled by Apollo
        submitTrade({ variables: {
            tradeType,
            assetAId,
            assetAAmount,
            assetBId,
            assetBAmount,
            amountWithSlippage,
            poolType
        }})
    }, [submitTrade, pool, tradeType]);
}