import { ApolloProvider, useApolloClient } from '@apollo/client';
import React from 'react';
import { GetActiveAccountQueryProvider } from '../hooks/accounts/useGetActiveAccountQuery';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockNumberProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { GetExtensionQueryProvider } from '../hooks/polkadotJs/useGetExtensionQuery';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';

export const ConfiguredApolloProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useConfigureApolloClient();
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
    <GetExtensionQueryProvider>
        {children}
    </GetExtensionQueryProvider>
)

// TODO: use react-multi-provider instead of ugly nesting
export const MultiProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <PolkadotJsProvider>
            <LastBlockNumberProvider>
                <ConfiguredApolloProvider>
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </ConfiguredApolloProvider>
            </LastBlockNumberProvider>
        </PolkadotJsProvider>

    )
}