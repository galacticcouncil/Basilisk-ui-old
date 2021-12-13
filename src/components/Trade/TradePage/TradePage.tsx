import { find } from 'lodash';
import { useCallback, useMemo } from 'react';
import { PoolLiquidity, TradeChart, TradeChartProps } from '../../../containers/TradeChart'
import { SubmitTradeMutationVariables, useSubmitTradeMutation } from '../../../hooks/pools/mutations/useSubmitTradeMutation';
import { useSpotPrice } from './hooks/useSpotPrice';
import { TradeForm, TradeFormProps } from '../TradeForm/TradeForm'

export type TradePageProps = 
    Omit<TradeChartProps, 'poolLiqudity' | 'spotPrice'> 
    & TradeFormProps;

export const TradePage = ({ 
    pool,
    loading,
    assetIds,
    onAssetIdsChange,
    onTradeSubmit
 }: TradePageProps) => {

    const spotPrice = useSpotPrice(
        assetIds,
        pool,
    );
    
    const poolLiquidity: PoolLiquidity = useMemo(() => {
        return {
            assetABalance: find(pool?.balances, { assetId: assetIds.assetInId })?.balance,
            assetBBalance: find(pool?.balances, { assetId: assetIds.assetOutId })?.balance,
        }
    }, [pool]);

    return <div>
        <h1>Trade</h1>

        <br /><br />

        <TradeChart 
            spotPrice={spotPrice}
            poolLiquidity={poolLiquidity}
        />
        
        <TradeForm 
            pool={pool}
            loading={loading}
            assetIds={assetIds}
            spotPrice={spotPrice}
            onAssetIdsChange={onAssetIdsChange}
            onTradeSubmit={onTradeSubmit}
        />
    </div>
}