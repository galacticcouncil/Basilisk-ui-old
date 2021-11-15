import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { find } from 'lodash';
import { useCallback } from 'react';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
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

        if (!accountsData?.accounts) return;

        const accounts = accountsData.accounts
            .map(account => ({
                ...account,
                isActive: account.id === address ? true : false
            }));
        
        const activeAccount = find(accounts, { isActive: true });
        activeAccount
            ? setPersistedActiveAccount({
                id: activeAccount.id
            })
            : setPersistedActiveAccount(undefined)
        
        //TODO: return the data to be mutated from the mutation instead
        client.cache?.writeQuery<GetAccountsQueryResponse>({
            query: GET_ACCOUNTS,
            data: { accounts, lastBlock: accountsData.lastBlock }
        });

        // wait for the local storage changes before finishing the mutation
        // TODO: find a better way to wait until the local storage changes are
        // propagated to the resolverRef
        await (new Promise(resolve => setTimeout(resolve, 0)));
    }, [ 
        setPersistedActiveAccount
    ])
}