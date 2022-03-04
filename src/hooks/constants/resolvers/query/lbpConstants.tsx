import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Constants, LbpConstants } from '../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import errors from '../../../../errors';

export const __typename: LbpConstants['__typename'] = 'LBPConstants';
const withTypename = (lbpConstants: LbpConstants): LbpConstants => ({
  __typename,
  ...lbpConstants,
});

/**
 * Resolver for the `LbpConstants` entity
 *
 * @param constants The return value of the Constants resolver
 */
export const lbpConstantsQueryResolverFactory =
  (apiInstance?: ApiPromise) =>
  ({ lbp }: Constants) => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    if (!lbp) throw Error('DAMN!'); //TODO proper error

    return withTypename(lbp);
  };

export const useLbpConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();
  console.log('in lbp resolver');
  return {
    lbpConstants: withErrorHandler(
      useMemo(
        () => lbpConstantsQueryResolverFactory(apiInstance),
        [apiInstance]
      ),
      'lBPConstants'
    ),
  };
};
