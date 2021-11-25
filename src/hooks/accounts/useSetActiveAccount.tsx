import { ApolloCache, ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { gql } from 'graphql.macro';
import { find } from 'lodash';
import { useCallback } from 'react';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './queries/useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';

export const useSetActiveAccount = () => {
    const [_persistedActiveAccount, setPersistedActiveAccount] = usePersistActiveAccount();

    return useCallback(async (
        client: ApolloClient<NormalizedCacheObject>,
        address: string | undefined
    ) => {
        const accountsData = client.cache?.readQuery<GetAccountsQueryResponse>({
            query: GET_ACCOUNTS,
        });

        console.log('accountsData', accountsData);

        if (!accountsData?.accounts) return;

        const accounts = accountsData.accounts
            .map(account => ({
                ...account,
                isActive: account.id === address ? true : false
            }))
        
        const activeAccount = find(accounts, { isActive: true });
        setPersistedActiveAccount({
            id: activeAccount?.id
        })
        
        // TODO: return the data to be mutated from the mutation instead
        // client.cache?.writeQuery<GetAccountsQueryResponse>({
        //     query: GET_ACCOUNTS,
        //     data: { accounts, lastBlock: accountsData.lastBlock }
        // });

        accounts.forEach(account => {
            client.cache.modify({
                id: client.cache.identify({
                    __typename: account.__typename,
                    id: account.id
                }),
                fields: {
                    isActive: _ => account.isActive
                }
            })
        });

        // wait for the local storage changes before finishing the mutation
        // TODO: find a better way to wait until the local storage changes are
        // propagated to the resolverRef
        await (new Promise(resolve => setTimeout(resolve, 0)));

        return accounts;
    }, [ 
        setPersistedActiveAccount
    ])
}