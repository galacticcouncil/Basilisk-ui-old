import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { LbpConstants } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename: LbpConstants['__typename'] = 'LBPConstants';

const withTypename = (obj: {}) => ({
  __typename,
  ...obj,
});

const withId = (obj: {}) => ({
  id: __typename,
  ...obj,
});

export const lbpConstantsQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  (/** resolver arguments go here if needed in future */) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);

    return withTypename(
      withId({
        repayFee: {
          ...getRepayFee(apiInstance),
        },
      })
    );
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
