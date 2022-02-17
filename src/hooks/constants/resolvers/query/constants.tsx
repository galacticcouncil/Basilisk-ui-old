import { useCallback } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../../generated/graphql';
import { usePolkadotJsContext } from '../../../polkadotJs/usePolkadotJs';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsMutationResolvers';
import { fetchConstants } from '../../lib/fetchConstants';

export const __typename: Constants['__typename'] = 'Constants';
const withTypename = (constants: Constants) => ({
  __typename,
  ...constants,
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
    constants: useResolverToRef(
      useCallback(() => {
        if (!apiInstance || loading) return;
        return constantsQueryResolver(apiInstance);
      }, [apiInstance, loading]),
      'constants'
    ),
  };
};
