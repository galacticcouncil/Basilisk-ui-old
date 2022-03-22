import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../generated/graphql';

export const repayFeeDataType = '(u32, u32)';

export const getRepayFee = (apiInstance: ApiPromise): Fee => {
  const repayFee = apiInstance.createType(
    repayFeeDataType,
    apiInstance.consts.lbp.repayFee
  );

  return {
    numerator: repayFee[0].toString(),
    denominator: repayFee[1].toString(),
  };
};
