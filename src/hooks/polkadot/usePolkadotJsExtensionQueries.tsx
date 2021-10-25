import { gql, useQuery, makeVar, useApolloClient } from '@apollo/client';
import { PolkadotJsExtension, PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver } from '@apollo/client'
import {
    web3Accounts,
    web3Enable,
} from '@polkadot/extension-dapp';
import { dedupeResolver } from '../apollo/dedupeResolver';
import { useCallback } from 'react';
import { GetPolkadotExtensionAccountsQueryResponse } from './usePolkadotJsExtensionAccountsQueries';

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

export const resolver = async () => {
    const extensions = await web3Enable('basilisk-ui');
    return {
        isAvailable: extensions.length > 0
    }
};

export const { dedupedResolver } = dedupeResolver(resolver);

/**
 * Apollo resolver that checks if a PolkadotJs extension is available/installed
 * TODO: provide a standalone query for the extension availability
 */
export const usePolkadotJsExtensionResolver = () => ({
    polkadotExtension: dedupedResolver
})