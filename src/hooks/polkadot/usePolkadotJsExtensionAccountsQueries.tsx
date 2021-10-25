import { gql, useQuery, makeVar, useLazyQuery } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver, LazyQueryHookOptions, QueryHookOptions, useReactiveVar, QueryResult } from '@apollo/client'
import {
    web3Accounts
  } from '@polkadot/extension-dapp';
import { GetPolkadotExtensionQueryResponse } from './usePolkadotJsExtensionQueries';
import { dedupeResolver } from '../apollo/dedupeResolver';


export const { dedupedResolver } = dedupeResolver(async () => {
    const allAccounts = await web3Accounts();
    await new Promise(resolve => setTimeout(resolve, 4000));
    return allAccounts.map(account => ({
        address: account.address,
        alias: account.meta.name,
        // TODO: transform into account network
        network: account.meta.genesisHash,
        isSelected: false,
    }));
});


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