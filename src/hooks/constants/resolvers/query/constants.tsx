import { useCallback } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Constants, LbpConstants, Fee } from '../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import { fetchConstants } from '../../lib/fetchConstants';

export const __typenameConstants: Constants['__typename'] = 'Constants';
export const __typenameLbpConstants: LbpConstants['__typename'] =
  'LBPConstants';
export const __typenameFee: Fee['__typename'] = 'Fee';
const withTypename = (constants: Constants) => ({
  __typename: __typenameConstants,
  lbp: {
    __typename: __typenameLbpConstants,
    repayFee: {
      __typename: __typenameFee,
      ...constants.lbp.repayFee,
    },
  },
});

/**
 * Resolver for the `Constants` entity which uses the standalone lib/fetchConstants
 * function to resolve the reqested data.
 *
 * @param apiInstance ApiPromise
 */
export const constantsQueryResolver = (apiInstance: ApiPromise) =>
  withTypename(fetchConstants(apiInstance));

export const useConstantsQueryResolver = () => {
  const { apiInstance, loading } = usePolkadotJsContext();

  return {
    constants: withErrorHandler(
      useCallback(() => {
        if (!apiInstance || loading) return;
        return constantsQueryResolver(apiInstance);
      }, [apiInstance, loading]),
      'constants'
    ),
  };
};
