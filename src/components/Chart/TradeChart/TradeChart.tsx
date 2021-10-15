import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChartTicks } from '../ChartTicks/ChartTicks';
import { LineChart, Trend, Dataset, primaryDatasetLabel, TooltipData } from '../LineChart/LineChart';
import { AssetPair, ChartGranularity, PoolType, ChartType, DisplayData } from '../shared';
import { ChartHeader } from './../ChartHeader/ChartHeader';
import './TradeChart.scss';
import moment from 'moment';
import { TradeChartError, TradeChartErrorType } from './TradeChartError';
import { find, last, random, times } from 'lodash';

// this function is absolutely hacky
export const _getTooltipPositionCss = (tooltipPosition: number) => {
    // TODO: use a more specific selector
    const tooltipWidth = 100;
    const canvasWidth = document.getElementsByTagName('canvas')[0]?.getBoundingClientRect().width;
    if (tooltipPosition < tooltipWidth) return {
        left: 0
    };

    if (canvasWidth && tooltipPosition > canvasWidth - tooltipWidth) return {
        right: 0
    }

    return {
        left: tooltipPosition - tooltipWidth
    };
}

export const TradeChart = ({
    assetPair,
    poolType,
    granularity,
    chartType,
    onChartTypeChange,
    onGranularityChange
}: {
    assetPair: AssetPair,
    poolType: PoolType,
    granularity: ChartGranularity,
    chartType: ChartType,
    onChartTypeChange: (chartType: ChartType) => void,
    onGranularityChange: (granularity: ChartGranularity) => void,
}) => {

    const now = Date.now();
    const primaryDataset: Dataset = useMemo(() => times(150)
        .map(i => ({
            x: now + (i * 100000),
            y: random(3000, 3100)
        }))
    , []);

    const [displayData, setDisplayData] = useState<DisplayData>({
        balance: last(primaryDataset)?.y,
        // TODO; usd value of the balance needs to be determined separately
        // concept of a rich dataset, boil it down to x/y for the linechart
        // and persist usd balances etc at a higher level
        usdBalance: last(primaryDataset)?.y,
        // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
        asset: {
            symbol: assetPair.assetB?.symbol,
            fullName: assetPair.assetB?.fullName
        }
    });

    // TODO: set reference data based on if the user is interacting with the graph
    // if the user is not interacting with the graph, reference data should be 
    const [referenceData, setReferenceData] = useState<DisplayData | undefined>(displayData);

    const getTooltipPositionCss = useCallback(_getTooltipPositionCss, [])
    const [tooltipData, setTooltipData] = useState<TooltipData | undefined>(undefined);
    const [dataTrend, setDataTrend] = useState(Trend.Positive);

    // TODO: set trend based on tooltip data
    useEffect(() => {
        // tooltipData?.data.x < referenceData.
    }, [tooltipData]);

    const handleTooltip = useCallback((tooltipData: TooltipData | undefined) => {
        setTooltipData(tooltipData);

        if (tooltipData?.visible) {
            const datasets = [primaryDataset];
            const allData = datasets
                .reduce((allData, dataset) => allData.concat(dataset), []);

            const referenceData = find(allData, {
                x: tooltipData?.data.x,
                y: tooltipData?.data.y
            });

            if (referenceData) setDisplayData({
                ...displayData,
                balance: referenceData.y,
                usdBalance: referenceData.y,
            });
        } else {
            // setDisplayData()
        }

    }, [setTooltipData])

    const availableChartTypes = useMemo(() => ([
        ChartType.PRICE,
        ChartType.VOLUME,
        ChartType.WEIGHTS
    ]), []);

    const availableGranularity = useMemo(() => ([
        ChartGranularity.D30,
        ChartGranularity.D7,
        ChartGranularity.H24,
        ChartGranularity.H1,
    ]), [])

    return (
        <div className='row p-5 g-0 trade-chart'>
            <div className="row g-0">
                <ChartHeader
                    assetPair={assetPair}
                    poolType={poolType}
                    granularity={granularity}
                    chartType={chartType}
                    onChartTypeChange={onChartTypeChange}
                    onGranularityChange={onGranularityChange}
                    displayData={displayData}
                    referenceData={referenceData}
                    dataTrend={dataTrend}
                    isUserBrowsingGraph={tooltipData?.visible}
                    availableChartTypes={availableChartTypes}
                    availableGranularity={availableGranularity}
                />
            </div>

            <div className="row g-0">

                {primaryDataset?.length
                    ? (
                        <div className="col-12 align-self-end trade-chart__chart-wrapper">
                            <div className='trade-chart__chart-wrapper__chart-jail'>
                                <LineChart
                                    primaryDataset={primaryDataset}
                                    fill={true}
                                    trend={dataTrend}
                                    onHandleTooltip={handleTooltip}
                                />
                            </div>

                            {tooltipData?.positionX
                                ? (
                                    <div>
                                        <div
                                            className="trade-chart__tooltip"
                                            style={{
                                                left: `${tooltipData.positionX}px`,
                                                opacity: tooltipData.visible ? 1 : 0
                                            }}
                                        ></div>
                                        <div
                                            className="trade-chart__tooltip__label"
                                            style={{
                                                ...getTooltipPositionCss(tooltipData.positionX!),
                                                opacity: tooltipData.visible ? 1 : 0
                                            }}
                                        >
                                            {tooltipData.data?.x ? (
                                                //TODO: format using intl
                                                moment(new Date(tooltipData.data.x)).toString()
                                            ) : <></>}
                                        </div>
                                    </div>
                                ) : <></>}

                            <ChartTicks
                                className='align-self-end'
                                datasets={[
                                    primaryDataset
                                ]}
                                granularity={granularity}
                            />
                        </div>
                    )
                    : <></>}


                {!primaryDataset?.length
                    ? <div className="col-12 align-self-center trade-chart__error-wrapper">
                        <TradeChartError type={TradeChartErrorType.InvalidPair} />
                    </div>
                    : <></>}

            </div>
        </div>
    )
}