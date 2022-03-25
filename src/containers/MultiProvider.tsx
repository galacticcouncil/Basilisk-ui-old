import { ApolloProvider } from '@apollo/client';
import React, { useMemo, useRef } from 'react';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';
import { MathProvider } from '../hooks/math/useMath';
import constate from 'constate';

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

export const useBodyContainerRef = () => {
  return useRef<HTMLDivElement>(null);
};

export const [BodyContainerRefProvider, useBodyContainerRefContext] = constate(useBodyContainerRef);

export const BodyContainer = ({ children }: { children: React.ReactNode }) => {
  const bodyContainerRef = useBodyContainerRefContext()
  return <div className='body-container' ref={bodyContainerRef}>{children}</div>
};

// const [BodyContainerProvider, useBodyContainerContext] = constate(useBodyContainer);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

// TODO: use react-multi-provider instead of ugly nesting
export const MultiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BodyContainerRefProvider>
      <BodyContainer>
        <PolkadotJsProvider>
          <MathProvider>
            <LastBlockProvider>
              <ConfiguredApolloProvider>
                <QueryProvider>{children}</QueryProvider>
              </ConfiguredApolloProvider>
            </LastBlockProvider>
          </MathProvider>
        </PolkadotJsProvider>
      </BodyContainer>
    </BodyContainerRefProvider>
  );
};
