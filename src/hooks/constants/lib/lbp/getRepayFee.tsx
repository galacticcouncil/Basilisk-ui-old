import '@polkadot/api-augment';
import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../../generated/graphql';

/**
 * This function fetches the lbp repayFee chain constant.
 *
 * @param apiInstance polkadotJs ApiPromise instance
 * @returns Fee repayFee
 */
export const getRepayFee = (apiInstance: ApiPromise): Fee => {
  const [numerator, denominator] = apiInstance.consts.lbp.getRepayFee;

  return {
    numerator,
    denominator,
  };
};
