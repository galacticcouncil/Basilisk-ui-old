import { useMemo } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../../polkadotJs/usePolkadotJs';
import { withErrorHandler } from '../../../../apollo/withErrorHandler';
import errors from '../../../../../errors';

export const __typename: Constants['__typename'] = 'Constants';
const withTypename = () => ({
  __typename,
});

/**
 * Resolver for the `Constants` entity
 *
 * @param apiInstance ApiPromise
 */
export const constantsQueryResolverFactory =
  (apiInstance?: ApiPromise) => () => {
    if (!apiInstance) throw Error(errors.apiInstanceNotInitialized);
    return withTypename();
  };

export const useConstantsQueryResolver = () => {
  const { apiInstance } = usePolkadotJsContext();

  return {
    constants: useMemo(
      () =>
        withErrorHandler(
          constantsQueryResolverFactory(apiInstance),
          'constants'
        ),
      [apiInstance]
    ),
  };
};
