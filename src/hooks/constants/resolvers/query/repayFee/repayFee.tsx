import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Fee } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename: Fee['__typename'] = 'Fee';
const withTypename = (repayFee: Fee) => ({
  __typename,
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
    repayFee: withErrorHandler(
      useMemo(() => repayFeeQueryResolverFactory(apiInstance), [apiInstance]),
      'repayFee'
    ),
  };
};
