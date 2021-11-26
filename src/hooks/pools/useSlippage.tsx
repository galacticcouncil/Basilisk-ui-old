import BigNumber from 'bignumber.js';
import { isNaN } from 'lodash';
import { useMemo } from 'react';
import { fromPrecision12 } from '../math/useFromPrecision';
import { percentageChange } from '../math/usePercentageChange';
import { toPrecision12 } from '../math/useToPrecision';

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

    console.log('calculateSlippage', {
        spotPrice,
        assetAAmount,
        assetBAmount,
        spotPriceAmount,
        resultPercentageChange
    });

    if (!resultPercentageChange || resultPercentageChange.isNaN()) return;

    // TODO: don't use this for every bignumber call
    // TODO: fix edge cases for .09 decimal formatting
    BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP });
    const percentualSlippage = new BigNumber(resultPercentageChange)
        .multipliedBy(100)
        .abs()
        .toFixed(10) // TODO: deal with formatting to 2 decimal places when displaying the result

    return {
        percentualSlippage,
        spotPriceAmount
    }
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
    spotPrice?: string,
    assetAAmount?: string,
    assetBAmount?: string
) => (
    useMemo(() => {
        if (!spotPrice || !assetAAmount || !assetBAmount) return;
        return calculateSlippage(spotPrice, assetAAmount, assetBAmount);
        // TODO: figure out dependencies
    }, [spotPrice, assetBAmount])
)