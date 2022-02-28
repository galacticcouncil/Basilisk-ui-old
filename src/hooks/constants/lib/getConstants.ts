import { ApiPromise } from '@polkadot/api';
import { Constants, Fee } from '../../../generated/graphql';

export const repayFeeDataType = '(u32, u32)';

export const unwrapRepayFeeToFee = (apiInstance: ApiPromise): Fee => {
  const apiRepayFee = apiInstance
    .createType(repayFeeDataType, apiInstance.consts.lbp.getRepayFee)
    .toHuman() as Array<string>;

  return {
    numerator: apiRepayFee[0],
    denominator: apiRepayFee[1],
  };
};
export const getConstants = (apiInstance: ApiPromise): Constants => ({
  lbp: {
    repayFee: unwrapRepayFeeToFee(apiInstance),
  },
});
