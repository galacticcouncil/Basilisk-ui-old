import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Fee, RepayFee } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename: RepayFee['__typename'] = 'RepayFee';
const id = 'LBPConstantsFee';
const withTypename = (repayFee: Fee): RepayFee => ({
  __typename,
  id,
  ...repayFee,
});

/**
 * sub-resolver for constants.lbp.repayFee - Uses lib/getRepayFee get requested data
 *
 * @param apiInstance ApiPromise
 *
 */
export const repayFeeQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  (/** resolver arguments go here if needed in future */) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    return withTypename(getRepayFee(apiInstance));
  };

export const useRepayFeeQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    repayFee: useMemo(
      () =>
        withErrorHandler(repayFeeQueryResolverFactory(apiInstance), 'repayFee'),
      [apiInstance]
    ),
  };
};
