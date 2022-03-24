import { useCallback, useMemo } from 'react';
import { BrowserExtension, Extension, InputMaybe } from '../../../../generated/graphql';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import { getExtension } from '../../lib/getExtension';
import { usePersistBrowserExtension } from '../mutation/setActiveBrowserExtension';

// make sure the __typename is well typed
export const __typename: Extension['__typename'] = 'Extension';
// helper function to decorate the extension entity for normalised caching
const withTypename = (extension: Extension) => ({
  __typename,
  ...extension,
});

/**
 * Resolver for the `Extension` entity which uses the standalone lib/getExtension
 * function to resolve the reqested data.
 */
export const extensionQueryResolverFactory = (persistedBrowserExtension?: {
  browserExtension?: InputMaybe<BrowserExtension> | undefined
}) => 
  async (): Promise<Extension> =>
    withTypename(await getExtension(persistedBrowserExtension));

  

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useExtensionQueryResolver = () => {
  const [persistedBrowserExtension] = usePersistBrowserExtension()
  return {
    // key is the entity, value is the resolver
    extension: useMemo(
      () => withErrorHandler(extensionQueryResolverFactory(persistedBrowserExtension)),
      [persistedBrowserExtension]
    )
  };
}