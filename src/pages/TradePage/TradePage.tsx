import { find, isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery';
import { TradeForm, TradeFormProps } from '../../components/Trade/TradeForm/TradeForm';
import { PoolLiquidity, TradeChart } from '../../containers/TradeChart';
import log from 'loglevel';
import { useSpotPrice } from '../../components/Trade/TradePage/hooks/useSpotPrice';
import { Pool } from '../../generated/graphql';
import { SubmitTradeMutationVariables, useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation';
import { TradePage as TradePageComponent } from '../../components/Trade/TradePage/TradePage';

export interface SpotPrice {
    aToB?: string,
    bToA?: string
}

/**
 * Trade page responsible for fetching pool data
 * @returns 
 */
export const TradePage = () => {
    // TODO default values here should come from the router where query args are parsed
    const [assetIds, setAssetIds] = useState<TradeFormProps['assetIds']>({
        assetInId: '0',
        assetOutId: '2'
    })

    // automatically fetch a pool by the given assets
    const { 
        data: poolData, 
        loading: poolLoading, 
        error: poolError 
    } = useGetPoolByAssetsQuery(assetIds);
    log.debug('TradePage.useGetPoolByAssetsQuery', assetIds);

    const pool: Pool | undefined = useMemo(() => poolData?.pool, [poolData?.pool]);

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
        log.debug('TradePage.handleAssetIdsChange', isEqual(assetIds, newIds), newIds);
        if (!isEqual(assetIds, newIds)) setAssetIds(newIds);
    }

    const [submitTrade] = useSubmitTradeMutation();
    const handleTradeSubmit = useCallback((variables: SubmitTradeMutationVariables) => {
        submitTrade({ variables })
    }, []);

    return <TradePageComponent 
        pool={pool}
        loading={loading}
        assetIds={assetIds}
        onTradeSubmit={handleTradeSubmit}
        onAssetIdsChange={handleAssetIdsChange}
    />
}