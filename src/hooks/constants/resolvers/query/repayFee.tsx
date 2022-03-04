import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Fee, LbpConstants } from '../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import errors from '../../../../errors';

export const __typename: Fee['__typename'] = 'Fee';
const withTypename = (repayFee: Fee) => ({
  __typename,
  ...repayFee,
});

/**
 * Resolver for the `repayFee` field
 *
 * @param parent The return value of the LbpConstants resolver
 */
export const repayFeeQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  ({ repayFee }: LbpConstants) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    if (!repayFee) throw Error('Super DAMN'); //TODO proper error
    return withTypename(repayFee);
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
