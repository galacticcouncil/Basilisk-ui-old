import { useEffect, useMemo } from 'react';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, Resolvers,  } from '@apollo/client';
import { useAccountsQueryResolvers } from '../accounts/useAccountsQueryResolvers';
import { loader } from 'graphql.macro';
import { useAccountsMutationResolvers } from '../accounts/useAccountsMutationResolvers';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { useRefetchWithNewBlock } from '../lastBlock/useRefetchWithNewBlock';
import { usePersistentConfig } from '../config/usePersistentConfig';
import { useVestingMutationResolvers } from '../vesting/useVestingMutationResolvers';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
    const { Query: AccountsQueryResolver, Account } = useAccountsQueryResolvers();
    return {
        Query: {
            ...AccountsQueryResolver,
        },
        Mutation: {
            ...useAccountsMutationResolvers(),
            ...useVestingMutationResolvers()
        },
        Account
    }
};

export const typeDefs = loader('./../../schema.graphql');


/**
 * Recreates the apollo client instance each time the config changes
 * @returns 
 */
export const useConfigureApolloClient = () => {
    const resolvers = useResolvers();
    const cache =  new InMemoryCache();
    const [{ processorUrl }] = usePersistentConfig();

    const client = useMemo(() => {
        return new ApolloClient({
            uri: processorUrl,
            cache,
            // TODO: don't connect in production
            connectToDevTools: true,
            queryDeduplication: true,
            resolvers,
            typeDefs,
        })
    }, [processorUrl]);
    
    useRefetchWithNewBlock(client);
    
    return client;
};

export const useApollo = () => useConfigureApolloClient();