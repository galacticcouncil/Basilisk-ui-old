import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Fee, LbpPool, Pool } from '../../../generated/graphql';
import { TradeFormFields } from './useTradeForm';
import BigNumber from 'bignumber.js';
import log from 'loglevel';
import { feeFromPool, feeToPercentage } from './usePercentageFee';

export const defaultAllowedSlippage = {
    xyk: '5',
    lbp: '5'
}

export const addFeeToSlippage = (slippage: string, fee?: Fee) => {
    if (!fee) return slippage;
    
    return new BigNumber(slippage).plus(
        feeToPercentage(fee)
    ).toFixed(2);
}

export const useCalculateAllowedSlippage = (
    form: UseFormReturn<TradeFormFields>,
    pool?: Pool,
) => {
    const watchAutoSlippage = form.watch('autoSlippage');
    const allowedSlippageInputDisabled = useMemo(() => (
        form.getValues('autoSlippage')
    ), [watchAutoSlippage]);

    useEffect(() => {
        if (!allowedSlippageInputDisabled) return;

        // TODO: depending on if the LBP repay fee is applied,
        // increase the lbp default slippage
        const allowedSlippage = pool
            ? (
                pool?.__typename === 'XYKPool'
                ? defaultAllowedSlippage.xyk
                : defaultAllowedSlippage.lbp
            ) : defaultAllowedSlippage.xyk;

        const allowedSlippageWithFee = addFeeToSlippage(
            allowedSlippage,
            feeFromPool(pool)
        )

        log.debug('TradeForm.useCalculateAllowedSlippage', 'allowedSlippageWithFee', allowedSlippageWithFee);

        form.setValue('allowedSlippage', allowedSlippageWithFee);
    }, [pool, allowedSlippageInputDisabled])

    return { allowedSlippageInputDisabled };
}