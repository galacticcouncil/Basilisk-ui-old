import { Config, useConfig } from './useConfig';
import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

/**
 * Query for fetching the config through Apollo
 */
export const GET_CONFIG = gql`
    query GetConfig {
        config @client {
            processorUrl,
            nodeUrl
        }
    }
`;

export interface GetConfigQueryResponse {
    config: Config
}

export const useGetConfigQuery = () => useQuery<GetConfigQueryResponse>(GET_CONFIG, {
    // never cache the config, always go and get it from the resolver
    fetchPolicy: 'no-cache'
});

/**
 * Apollo resolver observing the reactive config var,
 * always returning the latest config (mirroring local storage)
 */
export const useConfigQueryResolver = () => {
    const { config } = useConfig();
    const resolver = useMemo(() => ({
        config: () => config
    }), [config])
    
    return resolver;
}