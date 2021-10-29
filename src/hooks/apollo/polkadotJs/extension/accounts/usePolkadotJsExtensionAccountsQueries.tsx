import { ApolloCache, gql, LazyQueryResult, NormalizedCacheObject, QueryLazyOptions, QueryResult, QueryTuple, Resolver, useLazyQuery, } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../../../../generated/graphql';
import { LazyQueryHookOptions } from '@apollo/client'
import { GetPolkadotExtensionQueryResponse } from '../usePolkadotJsExtensionQueries';
import constate from 'constate';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { web3Accounts } from '@polkadot/extension-dapp';
import { useDedupeResolver } from '../../../useDedupeResolver';
import { useGetPolkadotExtensionAccounts } from '../../../../polkadotJs/extension/accounts/useGetPolkadotJsExtensionAccounts';
import { usePersistActivePolkadotJsAccount } from '../../../../polkadotJs/extension/accounts/usePersistActivePolkadotJsAccount';
import { find } from 'lodash';

/**
 * Resolvers
 * 
 * TODO align this with the schema queries
 * TODO: respect the selected account from the cache
 */
export const usePolkadotJsExtensionAccountsQueryResolver = () => useDedupeResolver(
    // throw in a `useResolver` name for the function, in order to satisfy the rule of hooks
    function useResolver() {
        const [state, setState] = useState<PolkadotJsExtensionAccount[]>([]);
        const { getPolkadotExtensionAccounts, polkadotExtensionAccounts } = useGetPolkadotExtensionAccounts();
        const [activePolkadotJsAccount] = usePersistActivePolkadotJsAccount();
        
        useEffect(() => {
            setState(polkadotExtensionAccounts);
        }, [polkadotExtensionAccounts, activePolkadotJsAccount]);

        const resolver: Resolver = async () => await getPolkadotExtensionAccounts()

        return { resolver, state };
    }
);

export const usePolkadotJsExtensionAccountsQueryResolvers = () => ({
    polkadotExtensionAccounts: usePolkadotJsExtensionAccountsQueryResolver()
});

/** 
 * Queries for retrieving available accounts in the PolkadotJS extension
 */
export const GET_POLKADOT_EXTENSION_ACCOUNTS = gql`
    query GetPolkadotExtensionAccounts {
        # fetch polkadotExtension to trigger the resolver which connects
        # to the extension first
        polkadotExtension @client {
            isAvailable
        },

        polkadotExtensionAccounts @client  {
            id,
            alias,
            network,
            isSelected,
            address
        }
    }
`;

export interface GetPolkadotExtensionAccountsQueryResponse {
    polkadotExtensionAccounts: PolkadotJsExtensionAccount[]
};

export const useGetPolkadotJsExtensionAccountsLazyQuery = (options?: LazyQueryHookOptions) => (
    useLazyQuery<GetPolkadotExtensionAccountsQueryResponse & GetPolkadotExtensionQueryResponse>(
        GET_POLKADOT_EXTENSION_ACCOUNTS,
        options
    )
);

/**
 * Contextual queries
 */
export const contextualLazyQuery = <TData, TArgs>(queryHook: () => QueryTuple<TData, TArgs>) => constate(queryHook);

/**
 * this acts as 'a service' sharing the query between components that want to use it
 * this is important in order for the components to share the loading status, not only the data from the apollo cache
 */
export const [LazyPolkadotJsExtensionAccountsProvider, useContextualPolkadotJsExtensionAccountsLazyQuery] = contextualLazyQuery(() => {
    return useGetPolkadotJsExtensionAccountsLazyQuery({
        // fetchPolicy: 'no-cache',
        // TODO: shall we make this a default for all our queries for consistency?
        notifyOnNetworkStatusChange: true,
    });
});

export type PartialQueryTuple<TData, TVariables> = [
    (options?: QueryLazyOptions<TVariables>) => void,
    {
        data: TData | undefined
    }
]

export const useContextualGetActivePolkadotExtensionAccountLazyQuery: () => PartialQueryTuple<PolkadotJsExtensionAccount, any> = () => {
    const [fetch, { data }] = useContextualPolkadotJsExtensionAccountsLazyQuery();

    const activePolkadotJsAccount = useMemo(() => (
        find(data?.polkadotExtensionAccounts, { isSelected: true })
    ), [data?.polkadotExtensionAccounts])

    return [fetch, { data: activePolkadotJsAccount }]
}