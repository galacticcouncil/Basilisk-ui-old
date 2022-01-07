import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';
import { MathProvider } from '../hooks/math/useMath';

export const ConfiguredApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = useConfigureApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
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
