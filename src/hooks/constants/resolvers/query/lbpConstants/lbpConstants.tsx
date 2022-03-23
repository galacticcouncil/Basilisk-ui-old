import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Fee, LbpConstants } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { getRepayFee } from '../../../lib/getRepayFee';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export type LbpConstantsQueryResolver = () => {
  lbp: () => Promise<LbpConstants>;
};

export type LbpConstantsQueryResolverFactoryType = (
  arg0: ApiPromise | undefined
) => () => { repayFee: Fee };

export const lbpConstantsQueryResolverFactory: LbpConstantsQueryResolverFactoryType =
  (apiInstance?: ApiPromise) => () => {
    if (!apiInstance) {
      throw Error(errors.apiInstanceNotInitialized);
    }

    return {
      repayFee: getRepayFee(apiInstance),
    };
  };

export const useLbpConstantsQueryResolver: LbpConstantsQueryResolver = () => {
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
