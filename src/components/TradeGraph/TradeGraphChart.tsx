import './../../shared/shared';
import './TradeGraphChart.scss';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime, useIntl } from 'react-intl';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Line } from 'react-chartjs-2';
import { times, random, first, last, find, minBy, maxBy } from 'lodash';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import percentageChange from 'percent-change';
import blockHeightToDate from '../../shared/utils/blockHeightToDate';
import { usePrevious } from 'react-use';
import CountUp from 'react-countup';
import annotationPlugin from 'chartjs-plugin-annotation';
import moment from 'moment';
import { TradeGraphHeader, AssetPair, PoolType, SpotPrice, TradeGraphGranularity } from './TradeGraphHeader';
import addHours from 'date-fns/esm/fp/addHours/index.js';
import 'chartjs-adapter-moment';
import addMinutes from 'date-fns/esm/fp/addMinutes/index.js';
import { subDays, subHours } from 'date-fns/esm';
import { differenceInHours, differenceInMinutes } from 'date-fns';
// TODO: add typesafe definitions for colors
import cssColors from './../../shared/colors.module.scss';

type DataPoint = { x: number, y: number };
export type HistoricalSpotPrice = SpotPrice[]
export interface onUserBrowsingGraphEvent {
    isUserBrowsingGraph: boolean,
    spotPrice: SpotPrice | undefined
}
export interface TradeGraphChartProps {
    historicalSpotPrice: HistoricalSpotPrice,
    spotPrice: SpotPrice,
    displaySpotPrice: SpotPrice,
    onUserBrowsingGraph: (event: onUserBrowsingGraphEvent) => void,
    isUserBrowsingGraph: boolean,
    granularity: TradeGraphGranularity
}

export const TradeGraphChart: React.FC<TradeGraphChartProps> = ({
    historicalSpotPrice,
    onUserBrowsingGraph,
    isUserBrowsingGraph,
    granularity,
    displaySpotPrice,
    spotPrice
}) => {
    // extract chart context for advanced drawing (e.g. gradient)
    const chartContainer = useRef(null);
    const [chartCtx, setChartCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        var ctx = document.getElementsByTagName("canvas")[0]?.getContext("2d");
        setChartCtx(ctx);
    }, [chartContainer]);

    const [tooltipData, setTooltipData] = useState<{
        // data point we're observing in a tooltip
        // this is different from the displaySpotPrice in the rest of the graph
        spotPrice: SpotPrice | undefined,
        // horizontal position of the tooltip relative to the chart canvas
        position: number | undefined
    }>({
        spotPrice: undefined,
        position: undefined
    });

    // configure tooltip and notify the parent component
    const showTooltip = useCallback(({ spotPrice, position }: {
        spotPrice: SpotPrice | undefined,
        position: number
    }) => {
        onUserBrowsingGraph({
            isUserBrowsingGraph: true,
            spotPrice
        });
        setTooltipData({ spotPrice, position });
    }, [])

    const hideTooltip = useCallback(() => {
        onUserBrowsingGraph({
            isUserBrowsingGraph: false,
            spotPrice: undefined
        });
    }, [])

    /**
     * Triggering the tooltip means that the user is 'browsing the graph'.
     * This means we need to notify the parent about which data point the 
     * user is looking at, while also displaying the tooltip on the chart
     * with the relevant data.
     */
    const tooltipHandler = useCallback(({ tooltip }: any) => {
        const visible = tooltip.opacity;
        // TODO: get rid of this dangerous unwraping
        const timestamp = (tooltip.dataPoints[0]?.raw as DataPoint).x;
        const spotPrice = find(historicalSpotPrice, {
            timestamp
        });

        // if a tooltip for the current position is already shown, do nothing
        if (tooltipData.spotPrice?.timestamp === timestamp && visible && isUserBrowsingGraph) return;

        (visible && spotPrice)
            ? showTooltip({
                spotPrice,
                position: tooltip.caretX
            })
            : hideTooltip()

    }, [tooltipData.position, isUserBrowsingGraph])

    /**
     * There is an edge case with chartMin/chartMax where the current
     * spot price data is stale (not updating) and therefore the min-max
     * range wont be a full 1hour, since the min will update as now-1h,
     * but the max will stay as the latest data point (which is stale)
     */
    const chartXMin = useMemo(() => {
        switch (granularity) {
            case TradeGraphGranularity.D30:
                return subDays(Date.now(), 30).getTime()

            case TradeGraphGranularity.D7:
                return subDays(Date.now(), 7).getTime()

            case TradeGraphGranularity.H24:
                return subHours(Date.now(), 24).getTime()

            case TradeGraphGranularity.H1:
                return subHours(Date.now(), 1).getTime()

            default:
                return subHours(Date.now(), 1).getTime()
        }
    }, [granularity, historicalSpotPrice]);

    // if there are no historical spot price entries, do not attempt to graph the current spot price
    historicalSpotPrice = useMemo(() => (
        historicalSpotPrice.length 
            ? historicalSpotPrice
                // hide data points older than the chart granularity
                .filter(({ timestamp }) => timestamp >= chartXMin)
                .concat([spotPrice]) 
            : []
    ), [historicalSpotPrice, spotPrice, chartXMin]);

    /**
     * Chart max will be either capped by the historical spot price
     * latest entry, or if there are no hisotircal spot prices
     * then the max is artificially created
     */
    const chartXMax = useMemo(() => {
        return historicalSpotPrice.length
            ? last(historicalSpotPrice)?.timestamp
            : Date.now()
    }, [historicalSpotPrice]);
    
    const chartYMin = minBy(historicalSpotPrice, spotPrice => spotPrice.balance)?.balance;
    const chartYMax = maxBy(historicalSpotPrice, spotPrice => spotPrice.balance)?.balance;

    const chartOptions = useMemo<ChartOptions>(() => ({
        responsive: true,
        maintainAspectRatio: false,
        // TODO: remove only color animations
        animation: false,
        scales: {
            xAxis: {
                display: false,
                type: 'time',
                max: chartXMax,
                min: chartXMin
            },
            yAxis: {
                display: false,
                stacked: false,
                min: chartYMin,
                max: chartYMax,
            }
        },
        layout: {
            padding: {
                // TODO: extract this value from css
                top: 96,
                bottom: 0
            }
        },
        hover: {
            // mode: 'nearest',
            intersect: true,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false,
                mode: 'index',
                intersect: false,
                position: 'nearest',
                external: tooltipHandler
            },
        },
    }), [tooltipHandler, chartXMin, chartXMax, chartYMin, chartYMax, historicalSpotPrice]);

    const chartLabels = useMemo(() => {
        return [chartXMin, chartXMax];
    }, [historicalSpotPrice, granularity]);
    

    const greenBackgroundColor = useMemo((() => {
        var gradient = chartCtx?.createLinearGradient(0, 0, 0, 400);
        gradient?.addColorStop(0, cssColors.green1Opacity70);   
        gradient?.addColorStop(1, cssColors.gray2Opacity0);
        return gradient;
    }), [chartCtx]);

    const redBackgroundColor = useMemo(() => {
        var gradient = chartCtx?.createLinearGradient(0, 0, 0, 400);
        gradient?.addColorStop(0, cssColors.red1Opacity70);   
        gradient?.addColorStop(1, cssColors.gray2Opacity0);
        return gradient;
    }, [chartCtx]);



    const chartData = useMemo<ChartData>(() => ({
        labels: [chartLabels],
        datasets: [
            {
                label: '1',
                yAxisID: 'yAxis',
                data: historicalSpotPrice.map(spotPrice => ({
                    x: spotPrice.timestamp,
                    y: spotPrice.balance
                })),
                fill: true,
                // TODO: when not interacting with the graph, indicate in red/green
                // if the latest spot price is <> than the last historical price visible (!)
                // don't forget to filter out already invisible data points to avoid user confusion
                backgroundColor: displaySpotPrice.balance >= spotPrice.balance
                    ? greenBackgroundColor
                    : redBackgroundColor,
                borderColor: displaySpotPrice.balance >= spotPrice.balance
                    ? cssColors.green1
                    : cssColors.red1,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.1
            }
        ],
    }), [historicalSpotPrice, chartLabels, spotPrice, displaySpotPrice, chartCtx])

    const formatTick = useCallback((tick: number) => {
        const tickDate = new Date(tick);

        const asTime = <FormattedTime
            hourCycle="h24"
            value={tickDate}
        />

        const asDate = <FormattedDate
            value={tickDate}
        />

        switch (granularity) {
            case TradeGraphGranularity.D30:
                return asDate

            case TradeGraphGranularity.D7:
                return asDate

            case TradeGraphGranularity.H24:
                return asTime

            case TradeGraphGranularity.H1:
                return asTime
        }
    }, [granularity])

    // TODO: add rounding down for hours also for data fetching (!)
    const chartXAxisTicks = useMemo(() => {
        const firstTick = first(chartLabels);
        const lastTick = last(chartLabels);

        if (!firstTick || !lastTick) return;

        let ticks = [firstTick];
        const numberOfMiddleTicks = 5;
        const middleTicks = (() => {
            const dateRange = lastTick - firstTick;
            const distance = dateRange / (numberOfMiddleTicks + 1);
            return times(numberOfMiddleTicks)
                .map((_, i) => {
                    return firstTick + (distance * (i + 1))
                })
        })()

        ticks = ticks.concat(middleTicks)
        ticks.push(lastTick);

        return (
            <div className="row g-0 justify-content-between text-top trade-graph__chart__ticks">
                {ticks.map((tick, i) => (
                    <div
                        className="col-auto"
                        key={i}
                    >
                        <span>
                            {formatTick(tick)}
                        </span>
                    </div>
                ))}
            </div>
        )
    }, [chartLabels, chartData, formatTick, granularity]);

    // this function is absolutely hacky
    const getTooltipPositionCss = useCallback((tooltipPosition: number) => {
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
    }, []);

    const tooltip = useMemo(() => {
        return tooltipData.position
            ? (
                <>
                    <div
                        className="trade-graph__chart__wrapper__tooltip"
                        style={{
                            left: `${tooltipData.position}px`,
                            opacity: isUserBrowsingGraph ? 1 : 0
                        }}
                    ></div>
                    <div
                        className="trade-graph__chart__wrapper__tooltip__label"
                        style={{
                            ...getTooltipPositionCss(tooltipData.position!),
                            opacity: isUserBrowsingGraph ? 1 : 0
                        }}
                    >
                        {tooltipData.spotPrice?.timestamp ? (
                            //TODO: format using intl
                            moment(new Date(tooltipData.spotPrice.timestamp)).toISOString(true)
                        ) : <></>}
                    </div>
                </>
            ) : <></>
    }, [tooltipData, isUserBrowsingGraph])

    return (
        <div className="row g-0 trade-graph__chart">
            <div className="col-12">
                <div className="row g-0">
                    <div className="col-12">
                        <div className="trade-graph__chart__wrapper">
                            {historicalSpotPrice.length
                                ? (
                                    <>
                                        <Line
                                            ref={chartContainer}
                                            data={chartData}
                                            options={chartOptions}
                                        />
                                        {tooltip}
                                    </>
                                )
                                : (
                                    // TODO: error state
                                    <>
                                        No historical data available
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>
                <div className="row g-0">
                    <div className="col-12">
                        {chartXAxisTicks}
                    </div>
                </div>
            </div>
        </div>
    )
}