import BigNumber from 'bignumber.js';
import { isNaN } from 'lodash';
import { useMemo } from 'react';
import { TradeType } from '../../../generated/graphql';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { percentageChange } from '../../../hooks/math/usePercentageChange';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';

export interface Slippage {
    percentualSlippage: string,
    spotPriceAmount: string
}

export const calculateSlippage = (
    spotPrice: string,
    assetAAmount: string,
    assetBAmount: string,
) => {
    const spotPriceAmount = new BigNumber(spotPrice)
        .multipliedBy(
            fromPrecision12(assetBAmount)!
        )
        .toFixed(0);

    const resultPercentageChange = percentageChange(
        spotPriceAmount,
        assetAAmount
    );

    if (!resultPercentageChange || resultPercentageChange.isNaN()) return;

    // TODO: don't use this for every bignumber call
    // TODO: fix edge cases for .09 decimal formatting
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP });
    const percentualSlippage = new BigNumber(resultPercentageChange)
        .multipliedBy(100)
        .abs()
        .toFixed(10) // TODO: deal with formatting to 2 decimal places when displaying the result

    const slippage: Slippage = {
        percentualSlippage,
        spotPriceAmount
    }
    return slippage
}

/**
 * Slippage is the percieved difference between
 * the given `spotPrice` and the given assetAmount`
 * 
 * @param spotPrice
 * @param assetAmount 
 * @returns 
 */
export const useSlippage = (
    tradeType: TradeType,
    spotPrice?: {
        aToB?: string,
        bToA?: string
    },
    assetAAmount?: string,
    assetBAmount?: string,
) => {
    if (!spotPrice?.aToB || !spotPrice?.bToA || !assetAAmount || !assetBAmount) return;
    return calculateSlippage.apply(null,
        tradeType === TradeType.Buy
            ? [spotPrice.bToA, assetAAmount, assetBAmount]
            : [spotPrice.aToB, assetBAmount, assetAAmount]
    )
}