import { useMemo } from 'react';
import { ApolloClient, createHttpLink, from, InMemoryCache, Resolvers,  } from '@apollo/client';
import { useAccountsQueryResolvers } from '../accounts/resolvers/useAccountsQueryResolvers';
import { loader } from 'graphql.macro';
import { useAccountsMutationResolvers } from '../accounts/resolvers/useAccountsMutationResolvers';
import { useRefetchWithNewBlock } from '../lastBlock/useRefetchWithNewBlock';
import { usePersistentConfig } from '../config/usePersistentConfig';
import { useVestingMutationResolvers } from '../vesting/useVestingMutationResolvers';

import { useBalanceMutationResolvers } from '../balances/useBalanceMutationResolvers';
import { useExtensionQueryResolvers } from '../polkadotJs/useExtensionQueryResolvers';
import { useConfigQueryResolvers } from '../config/useConfigQueryResolvers';
import { useConfigMutationResolvers } from '../config/useConfigMutationResolver';
import { useFeePaymentAssetsQueryResolvers } from '../feePaymentAssets/useFeePaymentAssetsQueryResolvers';
import { usePoolsQueryResolver } from '../pools/resolvers/usePoolsQueryResolver';
import { useBalanceQueryResolvers } from '../balances/useBalanceQueryResolvers';
import { useAssetsQueryResolvers } from '../assets/resolvers/useAssetsQueryResolvers';

/**
 * Add all local gql resolvers here
 * @returns Resolvers
 */
export const useResolvers: () => Resolvers = () => {
    const { Query: AccountsQueryResolver, Account } = useAccountsQueryResolvers();
    const { Query: PoolsQueryResolver, XYKPool, LBPPool } = usePoolsQueryResolver()
    return {
        Query: {
            ...AccountsQueryResolver,
            ...useExtensionQueryResolvers(),
            ...useConfigQueryResolvers(),
            ...useFeePaymentAssetsQueryResolvers(),
            ...useBalanceQueryResolvers(),
            ...PoolsQueryResolver,
            ...useAssetsQueryResolvers(),
        },
        Mutation: {
            ...useAccountsMutationResolvers(),
            ...useVestingMutationResolvers(),
            ...useBalanceMutationResolvers(),
            ...useConfigMutationResolvers()
        },
        Account,
        XYKPool,
        LBPPool
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
    // can't get the config from a query before we setup apollo
    // therefore we get it from the local storage instead
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