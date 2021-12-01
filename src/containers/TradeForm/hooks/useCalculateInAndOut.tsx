import { useMemo, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Pool, TradeType } from '../../../generated/graphql';
import { useMathContext } from '../../../hooks/math/useMath';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolXYK } from '../../../hooks/pools/xyk/calculateOutGivenIn';
import { calculateOutGivenInFromPool as calculateOutGivenInFromPoolLBP } from '../../../hooks/pools/lbp/calculateOutGivenIn';
import { TradeFormFields } from '../TradeForm';
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolXYK } from '../../../hooks/pools/xyk/calculateInGivenOut';
import { calculateInGivenOutFromPool as calculateInGivenOutFromPoolLBP } from '../../../hooks/pools/lbp/calculateInGivenOut';
import { poolHasAssets } from '../../../hooks/pools/poolHasAssets';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import log from 'loglevel';
import { applyTradeFee } from '../../../hooks/pools/resolvers/useSubmitTradeMutationResolvers';

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
    let [assetAId, assetAAmount] = form.watch(['assetAId', 'assetAAmount']);
    let [assetBId, assetBAmount] = form.watch(['assetBId', 'assetBAmount']);
    
    // convert the user input to the required precision
    assetAAmount = toPrecision12(assetAAmount);
    assetBAmount = toPrecision12(assetBAmount);

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
        if (!pool || !math || !assetBId || !assetAAmount) return;
        if (!poolHasAssets(pool, assetAId, assetBId)) return;
        if (tradeType !== TradeType.Sell) return;

        const outAmount = calculateOutGivenIn(
            math, 
            pool as any, 
            assetAId, 
            assetBId, 
            assetAAmount
        )

        // TODO: apply fee per LBP / XYK separately for both in / out
        
        log.debug('TradeForm.useCalculateInAndOut', 'outAmount', outAmount);

        form.setValue('assetBAmount', fromPrecision12(outAmount));
    }, [assetAAmount, assetAId, assetBId, tradeType, pool])

    useEffect(() => {
        if (!pool || !math || !assetBId || !assetBAmount) return;
        if (!poolHasAssets(pool, assetAId, assetBId)) return;
        if (tradeType !== TradeType.Buy) return;

        const inAmount = calculateInGivenOut(
            math, 
            pool as any, 
            assetAId, 
            assetBId, 
            assetBAmount
        );
        
        log.debug('TradeForm.useCalculateInAndOut', 'inAmount', fromPrecision12(inAmount));

        form.setValue('assetAAmount', fromPrecision12(inAmount));
    }, [assetBAmount, assetAId, assetBId, tradeType, pool])
}