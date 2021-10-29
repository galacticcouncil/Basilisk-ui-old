import { defaultConfig, useConfig } from '../config/useConfig'
import { useMemo, useState } from 'react';
import { ApolloClient, InMemoryCache, Resolvers, makeVar } from '@apollo/client';
import { useConfigQueryResolver } from '../config/useConfigQueries';
import { usePolkadotJsExtensionQueryResolvers } from './polkadotJs/extension/usePolkadotJsExtensionQueries';
import { usePolkadotJsExtensionAccountsMutationResolvers } from './polkadotJs/extension/accounts/usePolkadotJsExtensionAccountsMutations';
import { usePolkadotJsExtensionAccountsQueryResolvers } from './polkadotJs/extension/accounts/usePolkadotJsExtensionAccountsQueries';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
    return {
        Query: {
            ...useConfigQueryResolver(),
            ...usePolkadotJsExtensionQueryResolvers(),
            ...usePolkadotJsExtensionAccountsQueryResolvers(),
        },
        Mutation: {
            ...usePolkadotJsExtensionAccountsMutationResolvers()
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