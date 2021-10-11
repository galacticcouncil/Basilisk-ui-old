import './../../shared/shared';
import './TradeGraphHeader.scss';
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

export interface Asset {
    symbol: string,
    fullName: string
}

export interface AssetPair {
    assetA: Asset,
    assetB: Asset
}

export enum PoolType {
    // provide a string value for the enum for storybook friendly-ness
    LBP = 'LBP',
    XYK = 'XYK'
}

export type SpotPriceBalance = number;
export interface SpotPrice {
    balance: SpotPriceBalance,
    blockHeight: number,
    usdBalance: number,
    asset: Asset,
    timestamp: number
}

export enum TradeGraphGranularity {
    // ALL = 'ALL',
    D30 = 'D30',
    D7 = 'D7',
    H24 = 'H24',
    H1 = 'H1'
}

export enum TradeGraphChartTypes {
    PRICE = 'PRICE',
    VOLUME = 'VOLUME',
    WEIGHTS = 'WEIGHT'
}

export interface TradeGraphHeaderProps {
    assetPair: AssetPair,
    poolType: PoolType,
    spotPrice: SpotPrice,
    referenceSpotPrice: SpotPrice,
    availableGranularity: TradeGraphGranularity[],
    granularity: TradeGraphGranularity,
    availableChartTypes: TradeGraphChartTypes[],
    chartType: TradeGraphChartTypes,
    isUserBrowsingGraph: boolean,
    displaySpotPrice: SpotPrice,
    onGranularityChange: (granularity: TradeGraphGranularity) => null,
    onChartTypeChange: (chartType: TradeGraphChartTypes) => null
}

export const TradeGraphHeader: React.FC<TradeGraphHeaderProps> = ({
    assetPair,
    poolType,
    spotPrice,
    referenceSpotPrice,
    availableGranularity,
    granularity,
    availableChartTypes,
    chartType,
    onGranularityChange,
    onChartTypeChange,
    isUserBrowsingGraph,
    displaySpotPrice
}) => {
    const intl = useIntl();

    /**
     * Header
     */
    const formatGranularity = (granularity: TradeGraphGranularity) => (
        <FormattedMessage
            id="TradeGraph.granularity.selector"
            defaultMessage="{granularity, select, ALL {ALL} D30 {30D} D7 {7D} D3 {3D} H24 {24H} H12 {12H} H1 {1H} other {-}}"
            values={{ granularity: granularity }}
        />
    )

    const formatChartType = (chartType: TradeGraphChartTypes) => (
        <FormattedMessage
            id="TradeGraph.chartType.selector"
            defaultMessage="{chartType, select, PRICE {PRICE} VOLUME {VOLUME} WEIGHTS {WEIGHT} other {-}}"
            values={{ chartType: chartType }}
        />
    )

    // TODO: refactor into formatPoolType
    const poolTypeLabel = (() => {
        switch (poolType) {
            case PoolType.LBP:
                return intl.formatMessage({
                    id: 'TradeGraph.poolTypeLabel.LBP',
                    defaultMessage: 'LBP',
                });
            case PoolType.XYK:
                return intl.formatMessage({
                    id: 'TradeGraph.poolTypeLabel.XYK',
                    defaultMessage: 'XYK',
                });
            default:
                return ''
        }
    })();

    // TODO: do the math in big number instead?
    /**
     * Percentage change shows the % change from the current spot price
     * to the highlighted spot price (on the graph).
     */
    const spotPricePercentageChange = useMemo(() => {
        return percentageChange(referenceSpotPrice.balance, displaySpotPrice.balance);
    }, [
        displaySpotPrice.balance,
        referenceSpotPrice.balance,
        spotPrice.balance,
        isUserBrowsingGraph
    ]);

    const formattedSpotPricePercentageChange = useMemo(() => (
        intl.formatNumber(
            spotPricePercentageChange,
            {
                style: 'percent',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }
        )
    ), [spotPricePercentageChange])

    const formattedSpotPrice = useMemo(() => (
        <FormattedNumber
            value={displaySpotPrice.balance}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
            style='decimal'

        />
    ), [displaySpotPrice])

    const determineNotation = (value: number) => value > 100000 ? 'compact' : 'standard'

    const formattedUsdSpotPrice = useMemo(() => (
        <FormattedNumber
            value={displaySpotPrice.usdBalance}
            style='currency'
            currency='USD'
            notation={determineNotation(displaySpotPrice.usdBalance)}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
        />
    ), [displaySpotPrice])

    const handleGranulityChange = (granularity: TradeGraphGranularity) => {
        onGranularityChange(granularity);
    };

    return (
        <div className='row g-0 trade-graph__header'>
            <div className="col-12">
                <div className="row g-0">
                    <div className='col-6'>

                        <div className="row g-0 align-items-center">
                            {/* pair symbols */}
                            <div className='col-xs-auto text-white-1 trade-graph__header__pair-symbols'>
                                <p>
                                    {`${assetPair.assetA.symbol} / ${assetPair.assetB.symbol}`}
                                </p>
                            </div>

                            {/* TODO: add tooltip after the component is implemented */}
                            <div className="col text-gray-4 trade-graph__header__type-label">
                                [{poolTypeLabel}]
                            </div>

                        </div>

                        <div className="row g-0">
                            {/* Pair full names */}
                            <div className='text-gray-4 trade-graph__header__pair-full-names'>
                                <p>
                                    {`${assetPair.assetA.fullName} / ${assetPair.assetB.fullName}`}
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className='col-6 text-end'>
                        <div className='text-white-1 trade-graph__header__spot-price'>
                            <div className='row g-0'>
                                <div className='trade-graph__header__spot-price__in-asset'>
                                    {/* TODO: add guards for symbol length */}
                                    {/* TODO: add abbreviations for spot price */}
                                    {formattedSpotPrice} {spotPrice.asset.symbol}
                                </div>
                                <div className='trade-graph__header__spot-price__breakdown'>
                                    <span className='text-gray-4'>
                                        ~{formattedUsdSpotPrice}
                                    </span>

                                    <span className={classNames({
                                        "text-green-1": spotPricePercentageChange > 0,
                                        "text-gray-4": spotPricePercentageChange === 0,
                                        "text-red-1": spotPricePercentageChange < 0
                                    })}>
                                        (
                                        {spotPricePercentageChange > 0 ? '+' : ''}
                                        {formattedSpotPricePercentageChange}
                                        )
                                    </span>

                                    <span className={"text-gray-4 trade-graph__header__spot-price__breakdown__granularity " + classNames({
                                        "disabled": isUserBrowsingGraph
                                    })}>
                                        <FormattedMessage
                                            id="TradeGraph.granularity.pastIndicator"
                                            defaultMessage="Past"
                                        /> {" "} {formatGranularity(granularity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-0 trade-graph__header__controls">

                    {/* graph selector */}
                    <div className="col-6">
                        <div className="trade-graph__header__controls__graph-type text-gray-4 text-start">

                            {/* TODO: add translations & granularity enums & on graph type handler */}
                            {/* for now only price chart is available */}
                            {availableChartTypes.map((chartTypeEntry, i) => (
                                <span 
                                    className={classNames({
                                        "trade-graph__header__controls__graph-type__individual": true,
                                        'active': chartTypeEntry === chartType,
                                        'disabled': chartTypeEntry !== chartType
                                    })}
                                    onClick={_ => onChartTypeChange(chartTypeEntry)}
                                >
                                    {formatChartType(chartTypeEntry)}
                                </span>
                            ))}

                        </div>
                    </div>

                    {/* granularity selector */}
                    <div className="col-6">
                        <div className="trade-graph__header__controls__granularity text-end text-gray-4">

                            {availableGranularity.map((granularityEntry, i) => {
                                return <span
                                    className={classNames({
                                        "trade-graph__header__controls__granularity__individual": true,
                                        'active': granularityEntry === granularity,
                                    })}
                                    onClick={_ => handleGranulityChange(granularityEntry)}
                                    key={i}
                                >
                                    {formatGranularity(granularityEntry)}
                                </span>
                            })}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}