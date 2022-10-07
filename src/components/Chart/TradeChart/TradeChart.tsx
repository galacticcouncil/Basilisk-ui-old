import { find, first, last } from 'lodash'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LbpStatus } from '../../../pages/TradePage/LBPPage'
import { ChartTicks } from '../ChartTicks/ChartTicks'
import {
  Dataset,
  LineChart,
  TooltipData,
  TradeChartType,
  Trend
} from '../LineChart/LineChart'
import {
  AssetPair,
  ChartGranularity,
  ChartType,
  DisplayData,
  PoolType
} from '../shared'
import { ChartHeader } from './../ChartHeader/ChartHeader'
import './TradeChart.scss'
import { TradeChartError, TradeChartErrorType } from './TradeChartError'

// this function is absolutely hacky
export const _getTooltipPositionCss = (tooltipPosition: number) => {
  // TODO: use a more specific selector
  const tooltipWidth = 120
  const canvasWidth = document
    .getElementsByTagName('canvas')[0]
    ?.getBoundingClientRect().width
  if (tooltipPosition < tooltipWidth)
    return {
      left: 0
    }

  if (canvasWidth && tooltipPosition > canvasWidth - tooltipWidth)
    return {
      right: 0
    }

  return {
    left: tooltipPosition - tooltipWidth
  }
}

export interface LbpChartProps {
  startBlock: number
  endBlock: number
  timeToNextPhase?: string
}

export interface TradeChartProps {
  assetPair: AssetPair
  poolType: PoolType
  isPoolLoading?: boolean
  granularity: ChartGranularity
  chartType: ChartType
  lbpStatus?: LbpStatus
  visible: boolean
  lbpChartProps?: LbpChartProps
  primaryDataset: Dataset
  secondaryDataset: Dataset
  onChartTypeChange: (chartType: ChartType) => void
  onGranularityChange: (granularity: ChartGranularity) => void
}

export const TradeChart = ({
  assetPair,
  poolType,
  granularity,
  isPoolLoading,
  visible,
  chartType,
  lbpStatus,
  lbpChartProps,
  onChartTypeChange,
  onGranularityChange,
  primaryDataset,
  secondaryDataset
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
      id: assetPair.assetB?.id
    }
  })

  const [predictionToggled, setPrediction] = useState(true)

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
        id: assetPair.assetB?.id
      }
    })
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
        id: assetPair.assetB?.id
      }
    })
  }, [primaryDataset])

  // TODO: temporary
  useEffect(() => {
    resetDisplayData()
  }, [assetPair])

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
      fullName: assetPair.assetB?.fullName
    }
  })

  const getTooltipPositionCss = useCallback(_getTooltipPositionCss, [])
  const [tooltipData, setTooltipData] = useState<TooltipData | undefined>(
    undefined
  )

  // TODO: rewrite
  const dataTrend = useMemo(() => {
    if (displayData?.balance! == referenceData?.balance!) return Trend.Neutral
    return displayData?.balance! >= referenceData?.balance!
      ? Trend.Positive
      : Trend.Negative
  }, [displayData, referenceData])

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
    if (tooltipData) return
    setReferenceData({
      ...referenceData!,
      balance: first(primaryDataset)?.yAsString,
      usdBalance: first(primaryDataset)?.yAsString
    })
  }, [primaryDataset, secondaryDataset])

  const handleTooltip = useCallback(
    (tooltipData: TooltipData | undefined) => {
      setTooltipData(tooltipData)

      if (tooltipData?.visible) {
        const allData = primaryDataset.concat(secondaryDataset)

        const displayDataTooltip = find(allData, {
          x: tooltipData?.data.x,
          y: tooltipData?.data.y
        })

        if (displayDataTooltip)
          setDisplayData((displayData) => ({
            ...displayData!,
            balance: displayDataTooltip?.yAsString
          }))
        setReferenceData((referenceData) => {
          return {
            ...referenceData!,
            balance: last(primaryDataset)?.yAsString
          }
        })
      } else {
        resetDisplayData()
      }
    },
    [
      setTooltipData,
      primaryDataset,
      secondaryDataset,
      displayData,
      referenceData
    ]
  )

  const availableChartTypes = useMemo(
    () => [ChartType.PRICE, ChartType.VOLUME, ChartType.WEIGHTS],
    []
  )

  const availableGranularity = useMemo(
    () => [
      ChartGranularity.D30,
      ChartGranularity.D7,
      ChartGranularity.H24,
      ChartGranularity.H1
    ],
    []
  )

  const allData = primaryDataset.concat(secondaryDataset)

  return (
    <div className={'trade-chart' + (visible ? '' : ' hidden')}>
      <ChartHeader
        assetPair={assetPair}
        poolType={poolType}
        granularity={granularity}
        chartType={chartType}
        predictionToggled={predictionToggled}
        lbpStatus={lbpStatus}
        lbpChartProps={lbpChartProps}
        onChartPredictionChange={setPrediction}
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
              secondaryDataset={predictionToggled ? secondaryDataset : []}
              tradeChartType={
                poolType === PoolType.XYK
                  ? TradeChartType.XYK
                  : TradeChartType.LBP
              }
              trend={dataTrend}
              onHandleTooltip={handleTooltip}
            />
            {tooltipData?.positionX ? (
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
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <ChartTicks
            dataset={predictionToggled ? allData : primaryDataset}
            granularity={ChartGranularity.H1}
          />

          <ChartTicks
            dataset={predictionToggled ? allData : primaryDataset}
            granularity={ChartGranularity.H24}
          />

          <hr className="divider"></hr>
          <div className="legend">
            <div className="legend__item ">
              <div className="line history"></div>
              <div className="label">Price history</div>
            </div>
            <div className="legend__item ">
              <div className="line prediction"></div>
              <div className="label">Future price without trades</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {isPoolLoading ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.Loading} />
        </div>
      ) : lbpStatus === LbpStatus.NOT_INITIALIZED ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.NotInitialized} />
        </div>
      ) : lbpStatus === LbpStatus.NOT_STARTED ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.NotStarted} />
        </div>
      ) : lbpStatus === LbpStatus.NOT_EXISTS ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.NotExists} />
        </div>
      ) : !primaryDataset?.length ? (
        <div className="trade-chart__error-wrapper">
          <TradeChartError type={TradeChartErrorType.InvalidPair} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
