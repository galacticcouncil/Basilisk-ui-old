import { NetworkStatus, useApolloClient } from '@apollo/client';
import classNames from 'classnames';
import { find } from 'lodash';
import moment from 'moment';
import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
  useMemo,
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
import { ChartGranularity, ChartType, PoolType } from '../../components/Chart/shared';
import BigNumber from 'bignumber.js';

export interface TradeAssetIds {
  assetIn: string | null;
  assetOut: string | null;
}

export interface TradeChartProps {
  pool?: Pool;
  assetIds: TradeAssetIds;
  spotPrice?: {
    outIn?: string;
    inOut?: string;
  };
}

export const TradeChart = ({ pool, assetIds, spotPrice }: TradeChartProps) => {
  const { math } = useMath();
  const { data: historicalBalancesData } = useGetHistoricalBalancesQuery(
    {
      from: useMemo(() => moment().subtract(1, 'days').toISOString(), []),
      to: useMemo(() => moment().toISOString(), []),
      quantity: 100,
      // defaulting to an empty string like this is bad, if we want to use skip we should type the variables differently
      poolId: pool?.id || '',
    },
    {
      skip: !pool?.id,
    }
  );

  const [dataset, setDataset] = useState<Array<any>>();

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined;
    return find<Balance | null>(pool?.balances, { assetId })?.balance;
  }, [pool, assetIds]);

  useEffect(() => {
    if (!historicalBalancesData?.historicalBalances || !math || !spotPrice)
      return setDataset([]);
    const dataset = historicalBalancesData.historicalBalances.map(
      ({ createdAt, assetABalance, assetBBalance }) => {
        return {
          // x: `${moment(createdAt).getTime()}`,
          x: new Date(createdAt).getTime(),
          y: (() => {
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

            return parseFloat(new BigNumber(fromPrecision12(spotPrice.outIn) || '').toFixed(3))
          })(),
        };
      }
    );

    dataset.push({
      // TODO: pretending this is now, should use the time from the lastBlock instead
      x: new Date().getTime(),
      y: parseFloat(new BigNumber(fromPrecision12(spotPrice.outIn) || '').toFixed(3)),
    });

    setDataset(dataset);
  }, [historicalBalancesData?.historicalBalances, math, spotPrice, assetIds]);

  // useEffect(() => {
  //   setDataset(dataset => {
  //     if (!spotPrice || !dataset) return dataset;

  //     console.log('spot price changed, updating dataset', spotPrice.outIn);

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

  console.log('dataset', dataset);

  return (
    <div className="trade-chart">
      {/* <p>
        {assetIds.assetOut}/{assetIds.assetIn}
      </p>
      <p>{fromPrecision12(spotPrice?.outIn)}</p>
      <Line
        data={{
          datasets: [
            {
              label: 'spot price',
              data: dataset,
            },
          ],
        }}
      /> */}
      <TradeChartComponent 
        assetPair={{
          assetA: {
            symbol: assetIds.assetOut || undefined,
            fullName: assetIds.assetOut || undefined
          },
          assetB: {
            symbol: assetIds.assetIn || undefined,
            fullName: assetIds.assetIn || undefined
          },
        }}
        poolType={PoolType.XYK}
        granularity={ChartGranularity.H24}
        chartType={ChartType.PRICE}
        primaryDataset={dataset as any}
        onChartTypeChange={() => {}}
        onGranularityChange={() => {}}
      />

    </div>
  );
};

export const TradePage = () => {
  // taking assetIn/assetOut from search params / query url
  const [assetIds, setAssetIds] = useAssetIdsWithUrl();
  const { data: activeAccountData } = useGetActiveAccountQuery({
    fetchPolicy: 'cache-only',
  });
  const { math } = useMath();

  const { data: poolData, loading: poolLoading, networkStatus: poolNetworkStatus } = useGetPoolByAssetsQuery({
    assetInId: assetIds.assetIn || undefined,
    assetOutId: assetIds.assetOut || undefined,
  });

  const pool = useMemo(() => poolData?.pool, [poolData]);

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount;
  }, [activeAccountData]);

  const [submitTrade, { loading, error }] = useSubmitTradeMutation();

  const handleSubmitTrade = useCallback(
    (variables) => {
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

  console.log('network status pool', poolLoading, poolNetworkStatus);

  return (
    <div className="trade-page">
      <TradeChart pool={pool} assetIds={assetIds} spotPrice={spotPrice} />
      <TradeForm
        assetIds={assetIds}
        onAssetIdsChange={(assetIds) => setAssetIds(assetIds)}
        isActiveAccountConnected={isActiveAccountConnected}
        pool={pool}
        // first load and each time the asset ids (variables) change
        isPoolLoading={(poolNetworkStatus === NetworkStatus.loading) || poolNetworkStatus === NetworkStatus.setVariables}
        assetInLiquidity={assetInLiquidity}
        assetOutLiquidity={assetOutLiquidity}
        spotPrice={spotPrice}
        onSubmitTrade={handleSubmitTrade}
      />

      <div className="debug">
        <h3>[Trade Page] Debug Box</h3>
        <p>Trade loading: {loading ? 'true' : 'false'}</p>
        <p>Trade error: {error ? error : '-'}</p>
      </div>
    </div>


  );
};
