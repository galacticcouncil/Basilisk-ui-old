import { NetworkStatus, useApolloClient } from '@apollo/client';
import classNames from 'classnames';
import { find, uniq, last } from 'lodash';
import moment from 'moment';
import { usePageVisibility } from 'react-page-visibility';
import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { TradeForm } from '../../components/Trade/TradeForm/TradeForm';
import { AssetIds, Balance, Pool, TradeType } from '../../generated/graphql';
import { readActiveAccount } from '../../hooks/accounts/lib/readActiveAccount';
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery';
import { useGetHistoricalBalancesQuery } from '../../hooks/balances/queries/useGetHistoricalBalancesQuery';
import { useMath } from '../../hooks/math/useMath';
import { useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation';
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery';
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl';
import { Line } from 'react-chartjs-2';
import { fromPrecision12 } from '../../hooks/math/useFromPrecision';
import { TradeChart as TradeChartComponent } from '../../components/Chart/TradeChart/TradeChart';
import './TradePage.scss';
import {
  ChartGranularity,
  ChartType,
  PoolType,
} from '../../components/Chart/shared';
import BigNumber from 'bignumber.js';
import { useLoading } from '../../hooks/misc/useLoading';
import { useGetPoolsQuery } from '../../hooks/pools/queries/useGetPoolsQuery';

import KSM from '../../misc/icons/assets/KSM.svg';
import BSX from '../../misc/icons/assets/BSX.svg';
import DAI from '../../misc/icons/assets/DAI.svg';
import Unknown from '../../misc/icons/assets/Unknown.svg';

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances';
import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';
import { horizontalBar } from '../../components/Chart/ChartHeader/ChartHeader';

export interface TradeAssetIds {
  assetIn: string | null;
  assetOut: string | null;
}

export interface TradeChartProps {
  pool?: Pool;
  isPoolLoading?: boolean;
  assetIds: TradeAssetIds;
  spotPrice?: {
    outIn?: string;
    inOut?: string;
  };
}

// TODO EXTRACT
export const idToAsset = (id: string | null) => {
  const assetMetadata: Record<string, any> = {
    '0': {
      id: '0',
      symbol: 'BSX',
      fullName: 'Basilisk',
      icon: BSX,
    },
    '1': {
      id: '1',
      symbol: 'KSM',
      fullName: 'Kusama',
      icon: KSM,
    },
    '2': {
      id: '2',
      symbol: 'aUSD',
      fullName: 'Acala USD',
      icon: Unknown,
    },
    '3': {
      id: '3',
      symbol: 'LP BSX/KSM',
      fullName: 'BSX/KSM Share token',
      icon: DAI,
    },
  };

  return assetMetadata[id!] as any || id && {
    id,
    symbol: horizontalBar,
    fullName: `Unknown asset ${id}`,
    icon: Unknown
  };
};

export const TradeChart = ({
  pool,
  assetIds,
  spotPrice,
  isPoolLoading,
}: TradeChartProps) => {
  const isVisible = usePageVisibility();
  const [historicalBalancesRange, setHistoricalBalancesRange] = useState({
    from: moment().subtract(1, 'days').toISOString(),
    to: moment().toISOString(),
  }); 
  const { math } = useMath();
  const {
    data: historicalBalancesData,
    networkStatus: historicalBalancesNetworkStatus,
  } = useGetHistoricalBalancesQuery(
    {
      ...historicalBalancesRange,
      quantity: 100,
      // defaulting to an empty string like this is bad, if we want to use skip we should type the variables differently
      poolId: pool?.id || '',
    },
    {
      skip: !pool?.id,
    }
  );

  const historicalBalancesLoading = useMemo(
    () =>
      historicalBalancesNetworkStatus === NetworkStatus.loading ||
      historicalBalancesNetworkStatus === NetworkStatus.setVariables,
    [historicalBalancesNetworkStatus]
  );

  const [dataset, setDataset] = useState<Array<any>>();
  const [datasetLoading, setDatasetLoading] = useState(true);
  const [datasetRefreshing, setDatasetRefreshing] = useState(false);

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  useEffect(() => {
    setDatasetLoading(true);

    if (historicalBalancesLoading) return;

    if (
      (!historicalBalancesLoading &&
        !historicalBalancesData?.historicalBalances?.length) ||
      !math ||
      !spotPrice
    ) {
      setDataset([]);
      setDatasetLoading(false);
      return;
    }
    const dataset =
      historicalBalancesData?.historicalBalances.map(
        ({ createdAt, assetABalance, assetBBalance }) => {
          return {
            // x: `${moment(createdAt).getTime()}`,
            x: new Date(createdAt).getTime(),
            ...(() => {
              const assetOutLiquidity =
                assetIds.assetOut === historicalBalancesData.XYKPool.assetAId
                  ? assetABalance
                  : assetBBalance;

              const assetInLiquidity =
                assetIds.assetIn === historicalBalancesData.XYKPool.assetAId
                  ? assetABalance
                  : assetBBalance;

              const spotPrice = {
                outIn: math.xyk.get_spot_price(
                  assetOutLiquidity,
                  assetInLiquidity,
                  '1000000000000'
                ),
                inOut: math.xyk.get_spot_price(
                  assetInLiquidity,
                  assetOutLiquidity,
                  '1000000000000'
                ),
              };

              const y = new BigNumber(fromPrecision12(spotPrice.inOut) || '');

              return {
                y: y.toNumber(),
                yAsString: fromPrecision12(spotPrice.inOut),
              };
            })(),
          };
        }
      ) || [];

    dataset.push({
      // TODO: pretending this is now, should use the time from the lastBlock instead
      x: new Date().getTime(),
      y: new BigNumber(fromPrecision12(spotPrice.inOut) || '').toNumber(),
      yAsString: fromPrecision12(spotPrice.inOut),
    });

    setDataset(dataset);
    setDatasetRefreshing(false);
    setDatasetLoading(false);
  }, [
    historicalBalancesData?.historicalBalances,
    historicalBalancesLoading,
    math,
    spotPrice,
    assetIds,
  ]);

  useEffect(() => {
    const lastRecordOutdatedBy = 60000;

    if (
      !isVisible ||
      historicalBalancesLoading ||
      datasetRefreshing
    )
      return;

    const refetchHistoricalBalancesData = () => {
      if (
        isVisible && !historicalBalancesLoading && !datasetRefreshing &&
        (!dataset?.length || last(dataset).x <= new Date().getTime() - lastRecordOutdatedBy)
      ) {
        setDatasetRefreshing(true);
        setHistoricalBalancesRange({
          from: moment().subtract(1, 'days').toISOString(),
          to: moment().toISOString(),
        });
      }
    };

    refetchHistoricalBalancesData();

    const refetchData = setInterval(() => {
      refetchHistoricalBalancesData();
    }, lastRecordOutdatedBy)

    return () => clearInterval(refetchData)
  }, [
    dataset,
    isVisible,
    historicalBalancesLoading,
    datasetRefreshing,
  ]);

  // useEffect(() => {
  //   setDataset(dataset => {
  //     if (!spotPrice || !dataset) return dataset;

  //     return [
  //       ...dataset,
  //       {
  //         // TODO: pretending this is now, should use the time from the lastBlock instead
  //         x: moment().toISOString(),
  //         y: fromPrecision12(spotPrice.outIn)
  //       }
  //     ]
  //   })
  // }, [pool, spotPrice,])

  const _isPoolLoading = useMemo(() => {
    if (!isPoolLoading || datasetRefreshing) return false;

    return isPoolLoading || historicalBalancesLoading || datasetLoading;
  }, [
    datasetRefreshing,
    datasetLoading,
    isPoolLoading,
    historicalBalancesLoading,
  ]);

  return (
    <TradeChartComponent
      assetPair={{
        assetA: idToAsset(assetIds.assetIn),
        assetB: idToAsset(assetIds.assetOut),
      }}
      isPoolLoading={_isPoolLoading}
      poolType={PoolType.XYK}
      granularity={ChartGranularity.H24}
      chartType={ChartType.PRICE}
      primaryDataset={dataset as any}
      onChartTypeChange={() => {}}
      onGranularityChange={() => {}}
    />
  );
};

export const TradePage = () => {
  // taking assetIn/assetOut from search params / query url
  const [assetIds, setAssetIds] = useAssetIdsWithUrl();
  const { data: activeAccountData } = useGetActiveAccountQuery({
    fetchPolicy: 'cache-only',
  });
  const { math } = useMath();
  // progress, not broadcast because we dont wait for broadcast to happen here
  const [notification, setNotification] = useState<
    'standby' | 'pending' | 'success' | 'failed'
  >('standby');

  const depsLoading = useLoading();
  const {
    data: poolData,
    loading: poolLoading,
    networkStatus: poolNetworkStatus,
  } = useGetPoolByAssetsQuery(
    {
      assetInId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetIn
          : assetIds.assetOut) || undefined,
      assetOutId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetOut
          : assetIds.assetIn) || undefined,
    },
    depsLoading
  );

  const {
    data: poolsData,
    networkStatus: poolsNetworkStatus,
  } = useGetPoolsQuery({
    skip: depsLoading,
  });

  const assets = useMemo(() => {
    const assets = poolsData?.pools
      ?.map((pool) => {
        return [pool.assetInId, pool.assetOutId];
      })
      .reduce((assets, poolAssets) => {
        return assets.concat(poolAssets);
      }, [])
      .map((id) => id);

    return uniq(assets).map((id) => ({ id }));
  }, [poolsData]);

  const pool = useMemo(() => poolData?.pool, [poolData]);

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount;
  }, [activeAccountData]);

  const clearNotificationIntervalRef = useRef<any>();

  const {
    mutation: [
      submitTrade,
      { loading: tradeLoading, error: tradeError },
    ],
    confirmationScreen
  } = useWithConfirmation(
    useSubmitTradeMutation({
      onCompleted: () => {
        setNotification('success');
        clearNotificationIntervalRef.current = setTimeout(() => {
          setNotification('standby');
        }, 4000);
      },
      onError: () => {
        setNotification('failed');
        clearNotificationIntervalRef.current = setTimeout(() => {
          setNotification('standby');
        }, 4000);
      },
    }),
    ConfirmationType.Trade
  );

  useEffect(() => {
    if (tradeLoading) setNotification('pending');
  }, [tradeLoading]);

  const handleSubmitTrade = useCallback(
    (variables) => {
      clearNotificationIntervalRef.current &&
        clearTimeout(clearNotificationIntervalRef.current);
      clearNotificationIntervalRef.current = null;
      submitTrade({ variables });
    },
    [submitTrade]
  );

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  const spotPrice = useMemo(() => {
    if (!assetOutLiquidity || !assetInLiquidity || !math) return;
    return {
      outIn: math.xyk.get_spot_price(
        assetOutLiquidity,
        assetInLiquidity,
        '1000000000000'
      ),
      inOut: math.xyk.get_spot_price(
        assetInLiquidity,
        assetOutLiquidity,
        '1000000000000'
      ),
    };
  }, [assetOutLiquidity, assetInLiquidity, math]);

  const {
    data: activeAccountTradeBalancesData,
    networkStatus: activeAccountTradeBalancesNetworkStatus,
  } = useGetActiveAccountTradeBalances({
    variables: {
      assetInId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetIn
          : assetIds.assetOut) || undefined,
      assetOutId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetOut
          : assetIds.assetIn) || undefined,
    },
  });

  const tradeBalances = useMemo(() => {
    const balances = activeAccountTradeBalancesData?.activeAccount?.balances;

    const outBalance = find(balances, {
      assetId: assetIds.assetOut,
    }) as Balance | undefined;

    const inBalance = find(balances, {
      assetId: assetIds.assetIn,
    }) as Balance | undefined;

    return { outBalance, inBalance };
  }, [activeAccountTradeBalancesData, assetIds]);

  return (
    <div className="trade-page-wrapper">
      {confirmationScreen}
      <div className={'notifications-bar transaction-' + notification}>
        <div className="notification">transaction {notification}</div>
      </div>
      <div className="trade-page">
        {/* <TradeChart
          pool={pool}
          assetIds={assetIds}
          spotPrice={spotPrice}
          isPoolLoading={
            poolNetworkStatus === NetworkStatus.loading ||
            poolNetworkStatus === NetworkStatus.setVariables ||
            depsLoading
          }
        /> */}
        <TradeForm
          assetIds={assetIds}
          onAssetIdsChange={(assetIds) => setAssetIds(assetIds)}
          isActiveAccountConnected={isActiveAccountConnected}
          pool={pool}
          // first load and each time the asset ids (variables) change
          isPoolLoading={
            poolNetworkStatus === NetworkStatus.loading ||
            poolNetworkStatus === NetworkStatus.setVariables ||
            depsLoading
          }
          assetInLiquidity={assetInLiquidity}
          assetOutLiquidity={assetOutLiquidity}
          spotPrice={spotPrice}
          onSubmitTrade={handleSubmitTrade}
          tradeLoading={tradeLoading}
          assets={assets}
          activeAccount={activeAccountData?.activeAccount}
          activeAccountTradeBalances={tradeBalances}
          activeAccountTradeBalancesLoading={
            activeAccountTradeBalancesNetworkStatus === NetworkStatus.loading ||
            activeAccountTradeBalancesNetworkStatus ===
              NetworkStatus.setVariables ||
            depsLoading
          }
        />
        <div className="debug">
          <h3>[Trade Page] Debug Box</h3>
          <p>Trade loading: {tradeLoading ? 'true' : 'false'}</p>
          {/* <p>Trade error: {tradeError ? tradeError : '-'}</p> */}
        </div>
      </div>
    </div>
  );
};
