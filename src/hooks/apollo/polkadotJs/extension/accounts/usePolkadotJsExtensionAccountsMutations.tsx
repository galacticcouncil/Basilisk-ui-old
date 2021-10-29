import { gql, ApolloCache, NormalizedCacheObject, useMutation } from '@apollo/client';
import { MutationSetActivePolkadotJsExtensionAccountArgs, PolkadotJsExtensionAccount } from '../../../../../generated/graphql';
import { Resolver } from '@apollo/client'
import { useCallback } from 'react';
import { useSetActivePolkadotJsExtensionAccount } from '../../../../polkadotJs/extension/accounts/useSetActivePolkadotJsExtensionAccounts';
import { useUnsetActivePolkadotJsExtensionAccount } from '../../../../polkadotJs/extension/accounts/useUnsetActivePolkadotJsExtensionAccount';

/**
 * Resolvers
 */
// TODO: create a resolver with cache context type
export const useSetActivePolkadotJsExtensionAccountResolver = () => {
    const setActivePolkadotJsExtensionAccount = useSetActivePolkadotJsExtensionAccount();
    const resolver: Resolver = useCallback((
        _obj,
        args: MutationSetActivePolkadotJsExtensionAccountArgs,
        { cache }: { cache: ApolloCache<object> }
    ) => setActivePolkadotJsExtensionAccount(args.id, cache), []);

    return resolver;
}

export const useUnsetActivePolkadotJsExtensionAccountResolver = () => {
    const unsetActivePolkadotJsExtensionAccount = useUnsetActivePolkadotJsExtensionAccount();
    const resolver: Resolver = useCallback((
        _obj,
        _args,
        { cache }: { cache: ApolloCache<NormalizedCacheObject> }
    ) => unsetActivePolkadotJsExtensionAccount(cache), []);

    return resolver;
}

export const usePolkadotJsExtensionAccountsMutationResolvers = () => ({
    setActivePolkadotJsExtensionAccount: useSetActivePolkadotJsExtensionAccountResolver(),
    unsetActivePolkadotJsExtensionAccount: useUnsetActivePolkadotJsExtensionAccountResolver()
})

/**
 * Mutations
 */
export const SET_ACTIVE_POLKADOT_EXTENSION_ACCOUNT = gql`
    mutation SetActivePolkadotJsExtensionAccount($id: ID!) {
        setActivePolkadotJsExtensionAccount(id: $id) @client
    }
`

export const UNSET_ACTIVE_POLKADOT_EXTENSION_ACCOUNT = gql`
    mutation UnsetActivePolkadotJsExtensionAccount {
        unsetActivePolkadotJsExtensionAccount @client
    }
`

export const useSetActivePolkadotExtensionAccountMutation = (args: MutationSetActivePolkadotJsExtensionAccountArgs) => (
    useMutation(
        SET_ACTIVE_POLKADOT_EXTENSION_ACCOUNT,
        {
            // TODO: this api is a bit inconsistent, args vs variables
            variables: args
        }
    )
);

export const useUnsetActivePolkadotExtensionAccountMutation = () => (
    useMutation(
        UNSET_ACTIVE_POLKADOT_EXTENSION_ACCOUNT
    )
);