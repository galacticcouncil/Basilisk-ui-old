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
import './PoolsPage.scss';
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
import { PoolsForm } from '../../components/Pools/PoolsForm';

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
      symbol: 'DAI',
      fullName: 'DAI Stablecoin',
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

export const PoolsPage = () => {
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
    <div className="pools-page-wrapper">
      {confirmationScreen}
      <div className={'notifications-bar transaction-' + notification}>
        <div className="notification">transaction {notification}</div>
      </div>
      <div className="pools-page">
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
        <PoolsForm
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
