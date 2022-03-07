import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChartTicks } from '../ChartTicks/ChartTicks';
import {
  LineChart,
  Trend,
  Dataset,
  primaryDatasetLabel,
  TooltipData,
} from '../LineChart/LineChart';
import {
  AssetPair,
  ChartGranularity,
  PoolType,
  ChartType,
  DisplayData,
} from '../shared';
import { ChartHeader } from './../ChartHeader/ChartHeader';
import './TradeChart.scss';
import moment from 'moment';
import { TradeChartError, TradeChartErrorType } from './TradeChartError';
import { find, first, last, random, times } from 'lodash';

// this function is absolutely hacky
export const _getTooltipPositionCss = (tooltipPosition: number) => {
  // TODO: use a more specific selector
  const tooltipWidth = 120;
  const canvasWidth = document
    .getElementsByTagName('canvas')[0]
    ?.getBoundingClientRect().width;
  if (tooltipPosition < tooltipWidth)
    return {
      left: 0,
    };

  if (canvasWidth && tooltipPosition > canvasWidth - tooltipWidth)
    return {
      right: 0,
    };

  return {
    left: tooltipPosition - tooltipWidth,
  };
};

export interface TradeChartProps {
  assetPair: AssetPair;
  poolType: PoolType;
  isPoolLoading?: boolean;
  granularity: ChartGranularity;
  chartType: ChartType;
  primaryDataset: Dataset;
  onChartTypeChange: (chartType: ChartType) => void;
  onGranularityChange: (granularity: ChartGranularity) => void;
}

export const TradeChart = ({
  assetPair,
  poolType,
  granularity,
  isPoolLoading,
  chartType,
  onChartTypeChange,
  onGranularityChange,
  primaryDataset,
}: TradeChartProps) => {
  const [displayData, setDisplayData] = useState<DisplayData>({
    balance: last(primaryDataset)?.yAsString,
    // TODO; usd value of the balance needs to be determined separately
    // concept of a rich dataset, boil it down to x/y for the linechart
    // and persist usd balances etc at a higher level
    usdBalance: last(primaryDataset)?.yAsString,
    // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
    asset: {
      symbol: assetPair.assetB?.symbol,
      fullName: assetPair.assetB?.fullName,
    },
  });

  const resetDisplayData = useCallback(() => {
    setDisplayData({
      balance: last(primaryDataset)?.yAsString,
      // TODO; usd value of the balance needs to be determined separately
      // concept of a rich dataset, boil it down to x/y for the linechart
      // and persist usd balances etc at a higher level
      usdBalance: last(primaryDataset)?.yAsString,
      // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
      asset: {
        symbol: assetPair.assetB?.symbol,
        fullName: assetPair.assetB?.fullName,
      },
    });
    setReferenceData({
      balance: first(primaryDataset)?.yAsString,
      // TODO; usd value of the balance needs to be determined separately
      // concept of a rich dataset, boil it down to x/y for the linechart
      // and persist usd balances etc at a higher level
      usdBalance: first(primaryDataset)?.yAsString,
      // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
      asset: {
        symbol: assetPair.assetB?.symbol,
        fullName: assetPair.assetB?.fullName,
      },
    });
  }, [primaryDataset]);

  // TODO: temporary
  useEffect(() => {
    resetDisplayData();
  }, [assetPair]);

  // TODO: set reference data based on if the user is interacting with the graph
  // if the user is not interacting with the graph, reference data should be
  const [referenceData, setReferenceData] = useState<DisplayData | undefined>({
    balance: first(primaryDataset)?.yAsString,
    // TODO; usd value of the balance needs to be determined separately
    // concept of a rich dataset, boil it down to x/y for the linechart
    // and persist usd balances etc at a higher level
    usdBalance: first(primaryDataset)?.yAsString,
    // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
    asset: {
      symbol: assetPair.assetB?.symbol,
      fullName: assetPair.assetB?.fullName,
    },
  });

  const getTooltipPositionCss = useCallback(_getTooltipPositionCss, []);
  const [tooltipData, setTooltipData] = useState<TooltipData | undefined>(
    undefined
  );

  // TODO: rewrite
  const dataTrend = useMemo(() => {
    if (displayData?.balance! == referenceData?.balance!) return Trend.Neutral;
    return displayData?.balance! >= referenceData?.balance!
      ? Trend.Positive
      : Trend.Negative;
  }, [displayData, referenceData]);

  // TODO: set trend based on tooltip data
  // useEffect(() => {
  //   // tooltipData?.data.x < referenceData.
  //   if (!tooltipData) return;
  //   setReferenceData({
  //     ...displayData,
  //     balance: tooltipData?.data.y,
  //     // TODO; usd value of the balance needs to be determined separately
  //     // concept of a rich dataset, boil it down to x/y for the linechart
  //     // and persist usd balances etc at a higher level
  //     usdBalance: tooltipData?.data.y,
  //     // TODO: display data will be in USD for volume chart, this needs to be implemented specifically
  //   });
  // }, [tooltipData, displayData]);

  useEffect(() => {
    if (tooltipData) return;
    setReferenceData({
      ...referenceData!,
      balance: first(primaryDataset)?.yAsString,
      usdBalance: first(primaryDataset)?.yAsString,
    });
  }, [primaryDataset]);

  const handleTooltip = useCallback(
    (tooltipData: TooltipData | undefined) => {
      setTooltipData(tooltipData);

      if (tooltipData?.visible) {
        const datasets = [primaryDataset];
        const allData = datasets.reduce(
          (allData, dataset) => allData.concat(dataset),
          []
        );

        const displayDataTooltip = find(allData, {
          x: tooltipData?.data.x,
          y: tooltipData?.data.y,
        });

        if (displayDataTooltip)
          setDisplayData((displayData) => ({
            ...displayData!,
            balance: displayDataTooltip?.yAsString,
          }));
        setReferenceData((referenceData) => {
          return {
            ...referenceData!,
            balance: last(primaryDataset)?.yAsString,
          };
        });
      } else {
        resetDisplayData();
      }
    },
    [setTooltipData, primaryDataset, displayData, referenceData]
  );

  const availableChartTypes = useMemo(
    () => [ChartType.PRICE, ChartType.VOLUME, ChartType.WEIGHTS],
    []
  );

  const availableGranularity = useMemo(
    () => [
      ChartGranularity.D30,
      ChartGranularity.D7,
      ChartGranularity.H24,
      ChartGranularity.H1,
    ],
    []
  );

  const { from, to } = useMemo(() => {
    const from = moment().subtract(24, 'hours').valueOf();
    const to = last(primaryDataset)?.x;

    return { from, to };
  }, [granularity, primaryDataset]);

  return (
    <div className="trade-chart">
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

      {primaryDataset?.length ? (
        <div className="trade-chart__chart-wrapper">
          <div className="trade-chart__chart-wrapper__chart-jail">
            <LineChart
              primaryDataset={primaryDataset}
              fill={true}
              trend={dataTrend}
              from={from}
              to={to}
              onHandleTooltip={handleTooltip}
            />
            {tooltipData?.positionX ? (
              <div>
                <div
                  className="trade-chart__tooltip"
                  style={{
                    left: `${tooltipData.positionX}px`,
                    opacity: tooltipData.visible ? 1 : 0,
                  }}
                ></div>
                <div
                  className="trade-chart__tooltip__label"
                  style={{
                    ...getTooltipPositionCss(tooltipData.positionX!),
                    opacity: tooltipData.visible ? 1 : 0,
                  }}
                >
                  {tooltipData.data?.x ? (
                    //TODO: format using intl
                    moment(new Date(tooltipData.data.x)).toString()
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <ChartTicks datasets={[primaryDataset]} granularity={granularity} />
        </div>
      ) : (
        <></>
      )}

      {/* {isPoolLoading
          ? (
            <div className="trade-chart__error-wrapper">
              <TradeChartError type={TradeChartErrorType.InvalidPair} />
            </div>
          )
          : (
            !primaryDataset?.length? (
              <div className="trade-chart__error-wrapper">
                <TradeChartError type={TradeChartErrorType.InvalidPair} />
              </div>
            ) : (
              <></>
            )
          )} */}

      {!primaryDataset?.length ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.InvalidPair} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
