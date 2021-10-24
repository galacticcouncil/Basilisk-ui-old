import { gql, useQuery, makeVar } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver } from '@apollo/client'
import {
    web3Accounts
  } from '@polkadot/extension-dapp';
import { GetPolkadotExtensionQueryResponse } from './usePolkadotJsExtension';

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

        polkadotExtensionAccounts @client {
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

export const useGetPolkadotExtensionAccountsQuery = () => (
    useQuery<GetPolkadotExtensionAccountsQueryResponse & GetPolkadotExtensionQueryResponse>(
        GET_POLKADOT_EXTENSION_ACCOUNTS,
    )
);

export const withIsQueryRunning = () => {
    const isQueryRunning = makeVar(false);

    return {
        isQueryRunning,
        beginQuery: () => isQueryRunning(true),
        endQuery: () => isQueryRunning(false)
    }
}

/**
 * Helper to prevent simultaneous/duplicate execution of the given query resolver
 */
export const dedupeResolver = (resolver: Resolver) => {
    const { isQueryRunning, beginQuery, endQuery } = withIsQueryRunning();
    return async () => {
        if (isQueryRunning()) return;
        beginQuery();
        const result = await resolver();
        endQuery();
        return result;
    }
}

/**
 * Apollo resolver for fetching all available accounts from the PolkadotJS extension
 */
export const usePolkadotExtensionAccountsResolver = () => {
    const resolver = useMemo(() => ({
        polkadotExtensionAccounts: dedupeResolver(async () => {
            const allAccounts = await web3Accounts();
            return allAccounts.map(account => ({
                address: account.address,
                alias: account.meta.name,
                // TODO: transform into account network
                network: account.meta.genesisHash,
                isSelected: false,
            }));
        })
    }), []);

    return resolver;
}