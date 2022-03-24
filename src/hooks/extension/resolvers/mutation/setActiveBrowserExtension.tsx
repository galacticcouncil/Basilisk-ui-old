import { useCallback, useMemo } from "react"
import { BrowserExtension, InputMaybe, MutationSetActiveBrowserExtensionArgs } from "../../../../generated/graphql"
import { withErrorHandler } from "../../../apollo/withErrorHandler"
import { PersistActiveBrowserExtension, setActiveBrowserExtension } from "../../lib/setActiveBrowserExtension"
import createPersistedState from 'use-persisted-state';
import { ApolloCache, Resolver } from "@apollo/client";

export const key = 'basilisk-browser-extension'
export const usePersistBrowserExtension = createPersistedState<{
    browserExtension: InputMaybe<BrowserExtension> | undefined
}>(key);

export const setActiveBrowserExtensionQueryResolverFactory = 
    (persistActiveBrowserExtension: PersistActiveBrowserExtension): Resolver => 
        async (
            _obj, 
            args: MutationSetActiveBrowserExtensionArgs, 
            { cache }: { cache: ApolloCache<any> }
        ) => await setActiveBrowserExtension(
            args.browserExtension,
            persistActiveBrowserExtension,
            cache
        )

export const useSetActiveBrowserExtensionMutationResolver = () => {
    const [_persistedBrowserExtension, setPersistedBrowserExtension] = usePersistBrowserExtension()

    return {
        setActiveBrowserExtension: useMemo(
            () => withErrorHandler(
                setActiveBrowserExtensionQueryResolverFactory(setPersistedBrowserExtension),
                'setActiveBrowserExtension'
            ), 
            [setPersistedBrowserExtension]
        ),
    }
}