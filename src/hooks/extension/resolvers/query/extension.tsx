import { useCallback } from 'react';
import { Extension } from '../../../../generated/graphql';
import { getExtension } from '../../lib/getExtension';
import { useResolverToRef } from '../../../accounts/resolvers/useAccountsResolvers';

// make sure the __typename is well typed
export const __typename: Extension['__typename'] = 'Extension';
// helper function to decorate the extension entity for normalised caching
const withTypename = (extension: Extension) => ({
  __typename,
  ...extension,
});

/**
 * Resolver for the `Extension` entity which uses the standalone lib/getExtension
 * function to resolve the requested data.
 *
 * There are no arguments in this resolver, it only returns the normalized `Extension` entity.
 */
export const extensionQueryResolver = async () =>
  withTypename(await getExtension());

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useExtensionQueryResolver = () => ({
  // key is the entity, value is the resolver
  extension: useResolverToRef(
    // practically we dont have to wrap this in useCallback
    // since it does not have any contextual dependencies
    useCallback(extensionQueryResolver, []),
    'extension'
  ),
});
