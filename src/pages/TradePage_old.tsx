import { last, random, times } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Dataset } from '../components/Chart/LineChart/LineChart';
import { AssetPair, ChartGranularity, ChartType, PoolType } from '../components/Chart/shared';
import { TradeChart } from '../components/Chart/TradeChart/TradeChart'
import { TradeForm } from '../components/Trade/TradeForm_old'

// assetPair,
// poolType,
// granularity,
// chartType,
// onChartTypeChange,
// onGranularityChange

export const TradePage = ({
    assetPair,
}: {
    assetPair: AssetPair,
}) => {

    const [_assetPair, setAssetPair] = useState(assetPair);
    useEffect(() => {
        setAssetPair(assetPair)
    }, [assetPair]);

    const poolType = PoolType.XYK;
    const chartType = ChartType.PRICE;
    const granularity = ChartGranularity.H1;
    const onChartTypeChange = () => {};
    const onGranularityChange = () => {};
    const handleAssetPairSwitch = () => {
        setAssetPair({
            assetA: _assetPair.assetB!,
            assetB: _assetPair.assetA
        })
    }

    const now = Date.now();
    const primaryDataset: Dataset = useMemo(() => times(60)
        .map(i => ({
            x: now + (i * 100000),
            y: random(3000, 3100) / (assetPair.assetA.symbol === 'BSX' ? 2 : 1)
        }))
    , [assetPair]);

    return <div className="container">
        <div className="row g-0">
            <div className="col-8">
                <TradeChart
                    assetPair={_assetPair}
                    poolType={poolType}
                    granularity={granularity}
                    chartType={chartType}
                    primaryDataset={primaryDataset}
                    onChartTypeChange={onChartTypeChange}
                    onGranularityChange={onGranularityChange}
                />
            </div>
            <div className="col-4">
                <TradeForm 
                    assetPair={_assetPair}
                    onAssetPairSwitch={handleAssetPairSwitch}
                    spotPrice={0.5}
                />
            </div>
        </div>
    </div>
}