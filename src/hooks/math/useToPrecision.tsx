import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { PRECISION_12 } from './useFromPrecision';

export const PRECISION_0 = 0;
export const precision12 = new BigNumber(10).pow(12);
export const precision18 = new BigNumber(10).pow(18);

export const toPrecision12 = (amount: string | undefined) => (
    amount && new BigNumber(amount)
            .multipliedBy(precision12).toFixed(PRECISION_0)
);
export const useToPrecision12 = (amount: string | undefined) => (
    useMemo(() => toPrecision12(amount), [amount])
)

export const useToPrecision18 = (amount: string | undefined) => (
    useMemo(() => (
        amount && new BigNumber(amount)
            .multipliedBy(precision18).toFixed(PRECISION_0)
    ), [amount])
)