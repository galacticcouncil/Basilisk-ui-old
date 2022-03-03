import { NetworkStatus, useApolloClient } from '@apollo/client';
import classNames from 'classnames';
import { find, uniq } from 'lodash';
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
import {
  ChartGranularity,
  ChartType,
  PoolType,
} from '../../components/Chart/shared';
import BigNumber from 'bignumber.js';
import { useLoading } from '../../hooks/misc/useLoading';
import { useGetPoolsQuery } from '../../hooks/pools/queries/useGetPoolsQuery';

import BSX from '../../misc/icons/assets/BSX.svg';
import Unknown from '../../misc/icons/assets/Unknown.svg';

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances';

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

// TODO EXTRACT
export const idToAsset = (id: string | null) => {
  const assetMetadata: Record<string, any> = {
    '0': {
      symbol: 'BSX',
      fullName: 'Basilisk',
      icon: BSX,
    },
    '1': {
      symbol: 'USDC',
      fullName: 'USD Coin',
      icon: Unknown,
    },
    '2': {
      symbol: 'kUSD',
      fullName: 'Karura USD',
      icon: Unknown,
    },
    '3': {
      symbol: 'DAI',
      fullName: 'DAI Stablecoin',
      icon: Unknown,
    },
  };

  return assetMetadata[id!] as any;
};

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

            return new BigNumber(fromPrecision12(spotPrice.outIn) || '').toNumber()
          })(),
          yAsString: fromPrecision12(spotPrice.outIn)
        };
      }
    );

    dataset.push({
      // TODO: pretending this is now, should use the time from the lastBlock instead
      x: new Date().getTime(),
      y: new BigNumber(fromPrecision12(spotPrice.outIn) || '').toNumber(),
      yAsString: fromPrecision12(spotPrice.outIn)
    });

    console.log(dataset);
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
    <TradeChartComponent
      assetPair={{
        assetA: idToAsset(assetIds.assetOut),
        assetB: idToAsset(assetIds.assetIn),
      }}
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

  const depsLoading = useLoading();
  const {
    data: poolData,
    loading: poolLoading,
    networkStatus: poolNetworkStatus,
  } = useGetPoolByAssetsQuery(
    {
      assetInId: assetIds.assetIn || undefined,
      assetOutId: assetIds.assetOut || undefined,
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

  console.log('assets', assets);

  console.log('network status pool deps', depsLoading);

  const pool = useMemo(() => poolData?.pool, [poolData]);

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount;
  }, [activeAccountData]);

  const [
    submitTrade,
    { loading: tradeLoading, error: tradeError },
  ] = useSubmitTradeMutation();

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

  const {
    data: activeAccountTradeBalancesData,
    networkStatus: activeAccountTradeBalancesNetworkStatus,
  } = useGetActiveAccountTradeBalances({
    variables: {
      assetInId: assetIds.assetIn || undefined,
      assetOutId: assetIds.assetOut || undefined,
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
    <div className="trade-page">
      <TradeChart pool={pool} assetIds={assetIds} spotPrice={spotPrice} />
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
  );
};
