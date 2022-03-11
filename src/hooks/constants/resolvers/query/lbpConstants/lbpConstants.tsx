import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const lbpConstantsQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  () => {
    if (!apiInstance) { console.log(apiInstance); throw Error(errors.apiInstanceNotInitialized)};

    return {
      repayFee: {
        ...getRepayFee(apiInstance),
      },
    }
  };

export const useLbpConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    lbp: useMemo(
      () =>
        withErrorHandler(
          lbpConstantsQueryResolverFactory(apiInstance),
          'LbpConstants'
        ),
      [apiInstance]
    ),
  };
};
