import { gql, useQuery, makeVar } from '@apollo/client';
import { PolkadotJsExtension, PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver } from '@apollo/client'
import {
    web3Accounts,
    web3Enable,
} from '@polkadot/extension-dapp';
import { dedupeResolver } from './usePolkadotJsExtensionAccountsQueries';

/**
 * Query for fetching the availability of the PolkadotJs extension
 */
export const GET_POLKADOT_EXTENSION = gql`
    query GetExtension {
        polkadotExtension @client {
            isAvailable
        }
    }
`

export interface GetPolkadotExtensionQueryResponse {
    polkadotExtension: PolkadotJsExtension
}

/**
 * Apollo resolver that checks if a PolkadotJs extension is available/installed
 * TODO: provide a standalone query for the extension availability
 */
export const usePolkadotJsExtensionResolver = () => {
    const resolver = useMemo(() => ({
        polkadotExtension: dedupeResolver(async () => {
            const extensions = await web3Enable('basilisk-ui');
            return {
                isAvailable: extensions.length > 0
            }
        })
    }), []);

    return resolver;
}