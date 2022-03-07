import '@polkadot/api-augment';
import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../generated/graphql';

export const repayFeeDataType = '(u32, u32)';

export const getRepayFee = (apiInstance: ApiPromise): Fee => {
  const repayFeeUntyped = apiInstance.consts.lbp.repayFee;

  const repayFee = apiInstance.createType(repayFeeDataType, repayFeeUntyped);

  return {
    numerator: repayFee[0].toString(),
    denominator: repayFee[1].toString(),
  };
};
