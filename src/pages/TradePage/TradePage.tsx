import { find, isEqual } from 'lodash';
import { useMemo, useState } from 'react';
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery';
import {
  TradeForm,
  TradeFormProps,
} from '../../containers/TradeForm/TradeForm';
import { PoolLiquidity, TradeChart } from '../../containers/TradeChart';
import log from 'loglevel';
import { useSpotPrice } from './hooks/useSpotPrice';
import { Pool } from '../../generated/graphql';

export interface SpotPrice {
  aToB?: string;
  bToA?: string;
}

/**
 * Trade page responsible for fetching pool data
 * @returns
 */
export const TradePage = () => {
  // TODO default values here should come from the router where query args are parsed
  const [assetIds, setAssetIds] = useState<TradeFormProps['assetIds']>({
    assetInId: '0',
    assetOutId: '2',
  });

  // automatically fetch a pool by the given assets
  const {
    data: poolData,
    loading: poolLoading,
    error: poolError,
  } = useGetPoolByAssetsQuery(assetIds);
  log.debug('TradePage.useGetPoolByAssetsQuery', assetIds);

  const pool: Pool | undefined = useMemo(
    () => poolData?.pool,
    [poolData?.pool]
  );

  // if there was a problem fetching the pool, log it
  poolError && log.error(poolError);

  // combined loading state from all the required queries
  const loading = useMemo(() => {
    const loading = poolLoading;
    log.debug('TradePage.loading', loading);
    return loading;
  }, [poolLoading]);

  log.debug('TradePage.poolData.pool', poolData?.pool);

  // when the underlying form's assetIds change, update the state
  const handleAssetIdsChange = (assetInId: string, assetOutId?: string) => {
    const newIds = { assetInId, assetOutId };
    log.debug(
      'TradePage.handleAssetIdsChange',
      isEqual(assetIds, newIds),
      newIds
    );
    if (!isEqual(assetIds, newIds)) setAssetIds(newIds);
  };

  const spotPrice = useSpotPrice(assetIds, poolData?.pool);

  const poolLiquidity: PoolLiquidity = useMemo(() => {
    return {
      assetABalance: find(pool?.balances, { assetId: assetIds.assetInId })
        ?.balance,
      assetBBalance: find(pool?.balances, { assetId: assetIds.assetOutId })
        ?.balance,
    };
  }, [pool, assetIds]);

  return (
    <div>
      <h1>Trade</h1>

      <br />
      <br />

      <TradeChart poolLiquidity={poolLiquidity} spotPrice={spotPrice} />

      <TradeForm
        onAssetIdsChange={handleAssetIdsChange}
        assetIds={assetIds}
        loading={loading}
        pool={pool}
        spotPrice={spotPrice}
      />
    </div>
  );
};
