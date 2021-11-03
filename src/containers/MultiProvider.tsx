import { ApolloProvider, useApolloClient } from '@apollo/client';
import React from 'react';
import { GetActiveAccountQueryProvider } from '../hooks/accounts/useGetActiveAccountQuery';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockNumberProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';

export const ConfiguredApolloProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useConfigureApolloClient();
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

// TODO: use react-multi-provider instead of ugly nesting
export const MultiProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <PolkadotJsProvider>
            <LastBlockNumberProvider>
                <ConfiguredApolloProvider>
                    {children}
                </ConfiguredApolloProvider>
            </LastBlockNumberProvider>
        </PolkadotJsProvider>

    )
}