import { ApolloCache, ApolloClient, NormalizedCacheObject, Resolver } from '@apollo/client'
import { find } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { SetActiveAccountMutationVariables } from '../mutations/useSetActiveAccountMutation'
import log from 'loglevel';
import { useSetActiveAccount } from '../useSetActiveAccount';
import { useSetActiveAccountMutationResolver } from './useSetActiveAccountMutationResolver';

/**
 * Updates the resolver fn ref each time the given resolver fn changes.
 * 
 * This is necessary to reflect changes made to functions within hooks
 * within the Apollo resolvers configuration. 
 */
export const useResolverToRef = (resolver: Resolver, name?: string) => {
    const resolverRef = useRef(resolver);
    // when the resolver changes, update the ref
    useEffect(() => { resolverRef.current = resolver }, [resolver]);

    return function resolverFromRef() {
        // TODO is there a better way to debug resolvers? Since the function name
        // is not visible in the apollo error
        log.debug('Running resolver', name);
        // execute the wrapper resolver ref, with the given arguments from Apollo
        return resolverRef.current.apply(undefined, arguments as any);
    }
}

/**
 * Used to resolve mutations regarding the Account entity
 * @returns 
 */
export const useAccountsMutationResolvers = () => {
    const setActiveAccountMutationResolver = useSetActiveAccountMutationResolver();

    return {
        setActiveAccount: setActiveAccountMutationResolver
    }
}