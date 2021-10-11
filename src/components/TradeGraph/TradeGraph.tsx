import './../../shared/shared';
import { FormattedMessage, FormattedNumber, FormattedTime, useIntl } from 'react-intl';
import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
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
import { TradeGraphHeader, AssetPair, PoolType, SpotPrice, TradeGraphGranularity, TradeGraphChartTypes } from './TradeGraphHeader';
import { onUserBrowsingGraphEvent, TradeGraphChart } from './TradeGraphChart';

Chart.register(annotationPlugin);

export type HistoricalSpotPrice = SpotPrice[]

export interface TradeGraphProps {
    assetPair: AssetPair,
    poolType: PoolType,
    spotPrice: SpotPrice,
    historicalSpotPrice: HistoricalSpotPrice,
    availableGranularity: TradeGraphGranularity[],
    granularity: TradeGraphGranularity,
    availableChartTypes: TradeGraphChartTypes[],
    chartType: TradeGraphChartTypes,
    onGranularityChange: (granularity: TradeGraphGranularity) => null
}

/**
 * TODO: helper icon, time zone conversion from zulu to local,
 * loading state, error state, wrong asset pair state
 * TODO: find a new red color for percentge change indicator
 * @returns 
 */
export const TradeGraph: React.FC<TradeGraphProps> = ({
    assetPair,
    poolType,
    spotPrice,
    historicalSpotPrice,
    availableGranularity,
    granularity,
    availableChartTypes,
    chartType,
    onGranularityChange
}) => {
    const [displaySpotPrice, setDisplaySpotPrice] = useState(spotPrice)
    const [isUserBrowsingGraph, setIsUserBrowsingGraph] = useState(false);

    // update display spot price when the current spot price updates
    useEffect(() => setDisplaySpotPrice(spotPrice), [spotPrice]);

    const referenceSpotPrice = (!isUserBrowsingGraph)
            // if the user is not browsing the graph, use the first historical entry as the reference spot price
            ? first(historicalSpotPrice) || spotPrice
            // if the user is browsing the graph, use the latest/current spot price as the reference spot price
            : spotPrice;

    const handleUserBrowsingGraph = (event: onUserBrowsingGraphEvent) => {
        setIsUserBrowsingGraph(event.isUserBrowsingGraph);
        // when the user is browsing our graph, show the spot price for the given data point
        event.spotPrice 
            // spot price from the tooltip
            ? setDisplaySpotPrice(event.spotPrice)
            // default spot price
            : setDisplaySpotPrice(spotPrice)
    };

    return <div
        className='bg-gray-2 trade-graph'
    >
        <div className='row'>
            <div className='col-12'>
                <div className='p-5 content'>

                    <TradeGraphHeader 
                        assetPair={assetPair}
                        poolType={poolType}
                        spotPrice={spotPrice}
                        referenceSpotPrice={referenceSpotPrice}
                        granularity={granularity}
                        availableGranularity={availableGranularity}
                        onGranularityChange={onGranularityChange}
                        isUserBrowsingGraph={isUserBrowsingGraph}
                        displaySpotPrice={displaySpotPrice}
                        availableChartTypes={availableChartTypes}
                        chartType={chartType}
                    />

                    <TradeGraphChart
                        historicalSpotPrice={historicalSpotPrice}
                        isUserBrowsingGraph={isUserBrowsingGraph}
                        onUserBrowsingGraph={handleUserBrowsingGraph}
                        granularity={granularity}
                        displaySpotPrice={displaySpotPrice}
                        spotPrice={spotPrice}
                    />

                </div>
            </div>
        </div>
    </div>
}