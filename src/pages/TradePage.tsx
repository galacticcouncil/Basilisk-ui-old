import { isEqual, nth } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LbpPool, Pool, TradeType } from '../generated/graphql';
import { useGetAssetsQuery } from '../hooks/assets/queries/useGetAssetsQuery';
import { useGetPoolByAssetsQuery } from '../hooks/pools/queries/useGetPoolByAssetsQuery';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useSubmitTradeMutation } from '../hooks/pools/mutations/useSubmitTradeMutation';
import { PoolType } from '../components/Chart/shared';
import { useCalculateInGivenOut } from '../hooks/pools/useCalculateInGivenOut';
import { useCalculateOutGivenIn } from '../hooks/pools/useCalculateOutGivenIn';
import { fromPrecision12, useFromPrecision12 } from '../hooks/math/useFromPrecision';
import { toPrecision12 } from '../hooks/math/useToPrecision';
import { usePool } from '../hooks/pools/usePool';
import { useSlippage } from '../hooks/pools/useSlippage';
import { applyAllowedSlippage, applyTradeFee } from '../hooks/pools/resolvers/useSubmitTradeMutationResolvers';
import { AnyNaptrRecord } from 'dns';
import { useCalculateSpotPrice } from '../hooks/pools/lbp/calculateSpotPrice';
import { TradeForm } from '../containers/TradeForm';
import { TradeChart } from '../containers/TradeChart';
import log from 'loglevel';

/**
 * Trade page responsible for fetching pool data
 * @returns 
 */
export const TradePage = () => {
    // TODO default values here should come from the router where query args are parsed
    const [assetIds, setAssetIds] = useState<{
        assetAId: undefined | string,
        assetBId: undefined | string
    }>({
        assetAId: undefined,
        assetBId: undefined
    })

    // automatically fetch a pool by the given assets
    const { 
        data: poolData, 
        loading: poolLoading, 
        error: poolError 
    } = useGetPoolByAssetsQuery(assetIds);

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
    const handleAssetIdsChange = (assetAId: string, assetBId?: string) => {
        const newIds = { assetAId, assetBId };
        log.debug('TradePage.handleAssetIdsChange', isEqual(assetIds, newIds), newIds);
        if (!isEqual(assetIds, newIds)) setAssetIds(newIds);
    }

    return <div>
        <h1>Trade</h1>

        <br /><br />

        <TradeChart/>
        <TradeForm
            onAssetIdsChange={handleAssetIdsChange}
            loading={loading}
            pool={poolData?.pool}
        />
    </div>
}