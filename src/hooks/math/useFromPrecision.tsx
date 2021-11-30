import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

export const PRECISION_12 = 12;
export const PRECISION_18 = 18;
export const precision12 = new BigNumber(10).pow(PRECISION_12);
export const precision18 = new BigNumber(10).pow(PRECISION_18);

export const fromPrecision12 = (amount?: string | BigNumber) => (
    amount && new BigNumber(amount)
        .dividedBy(precision12).toFixed(PRECISION_12)
)
export const useFromPrecision12 = (amount?: string | BigNumber) => (
    useMemo(() => fromPrecision12(amount), [amount])
)

export const useFromPrecision18 = (amount?: string | BigNumber) => (
    useMemo(() => (
        amount && new BigNumber(amount)
            .dividedBy(precision18).toFixed(PRECISION_18)
    ), [amount])
)