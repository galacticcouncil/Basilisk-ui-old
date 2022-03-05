import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../generated/graphql';

export const repayFeeDataType = '(u32, u32)';

export const unwrapITupleU32ToFee = (apiInstance: ApiPromise): Fee => {
  const tuple = apiInstance.createType(
    repayFeeDataType,
    apiInstance.consts.lbp.repayFee
  );

  return {
    numerator: tuple[0].toString(),
    denominator: tuple[1].toString(),
  };
};

// todo still fix this 👆
