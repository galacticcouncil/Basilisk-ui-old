import { ApolloCache, NormalizedCacheObject, Resolver } from '@apollo/client'
import { find } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';
import { SetActiveAccountMutationVariables } from './useSetActiveAccountMutation'
import log from 'loglevel';

export const useResolverToRef = (resolver: Resolver, name?: string) => {
    const resolverRef = useRef(resolver);
    useEffect(() => { resolverRef.current = resolver }, [resolver]);

    return function resolverFromRef() {
        // TODO is there a better way to debug resolvers? Since the function name
        // is not visible in the apollo error
        log.debug('Running resolver', name);
        return resolverRef.current.apply(undefined, arguments as any);
    }
}

export const useAccountsMutationResolvers = () => {
    const [_persistedActiveAccount, setPersistedActiveAccount] = usePersistActiveAccount();
    const setActiveAccount: Resolver = useResolverToRef(
        useCallback(async (
            _obj,
            args: SetActiveAccountMutationVariables,
            context?: { cache?: ApolloCache<NormalizedCacheObject> }
        ) => {
            const accountsData = context?.cache?.readQuery<GetAccountsQueryResponse>({
                query: GET_ACCOUNTS,
            });
    
            if (!accountsData?.accounts) return;
    
            const accounts = accountsData.accounts
                .map(account => ({
                    ...account,
                    isActive: account.id === args?.id ? true : false
                }));
            
            const activeAccount = find(accounts, { isActive: true });
            activeAccount
                ? setPersistedActiveAccount({
                    id: activeAccount.id
                })
                : setPersistedActiveAccount(undefined)
            
            context?.cache?.writeQuery<GetAccountsQueryResponse>({
                query: GET_ACCOUNTS,
                data: { accounts, lastBlock: accountsData.lastBlock }
            });

            // wait for the local storage changes before finishing the mutation
            // TODO: find a better way to wait until the local storage changes are
            // propagated to the resolverRef
            await (new Promise(resolve => setTimeout(resolve, 0)));
        }, [setPersistedActiveAccount]),
        'setActiveAccount'
    )

    return {
        setActiveAccount
    }
}