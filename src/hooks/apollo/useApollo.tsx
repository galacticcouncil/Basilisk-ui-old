import { defaultConfig, useConfig } from '../config/useConfig'
import { useMemo, useState } from 'react';
import { ApolloClient, InMemoryCache, Resolvers, makeVar } from '@apollo/client';
import { useConfigResolver } from '../config/useConfigQueries';
import { usePolkadotJsExtensionResolver } from '../polkadot/usePolkadotJsExtensionQueries';
import { usePolkadotExtensionAccountsResolver } from '../polkadot/usePolkadotJsExtensionAccountsQueries';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
    const isQueryRunning = makeVar(false);
    return {
        Query: {
            ...useConfigResolver(),
            ...usePolkadotJsExtensionResolver(),
            ...usePolkadotExtensionAccountsResolver(),
        }
    }
};

/**
 * Recreates the apollo client instance each time the config changes
 * @returns 
 */
export const useConfigureApolloClient = () => {
    const { config } = useConfig();
    const resolvers = useResolvers();

    const cache =  new InMemoryCache();
    const client = useMemo(() => new ApolloClient({
        uri: config.processorUrl,
        cache,
        // TODO: don't connect in production
        connectToDevTools: true,
        queryDeduplication: true,
        resolvers
    }), [config.processorUrl]);
    
    return client;
};

export const useApollo = () => useConfigureApolloClient();