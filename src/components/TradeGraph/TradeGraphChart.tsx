import './../../shared/shared';
import './TradeGraph.scss';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime, useIntl } from 'react-intl';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Line } from 'react-chartjs-2';
import { times, random, first, last, find } from 'lodash';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import percentageChange from 'percent-change';
import blockHeightToDate from '../../shared/utils/blockHeightToDate';
import { usePrevious } from 'react-use';
import CountUp from 'react-countup';
import annotationPlugin from 'chartjs-plugin-annotation';
import moment from 'moment';
import { TradeGraphHeader, AssetPair, PoolType, SpotPrice, TradeGraphGranularity } from './TradeGraphHeader';

type DataPoint = { x: number, y: number };
export type HistoricalSpotPrice = SpotPrice[]
export interface onUserBrowsingGraphEvent {
    isUserBrowsingGraph: boolean,
    spotPrice: SpotPrice | undefined
}
export interface TradeGraphChartProps {
    historicalSpotPrice: HistoricalSpotPrice,
    onUserBrowsingGraph: (event: onUserBrowsingGraphEvent) => void,
    isUserBrowsingGraph: boolean,
    granularity: TradeGraphGranularity
}

export const TradeGraphChart: React.FC<TradeGraphChartProps> = ({
    historicalSpotPrice,
    onUserBrowsingGraph,
    isUserBrowsingGraph,
    granularity
}) => {

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

        // if a tooltip for the current position is already shown, do nothing
        if (tooltipData.position === tooltip.caretX && visible && isUserBrowsingGraph) return;

        const blockHeight = (tooltip.dataPoints[0]?.raw as DataPoint).x;
        const spotPrice = find(historicalSpotPrice, {
            blockHeight: blockHeight
        });

        (visible && spotPrice)
            ? showTooltip({
                spotPrice,
                position: tooltip.caretX
            })
            : hideTooltip()
    }, [tooltipData.position, isUserBrowsingGraph])

    const chartOptions: any = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxis: {
                display: false,
            },
            yAxis: {
                display: false,

            }
        },
        layout: {
            padding: {
                top: 96 + 40
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
    }), [tooltipHandler]);

    const chartLabels = useMemo(() => (
        historicalSpotPrice.map(spotPrice => parseInt(spotPrice.timestamp))
    ), [historicalSpotPrice]);

    const chartData = useMemo<ChartData>(() => ({
        labels: chartLabels,
        datasets: [
            {
                data: historicalSpotPrice.map(spotPrice => ({
                    x: spotPrice.blockHeight,
                    y: spotPrice.balance
                })),
                // TODO: import from scss
                backgroundColor: '#4FFFB0',
                borderColor: '#4FFFB0',
                borderWidth: 3,
                borderJoinStyle: 'round',
                pointRadius: 0,
                // TODO: do we want tension 0 for a sharp graph?
                tension: 0.2
            },
        ],
    }), [historicalSpotPrice, chartLabels])

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
            case TradeGraphGranularity.ALL:
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
                            moment(new Date(parseInt(tooltipData.spotPrice.timestamp))).toISOString(true)
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
                            <Line
                                data={chartData}
                                options={chartOptions}
                            />
                            {tooltip}
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