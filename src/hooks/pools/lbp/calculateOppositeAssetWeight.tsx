import BigNumber from 'bignumber.js';

export const hundredWithPrecision6 = new BigNumber('100').multipliedBy(
  new BigNumber('10').pow('6')
);

/**
 * LBP pools specify weights only for the first asset in the pool,
 * the `opposite` weights need to be calculated by subtracting from `100 000 000`
 * @param weight
 * @returns Calculated oppostite weight as `100 000 000 - weight`
 */
export const calculateOppositeAssetWeight = (weight: string): string => {
  return new BigNumber(hundredWithPrecision6)
    .minus(new BigNumber(weight))
    .toFixed(0);
};
