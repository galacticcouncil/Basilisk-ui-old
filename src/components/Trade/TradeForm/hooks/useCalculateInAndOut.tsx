import { useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Pool, TradeType } from '../../../../generated/graphql';
import { useMathContext } from '../../../../hooks/math/useMath';
import { toPrecision12 } from '../../../../hooks/math/useToPrecision';
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolXYK } from '../../../../hooks/pools/xyk/calculateOutGivenIn';
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolLBP } from '../../../../hooks/pools/lbp/calculateOutGivenIn';
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolXYK } from '../../../../hooks/pools/xyk/calculateInGivenOut';
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolLBP } from '../../../../hooks/pools/lbp/calculateInGivenOut';
import { poolHasAssets } from '../../../../hooks/pools/poolHasAssets';
import { fromPrecision12 } from '../../../../hooks/math/useFromPrecision';
import log from 'loglevel';
import { TradeFormFields } from './useTradeForm';

// TODO: loading state when calculating the fee
/**
 * Calculate in/out amounts respectively for both XYK & LBP
 * @param form 
 * @param tradeType 
 * @param pool 
 */
 export const useCalculateInAndOut = (
    form: UseFormReturn<TradeFormFields>,
    tradeType: TradeType,
    pool?: Pool
) => {
    const { math } = useMathContext();
    let [assetInId, assetInAmount] = form.watch(['assetInId', 'assetInAmount']);
    let [assetOutId, assetOutAmount] = form.watch(['assetOutId', 'assetOutAmount']);
    
    // convert the user input to the required precision
    assetInAmount = toPrecision12(assetInAmount);
    assetOutAmount = toPrecision12(assetOutAmount);

    const calculateOutGivenIn = useMemo(() => (
        pool?.__typename === 'XYKPool'
            ? calculateOutGivenInFromPoolXYK
            : calculateOutGivenInFromPoolLBP
    ), [pool])

    const calculateInGivenOut = useMemo(() => (
        pool?.__typename === 'XYKPool'
            ? calculateInGivenOutFromPoolXYK
            : calculateInGivenOutFromPoolLBP
    ), [pool]);
    
    useEffect(() => {
        if (!pool || !math || !assetOutId || !assetInAmount) return;
        if (!poolHasAssets(pool, assetInId, assetOutId)) return;
        if (tradeType !== TradeType.Sell) return;

        const outAmount = calculateOutGivenIn(
            math, 
            pool as any, 
            assetInId, 
            assetOutId, 
            assetInAmount
        )
        
        /**
         * if LBP && assetOut == accumulated asset then 
         * apply fee on top of outAmount
         */

        log.debug('TradeForm.useCalculateInAndOut', 'outAmount', outAmount);

        form.setValue('assetOutAmount', fromPrecision12(outAmount));
    }, [assetInAmount, assetInId, assetOutId, tradeType, pool])

    useEffect(() => {
        if (!pool || !math || !assetOutId || !assetOutAmount) return;
        if (!poolHasAssets(pool, assetInId, assetOutId)) return;
        if (tradeType !== TradeType.Buy) return;

        // TODO: when LBP & assetOut === accumulated asset
        // then calculateFee with assetOutAmount

        /**
         * when the case above happens, your trade happens at a worse spot price
         * and the pool pays the repayFee on your behalf
         */

        const inAmount = calculateInGivenOut(
            math, 
            pool as any, 
            assetInId, 
            assetOutId, 
            // difference between calc (assetOut+fee) and calc(assetOut) is the absolute fee
            assetOutAmount //TODO: use assetOutAmount + fee
        );
        
        log.debug('TradeForm.useCalculateInAndOut', 'inAmount', fromPrecision12(inAmount));

        form.setValue('assetInAmount', fromPrecision12(inAmount));
    }, [assetOutAmount, assetInId, assetOutId, tradeType, pool])
}