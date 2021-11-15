import { ApolloCache, ApolloClient, NormalizedCacheObject, Resolver } from '@apollo/client'
import { find } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';
import { SetActiveAccountMutationVariables } from './useSetActiveAccountMutation'
import log from 'loglevel';
import { useSetActiveAccount } from './useSetActiveAccount';
import { useSet } from 'react-use';

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
    const setActiveAccount = useSetActiveAccount();
    const setActiveAccountResolver: Resolver = useResolverToRef(
        useCallback(async (
            _obj,
            args: SetActiveAccountMutationVariables,
            { client }: { client: ApolloClient<NormalizedCacheObject> }
        ) => setActiveAccount(client, args.id), [setActiveAccount]),
        'setActiveAccount'
    )

    return {
        setActiveAccount: setActiveAccountResolver
    }
}