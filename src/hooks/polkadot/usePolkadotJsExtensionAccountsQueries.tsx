import { gql, useQuery, makeVar, useLazyQuery } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver, LazyQueryHookOptions, QueryHookOptions, useApolloClient } from '@apollo/client'
import {
    web3Accounts
} from '@polkadot/extension-dapp';
import { GetPolkadotExtensionQueryResponse } from './usePolkadotJsExtensionQueries';
import { dedupeResolver } from '../apollo/dedupeResolver';
import { useCallback } from 'react';


export const resolver = async () => {
    const allAccounts = await web3Accounts();
    await new Promise(resolve => setTimeout(resolve, 4000));
    return allAccounts.map(account => ({
        id: account.address,
        address: account.address,
        alias: account.meta.name,
        // TODO: transform into account network
        network: account.meta.genesisHash,
        isSelected: false,
    }));
};

export const { dedupedResolver } = dedupeResolver(resolver);

/**
 * Apollo resolver for fetching all available accounts from the PolkadotJS extension
 */
export const usePolkadotExtensionAccountsResolver = () => ({
    polkadotExtensionAccounts: dedupedResolver
})

/**
 * Query for retrieving available accounts in the PolkadotJS extension
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

export const useGetPolkadotExtensionAccountsQuery = (options?: QueryHookOptions) => (
    useQuery<GetPolkadotExtensionAccountsQueryResponse & GetPolkadotExtensionQueryResponse>(
        GET_POLKADOT_EXTENSION_ACCOUNTS,
        options
    )
);

export const useGetPolkadotExtensionAccountsLazyQuery = (options?: LazyQueryHookOptions) => (
    useLazyQuery<GetPolkadotExtensionAccountsQueryResponse & GetPolkadotExtensionQueryResponse>(
        GET_POLKADOT_EXTENSION_ACCOUNTS,
        options
    )
);

/**
 * Evict the account with the given ID from the Apollo cache
 * 
 * TODO: figure out how to use client.cache.evict instead
 * @param id 
 */
export const useEvictPolkadotExtensionAccount = () => {
    const client = useApolloClient();

    return useCallback((id: string) => {
        // get current cache data
        const data = client.cache.readQuery<GetPolkadotExtensionAccountsQueryResponse>({
            query: GET_POLKADOT_EXTENSION_ACCOUNTS
        });

        // filter out the evicted entity
        const polkadotExtensionAccounts = data?.polkadotExtensionAccounts
            .filter(entity => entity.id !== id)

        // update the cache, removing the evicted entity
        client.cache.writeQuery({
            query: GET_POLKADOT_EXTENSION_ACCOUNTS,
            data: {
                ...data,
                polkadotExtensionAccounts
            }
        })
    }, [client])
}