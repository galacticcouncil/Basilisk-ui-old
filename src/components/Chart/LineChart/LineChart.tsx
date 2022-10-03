import {
  Chart as ChartJS,
  ChartArea,
  ChartData,
  ChartDataset,
  ChartOptions,
  Tooltip,
  TooltipModel
} from 'chart.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import cssColors from './../../../misc/colors.module.scss'
import './LineChart.scss'
import { first, orderBy, last } from 'lodash'
import 'chart.js/auto'

export type DataPoint = {
  x: number
  y: number
  yAsString?: string
}

export type Dataset = DataPoint[]

export enum Trend {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral'
}

export type TooltipData = {
  data: DataPoint
  positionX: number
  visible: boolean
}

export type OnHandleTooltip = (
  tooltipData: TooltipData | undefined
) => void | undefined
export type TooltipHandler = ({
  tooltip
}: {
  tooltip: TooltipModel<'line'>
}) => void

export interface LineChartProps {
  primaryDataset: Dataset
  secondaryDataset?: Dataset
  trend: Trend
  tradeChartType: TradeChartType
  onHandleTooltip: OnHandleTooltip
}

export enum TradeChartType {
  LBP,
  XYK
}

// determine if the given dataset is primary, based on its label
export const primaryDatasetLabel = 'primary'
export const secondaryDatasetLabel = 'secondary'
export const isPrimaryDataset = (label: string) => label === primaryDatasetLabel

// used when a positive trend is observed in the data
export const greenBackgroundGradient = (chart: ChartJS) => {
  var gradient = chart.ctx.createLinearGradient(0, 0, 0, 270)
  gradient?.addColorStop(0, cssColors.green1Opacity33)
  gradient?.addColorStop(1, cssColors.gray2Opacity0)
  return gradient
}

// used when a negative trend is observed in the data
export const redBackgroundGradient = (chart: ChartJS) => {
  var gradient = chart.ctx.createLinearGradient(0, 0, 0, 270)
  gradient?.addColorStop(0, cssColors.red1Opacity70)
  gradient?.addColorStop(1, cssColors.gray2Opacity0)
  return gradient
}

// Store these so we don't repaint always
let width: number
let height: number
let gradient: CanvasGradient
export const lbpLineGradient = (
  chartCtx: CanvasRenderingContext2D,
  chartArea: ChartArea
) => {
  const chartWidth = chartArea.right - chartArea.left
  const chartHeight = chartArea.bottom - chartArea.top
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    width = chartWidth
    height = chartHeight
    gradient = chartCtx.createLinearGradient(
      chartArea.left,
      0,
      chartArea.right,
      0
    )
    gradient.addColorStop(0, '#FF984E')
    gradient.addColorStop(0.5, '#B3FF8F')
    gradient.addColorStop(1, '#4FFFB0')
  }

  return gradient
}

// heleper function grouping the available gradients
export const backgroundGradients = (chart: ChartJS) => {
  return {
    redGradient: redBackgroundGradient(chart),
    greenGradient: greenBackgroundGradient(chart)
  }
}

// transforms the given simple dataset into a format accepted by chartjs
export const useFormatDataset = ({
  trend,
  chart,
  tradeChartType
}: {
  trend: Trend
  chart: ChartJS | null
  tradeChartType: TradeChartType
}) =>
  useCallback(
    ({ dataset, label }): ChartDataset<'line', DataPoint[]> => {
      if (!chart) return { data: dataset }
      return {
        label,
        data: dataset,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: () => {
          if (!isPrimaryDataset(label)) return [3, 4]
          else return []
        },
        borderColor: (() => {
          // secondary dataset is always orange
          if (!isPrimaryDataset(label)) return cssColors.green1

          if (tradeChartType === TradeChartType.XYK) {
            // border color of the primary dataset depends on the data trend
            switch (trend) {
              case Trend.Negative:
                return cssColors.red1
              default:
                return cssColors.green1
            }
          } else {
            const { ctx, chartArea } = chart

            if (!chartArea) {
              // This case happens on initial chart load
              return
            }

            return lbpLineGradient(ctx, chartArea)
          }
        })(),
        backgroundColor: (() => {
          if (tradeChartType === TradeChartType.XYK) {
            const { redGradient, greenGradient } = backgroundGradients(chart)
            switch (trend) {
              case Trend.Negative:
                return redGradient
              default:
                return greenGradient
            }
          } else {
            return 'transparent'
          }
        })()
      }
    },
    [trend, chart, tradeChartType]
  )

export const useTooltipHandler = (
  tooltipData: TooltipData | undefined,
  setTooltipData: (tooltipData: TooltipData) => void
) =>
  useCallback<TooltipHandler>(
    ({ tooltip }) => {
      const visible = tooltip.opacity ? true : false
      const { x, y } = tooltip?.dataPoints[0].parsed
      const positionX = tooltip.caretX

      if (x === tooltipData?.data.x && visible === tooltipData.visible) return

      setTooltipData({
        data: { x, y },
        positionX,
        visible
      })
    },
    [tooltipData, setTooltipData]
  )

export const LineChart = ({
  primaryDataset,
  secondaryDataset = [],
  tradeChartType,
  trend,
  onHandleTooltip
}: LineChartProps) => {
  const [tooltipData, setTooltipData] = useState<TooltipData | undefined>(
    undefined
  )
  const tooltipHandler = useTooltipHandler(tooltipData, setTooltipData)

  useEffect(() => onHandleTooltip(tooltipData), [tooltipData])

  const chartContainer = useRef<ChartJS>(null)

  const chart = chartContainer.current

  const formatDataset = useFormatDataset({
    trend,
    chart,
    tradeChartType
  })

  const formattedPrimaryDataset = formatDataset({
    dataset: primaryDataset,
    label: primaryDatasetLabel
  })

  const formattedSecondaryDataset = formatDataset({
    dataset: secondaryDataset,
    label: secondaryDatasetLabel
  })

  const chartData = useMemo<ChartData<'line', DataPoint[]>>(() => {
    const datasets = formattedSecondaryDataset
      ? [formattedPrimaryDataset, formattedSecondaryDataset]
      : [formattedPrimaryDataset]

    return {
      labels: [],
      datasets
    }
  }, [formattedPrimaryDataset, formattedSecondaryDataset])

  // find the smallest data point, scale it down and use it as the chart xAxisMin
  // this is necessary otherwise the gradient wont render correctly (?)
  const yAxisBounds = useMemo(() => {
    const datasets = [primaryDataset, secondaryDataset]
    // compose all datasets into one
    let allData = datasets.reduce(
      (allData, dataset) => allData.concat(dataset),
      []
    )
    allData = orderBy(allData, ['y'], ['asc'])

    const smallestDatapoint = first(allData)?.y || 0
    const largestDatapoint = last(allData)?.y || 0
    const dataScale = largestDatapoint - smallestDatapoint
    type YAxisBounds = {
      yAxisMin: number | undefined
      yAxisMax: number | undefined
    }
    const yAxisBounds: YAxisBounds = {
      yAxisMin: undefined,
      yAxisMax: undefined
    }
    if (dataScale) {
      yAxisBounds.yAxisMax = largestDatapoint + dataScale * 0.01
    }
    return yAxisBounds
  }, [primaryDataset, secondaryDataset])

  const xAxisBounds = useMemo(() => {
    const xAxisMin = primaryDataset[0].x
    const xAxisMax = primaryDataset[primaryDataset.length - 1].x
    return { xAxisMin, xAxisMax }
  }, [primaryDataset])

  const chartOptions = useMemo<ChartOptions>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      borderCapStyle: 'round',
      cubicInterpolationMode: 'monotone',
      spanGaps: true,
      borderColor: function (context) {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          // This case happens on initial chart load
          return
        }
        return lbpLineGradient(ctx, chartArea)
      },
      //bezierCurve: true,
      datasets: {
        line: {
          pointRadius: 0
        }
      },

      layout: {
        padding: {
          left: 12
        }
      },

      backgroundColor: 'transparent',

      scales: {
        xAxis: {
          display: false,
          stacked: false,
          grid: { display: false },

          type: 'time',
          time: {
            tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
            displayFormats: { hour: 'HH:mm', day: 'HH:mm', minute: 'HH:mm' }
          },
          //offset: true,
          min: xAxisBounds.xAxisMin,
          to: xAxisBounds.xAxisMax
        },
        yAxis: {
          position: 'right',
          display: true,
          type: 'linear',
          grid: { display: false },
          offset: true,
          ticks: {
            color: 'white',
            maxTicksLimit: 8,
            align: 'end',
            crossAlign: 'center',
            font: {
              family: 'Satoshi',
              size: 12
            }
          },
          stacked: false,
          min: yAxisBounds.yAxisMin,
          max: yAxisBounds.yAxisMax ? yAxisBounds.yAxisMax : undefined
        }
      },
      animations: {
        colors: false
      },
      hover: {
        intersect: true
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          mode: 'nearest',
          intersect: false,
          axis: 'x',
          position: 'nearest',
          external: tooltipHandler as any
        }
      }
    }
  }, [tooltipHandler, yAxisBounds])

  return (
    <div className="line-chart">
      <Chart
        type="line"
        ref={chartContainer}
        data={chartData}
        // TODO: after updating the yarn.lock the types here are broken, fix it
        options={chartOptions as any}
      />
    </div>
  )
}
