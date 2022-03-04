import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import { getConstants } from '../../lib/getConstants';
import errors from '../../../../errors';

export const __typename: Constants['__typename'] = 'Constants';
const withTypename = (constants: Constants) => ({
  __typename,
  ...constants,
});

/**
 * Resolver for the `Constants` entity. Uses the standalone lib/getConstants
 * function to resolve the reqested data.
 *
 * @param apiInstance ApiPromise
 */
export const constantsQueryResolverFactory =
  (apiInstance?: ApiPromise) => () => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    console.log('in constants resolver');
    return withTypename(getConstants(apiInstance));
  };

export const useConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    constants: withErrorHandler(
      useMemo(() => constantsQueryResolverFactory(apiInstance), [apiInstance]),
      'constants'
    ),
  };
};
