import BigNumber from 'bignumber.js';
import { Fee, LbpPool, Pool } from '../../../generated/graphql';
import constants from './../../../constants';

export const feeToPercentage = (fee: Fee) => {
    return new BigNumber(fee.numerator)
        .dividedBy(fee.denominator)
        .multipliedBy('100')
        .toFixed(2);
}

export const feeFromPool = (pool?: Pool): Fee | undefined => {
    return pool
        ? (
            pool.__typename === 'XYKPool'
                ? constants.xykFee
                : (pool as LbpPool).fee
        ) : undefined
}

export const usePercentageFee = (pool?: Pool) => {
    const fee = feeFromPool(pool);
    if (!fee) return;
    return feeToPercentage(fee);
} 