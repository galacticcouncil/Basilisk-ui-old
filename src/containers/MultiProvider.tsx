import { ApolloProvider } from '@apollo/client';
import React, { useMemo } from 'react';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';
import { MathProvider } from '../hooks/math/useMath';
import { GetActiveAccountQueryProvider } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { GetExtensionQueryProvider } from '../hooks/extension/queries/useGetExtensionQuery';

export const ConfiguredApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = useConfigureApolloClient();
  return useMemo(
    () =>
      client ? (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      ) : (
        <></>
      ),
    [client, children]
  );
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <GetExtensionQueryProvider>
    <GetActiveAccountQueryProvider>
      <>{children}</>
    </GetActiveAccountQueryProvider>
  </GetExtensionQueryProvider>
);

// TODO: use react-multi-provider instead of ugly nesting
export const MultiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PolkadotJsProvider>
      <MathProvider>
        <LastBlockProvider>
          <ConfiguredApolloProvider>
            <QueryProvider>{children}</QueryProvider>
          </ConfiguredApolloProvider>
        </LastBlockProvider>
      </MathProvider>
    </PolkadotJsProvider>
  );
};
