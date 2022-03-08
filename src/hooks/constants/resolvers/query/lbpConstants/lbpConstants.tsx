import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { LbpConstants } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename: LbpConstants['__typename'] = 'LBPConstants';
const withTypename = () => ({
  __typename,
});

/**
 * sub-resolver for constants.lbp
 *
 * * @param apiInstance ApiPromise
 */
export const lbpConstantsQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  (/** resolver arguments go here if needed in future */) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);

    return withTypename();
  };

export const useLbpConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();
  return {
    lbp: useMemo(
      () =>
        withErrorHandler(
          lbpConstantsQueryResolverFactory(apiInstance),
          'lBPConstants'
        ),
      [apiInstance]
    ),
  };
};
