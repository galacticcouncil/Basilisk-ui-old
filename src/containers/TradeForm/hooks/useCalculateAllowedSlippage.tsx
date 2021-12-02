import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Pool } from '../../../generated/graphql';
import { TradeFormFields } from './useTradeForm';

export const defaultAllowedSlippage = {
    xyk: '5',
    lbp: '30'
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

        form.setValue('allowedSlippage', allowedSlippage);
    }, [pool, allowedSlippageInputDisabled])

    return { allowedSlippageInputDisabled };
}