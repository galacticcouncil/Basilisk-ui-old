import { useMemo } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { DataPoint, Trend } from '../LineChart/LineChart'
import { AssetPair, ChartGranularity, ChartType, DisplayData, PoolType } from '../shared'
import percentageChange from 'percent-change';
import './ChartHeader.scss'
import classNames from 'classnames';
import { FormattedBalance } from '../../FormattedBalance/FormattedBalance';

const horizontalBar = '―';

const formatGranularity = (granularity: ChartGranularity) => (
    <FormattedMessage
        id="ChartHeader.granularity"
        defaultMessage={`{granularity, select, ALL {ALL} D30 {30D} D7 {7D} D3 {3D} H24 {24H} H12 {12H} H1 {1H} other {${horizontalBar}}}`}
        values={{ granularity }}
    />
)

export const ChartHeader = ({
    assetPair,
    poolType,
    displayData,
    referenceData,
    chartType,
    granularity,
    isUserBrowsingGraph,
    availableChartTypes,
    onChartTypeChange,
    availableGranularity,
    onGranularityChange,
    dataTrend
}: {
    assetPair: AssetPair,
    poolType: PoolType,
    displayData: DisplayData,
    referenceData: DisplayData | undefined,
    dataTrend: Trend,
    granularity: ChartGranularity,
    isUserBrowsingGraph: boolean | undefined,
    chartType: ChartType,
    availableChartTypes: ChartType[],
    availableGranularity: ChartGranularity[],
    onChartTypeChange: (chartType: ChartType) => void,
    onGranularityChange: (granularity: ChartGranularity) => void,
}) => {

    const referenceDataPercentageChange = useMemo(() => {
        if (!referenceData?.balance) return 0;
        return percentageChange(referenceData.balance, displayData.balance);
    }, [displayData, referenceData]);

    return (
            <div className="col-12 g-0 chart-header">
                <div className="row g-0">
                    <div className='col-6'>

                        <div className="row g-0 align-items-center">
                            {/* pair symbols */}
                            <div className='col-xs-auto text-white-1 chart-header__pair-symbols'>
                                <p>
                                    {`${assetPair.assetA.symbol} / `}
                                    {assetPair.assetB?.symbol
                                        ? `${assetPair.assetB.symbol}`
                                        // TODO: replace with long dash glyph
                                        : horizontalBar
                                    }
                                </p>
                            </div>

                            {/* TODO: add tooltip after the component is implemented */}
                            <div className="col text-gray-4 chart-header__type-label">
                                {poolType
                                    ? (
                                        <>
                                            [
                                            <FormattedMessage
                                                id="ChartHeader.poolType.label"
                                                defaultMessage="{poolType, select, XYK {XYK} LBP {LBP} other {-}}"
                                                values={{ poolType }}
                                            />
                                            ]
                                        </>
                                    )
                                    : null
                                }
                            </div>
                        </div>

                        <div className="row g-0">
                            {/* Pair full names */}
                            <div className='text-gray-4 chart-header__pair-full-names'>
                                <p>
                                    {`${assetPair.assetA.fullName} / `}
                                    {assetPair.assetB?.fullName
                                        ? `${assetPair.assetB.fullName}`
                                        : horizontalBar
                                    }
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className='col-6 text-end'>
                        <div className='text-white-1 chart-header__data'>
                            <div className='row g-0'>
                                <div className='chart-header__data__in-asset'>
                                    <FormattedBalance
                                        balance={displayData.usdBalance}
                                        symbol={displayData.asset.symbol}
                                    />
                                </div>
                                <div className='chart-header__data__breakdown'>
                                    <FormattedBalance
                                        balance={displayData.usdBalance}
                                        symbol='USD'
                                    />

                                    <span className={classNames({
                                        "text-green-1": dataTrend === Trend.Positive,
                                        "text-gray-1": dataTrend === Trend.Neutral,
                                        "text-red-1": dataTrend === Trend.Negative
                                    })}>
                                        (
                                        {referenceDataPercentageChange >= 0 ? '+' : ''}
                                        <FormattedNumber
                                            style='percent'
                                            minimumFractionDigits={2}
                                            maximumFractionDigits={2}
                                            value={referenceDataPercentageChange}
                                        />
                                        )
                                    </span>

                                    <span className={"text-gray-4 chart-header__data__breakdown__granularity " + classNames({
                                        "disabled": isUserBrowsingGraph
                                    })}>
                                        <FormattedMessage
                                            id="ChartHeader.granularity.pastIndicator"
                                            defaultMessage="Past"
                                        /> {" "} {formatGranularity(granularity)}
                                        {(() => {
                                            if (!granularity) return;

                                            switch (poolType) {
                                                // This is a *very special* case, when we also want to display
                                                // a price prediction for an LBP PRICE chart
                                                case PoolType.LBP: {
                                                    if (chartType !== ChartType.PRICE) return;
                                                    return <>
                                                        {' + '}
                                                        <FormattedMessage
                                                            id="ChartHeader.granularity.futureIndicator"
                                                            // TODO: do we want to show 'Future' here?
                                                            defaultMessage=" "
                                                        />
                                                        {' '}
                                                        {formatGranularity(granularity)}
                                                    </>
                                                }
                                                default:
                                                    return
                                            }
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-0 chart-header__controls">

                    {/* graph selector */}
                    <div className="col-6">
                        <div className="chart-header__controls__graph-type text-gray-4 text-start">

                    {/* TODO: add translations & granularity enums & on graph type handler */}
                    {/* for now only price chart is available */}
                    {availableChartTypes.map((chartTypeEntry, i) => (
                        <span
                            className={classNames({
                                "chart-header__controls__graph-type__individual": true,
                                'active': chartTypeEntry === chartType,
                                'disabled': chartTypeEntry !== chartType
                            })}
                            key={i}
                            onClick={_ => onChartTypeChange(chartTypeEntry)}
                        >
                            <FormattedMessage
                                id="ChartHeader.chartType.selector"
                                defaultMessage="{chartType, select, PRICE {PRICE} VOLUME {VOLUME} WEIGHTS {WEIGHT} other {-}}"
                                values={{ chartType: chartTypeEntry }}
                            />
                        </span>
                    ))}
                    
                        </div>
                    </div>

                    {/* granularity selector */}
                    <div className="col-6">
                        <div className="chart-header__controls__granularity text-end text-gray-4">

                            {availableGranularity.map((granularityEntry, i) => {
                                return <span
                                    className={classNames({
                                        "chart-header__controls__granularity__individual": true,
                                        'active': granularityEntry === granularity,
                                    })}
                                    onClick={_ => onGranularityChange(granularityEntry)}
                                    key={i}
                                >
                                    {formatGranularity(granularityEntry)}
                                </span>
                            })}

                        </div>
                    </div>

                </div>
            </div>
    )
}