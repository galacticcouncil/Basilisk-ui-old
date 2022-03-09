import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { LbpConstants, RepayFee } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename_lbp_constants: LbpConstants['__typename'] =
  'LBPConstants';
export const __typename_repay_fee: RepayFee['__typename'] = 'RepayFee';
const lbpConstantsId = 'lbpConstansId';
const repayFeeId = 'repayFeeId';

export const lbpConstantsQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  (/** resolver arguments go here if needed in future */) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);

    return {
      __typename: __typename_lbp_constants,
      id: lbpConstantsId,
      repayFee: {
        __typename: __typename_repay_fee,
        id: repayFeeId,
        ...getRepayFee(apiInstance),
      },
    };
  };

export const useLbpConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    lbp: useMemo(
      () =>
        withErrorHandler(
          lbpConstantsQueryResolverFactory(apiInstance),
          'LBPConstants'
        ),
      [apiInstance]
    ),
  };
};
