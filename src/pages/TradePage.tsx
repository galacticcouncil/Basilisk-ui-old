import { ChartGranularity, ChartType, PoolType } from '../components/Chart/shared';
import { TradeChart } from '../components/Chart/TradeChart/TradeChart'
import { TradeForm } from '../components/Trade/TradeForm'
import ETHIcon from './../icons/assets/ETH.svg';
import KSMIcon from './../icons/assets/KSM.svg';


// assetPair,
// poolType,
// granularity,
// chartType,
// onChartTypeChange,
// onGranularityChange

export const TradePage = () => {

    const assetPair = {
        assetA: {
            symbol: 'BSX',
            fullName: 'Basilisk',
            icon: ETHIcon
        },
        assetB: {
            symbol: 'KSM',
            fullName: 'Kusama',
            icon: KSMIcon
        }
    };

    const poolType = PoolType.XYK;
    const chartType = ChartType.PRICE;
    const granularity = ChartGranularity.H1;
    const onChartTypeChange = () => {};
    const onGranularityChange = () => {};

    return <div className="container">
        <div className="row g-0">
            <div className="col-8">
                <TradeChart
                    assetPair={assetPair}
                    poolType={poolType}
                    granularity={granularity}
                    chartType={chartType}
                    onChartTypeChange={onChartTypeChange}
                    onGranularityChange={onGranularityChange}
                />
            </div>
            <div className="col-4">
                <TradeForm assetPair={assetPair}/>
            </div>
        </div>
    </div>
}