import { ApolloProvider, useApolloClient } from '@apollo/client';
import React from 'react';
import { GetActiveAccountQueryProvider } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { GetExtensionQueryProvider } from '../hooks/polkadotJs/useGetExtensionQuery';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';
import { MathProvider } from '../hooks/math/useMath';

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
            <LastBlockProvider>
                <ConfiguredApolloProvider>
                    <QueryProvider>
                        <MathProvider>
                            {children}
                        </MathProvider>
                    </QueryProvider>
                </ConfiguredApolloProvider>
            </LastBlockProvider>
        </PolkadotJsProvider>

    )
}