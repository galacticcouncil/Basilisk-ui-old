import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Fee, LbpPool, Pool } from '../../../generated/graphql';
import { TradeFormFields } from './useTradeForm';
import constants from './../../../constants';
import BigNumber from 'bignumber.js';
import log from 'loglevel';

export const defaultAllowedSlippage = {
    xyk: '5',
    lbp: '5'
}

export const addFeeToSlippage = (slippage: string, fee?: Fee) => {
    if (!fee) return slippage;
    
    return new BigNumber(slippage).plus(
        new BigNumber(fee.numerator)
            .dividedBy(fee.denominator)
            .multipliedBy('100')
    ).toFixed(2);
}

export const useCalculateAllowedSlippage = (
    form: UseFormReturn<TradeFormFields>,
    pool?: Pool
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
            pool
            ? (
                pool.__typename === 'XYKPool'
                    ? constants.xykFee
                    : (pool as LbpPool).fee
            ) : undefined
        )

        console.log('fee', pool
        ? (
            pool.__typename === 'XYKPool'
                ? constants.xykFee
                : (pool as LbpPool).fee
        ) : undefined);

        log.debug('TradeForm.useCalculateAllowedSlippage', 'allowedSlippageWithFee', allowedSlippageWithFee);

        form.setValue('allowedSlippage', allowedSlippageWithFee);
    }, [pool, allowedSlippageInputDisabled])

    return { allowedSlippageInputDisabled };
}