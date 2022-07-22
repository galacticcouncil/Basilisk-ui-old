import { ApolloProvider } from '@apollo/client';
import React, { useCallback, useMemo, useRef } from 'react';
import { useConfigureApolloClient } from '../hooks/apollo/useApollo';
import { LastBlockProvider } from '../hooks/lastBlock/useSubscribeNewBlockNumber';
import { PolkadotJsProvider } from '../hooks/polkadotJs/usePolkadotJs';
import { MathProvider, useMath } from '../hooks/math/useMath';
import constate from 'constate';
import { GetActiveAccountQueryProvider, useGetActiveAccountQueryContext } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { GetExtensionQueryProvider } from '../hooks/extension/queries/useGetExtensionQuery';
import { useGetConfigQuery } from '../hooks/config/useGetConfigQuery';
import { useLoading } from '../hooks/misc/useLoading';
import { useGetPoolByAssetsQuery } from '../hooks/pools/queries/useGetPoolByAssetsQuery';
import BigNumber from 'bignumber.js';

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

export const useMultiFeePaymentConversion = () => {
  const { data: activeAccount } = useGetActiveAccountQueryContext()
  const { data } = useGetConfigQuery({
    skip: !activeAccount?.activeAccount?.id
  });

  const feePaymentAsset = useMemo(() => data?.config.feePaymentAsset, [data]);

  const depsLoading = useLoading();
  const {
    data: poolData,
    loading: poolLoading,
    networkStatus: poolNetworkStatus,
  } = useGetPoolByAssetsQuery(
    {
      assetInId: '0',
      assetOutId: feePaymentAsset || undefined,
    },
    !activeAccount?.activeAccount?.id
  );

  const { math } = useMath()

  const convertToFeePaymentAsset = useCallback((txFee?: string) => {
    console.log('convertToFeePaymentAsset', txFee, feePaymentAsset);
    if (!txFee || poolLoading || !math) return;
    if (feePaymentAsset === '0') return txFee;

    const liquidityAssetIn = poolData?.pool.balances?.find(balance => balance.assetId == '0')?.balance
    const liquidityAssetOut = poolData?.pool.balances?.find(balance => balance.assetId == feePaymentAsset)?.balance

    if (!liquidityAssetIn || !liquidityAssetOut) return;

    const spotPrice = math?.xyk.get_spot_price(
      liquidityAssetIn,
      liquidityAssetOut,
      '1000000000000'
    )

    if (!spotPrice) return;

    return new BigNumber(spotPrice)
      .dividedBy(
        new BigNumber(10).pow(12)
      )
      .multipliedBy(txFee)
      .toFixed(2)
  }, [poolData, poolLoading, feePaymentAsset, math]);

  return { convertToFeePaymentAsset, feePaymentAsset }
}

export const [MultiFeePaymentConversionProvider, useMultiFeePaymentConversionContext] = constate(useMultiFeePaymentConversion);


export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <GetExtensionQueryProvider>
    <GetActiveAccountQueryProvider>
      <MultiFeePaymentConversionProvider>
        <>{children}</>
      </MultiFeePaymentConversionProvider>
    </GetActiveAccountQueryProvider>
  </GetExtensionQueryProvider>
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
