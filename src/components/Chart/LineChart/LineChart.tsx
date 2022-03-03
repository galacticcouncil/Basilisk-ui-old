import { ChartData, ChartDataset, ChartOptions, TooltipModel } from 'chart.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import cssColors from './../../../misc/colors.module.scss';
import './LineChart.scss';
import { first, orderBy, last, difference } from 'lodash';
import 'chart.js/auto';

export type DataPoint = {
  x: number;
  y: number;
};

export type Dataset = DataPoint[];
export enum Trend {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export type TooltipData = {
  data: DataPoint;
  positionX: number;
  visible: boolean;
};

export type OnHandleTooltip = (
  tooltipData: TooltipData | undefined
) => void | undefined;
export type TooltipHandler = ({
  tooltip,
}: {
  tooltip: TooltipModel<'line'>;
}) => void;

export interface LineChartProps {
  primaryDataset: Dataset;
  secondaryDataset?: Dataset;
  from?: number;
  to?: number;
  fill?: boolean;
  trend: Trend;
  onHandleTooltip: OnHandleTooltip;
}

// determine if the given dataset is primary, based on its label
export const primaryDatasetLabel = 'primary';
export const secondaryDatasetLabel = 'secondary';
export const isPrimaryDataset = (label: string) =>
  label === primaryDatasetLabel;

// keep track of the chart/canvas drawing context to be able to render gradients
export const useChartCtx = () => {
  // extract chart context for advanced drawing (e.g. gradient)
  const chartContainer = useRef(null);
  const [chartCtx, setChartCtx] = useState<CanvasRenderingContext2D | null>(
    null
  );

  useEffect(() => {
    // TODO: extract the 2d context from `chartContainer` instead
    var ctx = document.getElementsByTagName('canvas')[0]?.getContext('2d');
    setChartCtx(ctx);
  }, [chartContainer]);

  return { chartContainer, chartCtx };
};

// used when a positive trend is observed in the data
export const greenBackgroundGradient = (
  chartCtx: CanvasRenderingContext2D | null
) => {
  var gradient = chartCtx?.createLinearGradient(0, 0, 0, 270);
  gradient?.addColorStop(0, cssColors.green1Opacity33);
  gradient?.addColorStop(1, cssColors.gray2Opacity0);
  return gradient;
};

// used when a negative trend is observed in the data
export const redBackgroundGradient = (
  chartCtx: CanvasRenderingContext2D | null
) => {
  var gradient = chartCtx?.createLinearGradient(0, 0, 0, 270);
  gradient?.addColorStop(0, cssColors.red1Opacity70);
  gradient?.addColorStop(1, cssColors.gray2Opacity0);
  return gradient;
};

// heleper function grouping the available gradients
export const backgroundGradients = (
  chartCtx: CanvasRenderingContext2D | null
) => {
  return {
    redGradient: redBackgroundGradient(chartCtx),
    greenGradient: greenBackgroundGradient(chartCtx),
  };
};

// transforms the given simple dataset into a format accepted by chartjs
export const useFormatDataset = ({
  fill,
  trend,
  chartCtx,
}: {
  fill: boolean;
  trend: Trend;
  chartCtx: CanvasRenderingContext2D | null;
}) =>
  useCallback(
    ({ dataset, label }): ChartDataset<'line', DataPoint[]> => {
      return {
        label,
        fill,
        data: dataset,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: (() => {
          // secondary dataset is always orange
          if (!isPrimaryDataset(label)) return cssColors.orange1;

          // border color of the primary dataset depends on the data trend
          switch (trend) {
            case Trend.Negative:
              return cssColors.red1;
            default:
              return cssColors.green1;
          }
        })(),
        backgroundColor: (() => {
          const { redGradient, greenGradient } = backgroundGradients(chartCtx);
          switch (trend) {
            case Trend.Negative:
              return redGradient;
            default:
              return greenGradient;
          }
        })(),
      };
    },
    [fill, trend, chartCtx]
  );

export const useTooltipHandler = (
  tooltipData: TooltipData | undefined,
  setTooltipData: (tooltipData: TooltipData) => void
) =>
  useCallback<TooltipHandler>(
    ({ tooltip }) => {
      const visible = tooltip.opacity ? true : false;
      const { x, y } = tooltip?.dataPoints[0].parsed;
      const positionX = tooltip.caretX;

      if (x === tooltipData?.data.x && visible === tooltipData.visible) return;

      setTooltipData({
        data: { x, y },
        positionX,
        visible,
      });
    },
    [tooltipData, setTooltipData]
  );

export const LineChart = ({
  primaryDataset,
  secondaryDataset = [],
  fill = false,
  from,
  to,
  trend,
  onHandleTooltip,
}: LineChartProps) => {
  const { chartContainer, chartCtx } = useChartCtx();
  const [tooltipData, setTooltipData] = useState<TooltipData | undefined>(
    undefined
  );
  const tooltipHandler = useTooltipHandler(tooltipData, setTooltipData);

  useEffect(() => onHandleTooltip(tooltipData), [tooltipData]);

  const formatDataset = useFormatDataset({ fill, trend, chartCtx });

  const formattedPrimaryDataset = formatDataset({
    dataset: primaryDataset,
    label: primaryDatasetLabel,
  });

  const formattedSecondaryDataset = formatDataset({
    dataset: secondaryDataset,
    label: secondaryDatasetLabel,
  });

  const chartData = useMemo<ChartData<'line', DataPoint[]>>(() => {
    const datasets = formattedSecondaryDataset
      ? [formattedPrimaryDataset, formattedSecondaryDataset]
      : [formattedPrimaryDataset];

    return {
      labels: [],
      datasets,
    };
  }, [formattedPrimaryDataset, formattedSecondaryDataset]);

  // find the smallest data point, scale it down and use it as the chart xAxisMin
  // this is necessary otherwise the gradient wont render correctly (?)
  const yAxisBounds = useMemo(() => {
    const datasets = [primaryDataset, secondaryDataset];
    // compose all datasets into one
    let allData = datasets.reduce(
      (allData, dataset) => allData.concat(dataset),
      []
    );
    allData = orderBy(allData, ['y'], ['asc']);

    const smallestDatapoint = first(allData)?.y || 0;
    const largestDatapoint = last(allData)?.y || 0;
    const dataScale = largestDatapoint - smallestDatapoint;
    console.log('DIFFFEERENCE', dataScale);
    type YAxisBounds = {
      yAxisMin: number | undefined;
      yAxisMax: number | undefined;
    };
    const yAxisBounds: YAxisBounds = {
      yAxisMin: undefined,
      yAxisMax: undefined,
    };
    if (dataScale) {
      yAxisBounds.yAxisMin = smallestDatapoint - dataScale * 0.1;
      yAxisBounds.yAxisMax = largestDatapoint + dataScale * 0.05;
    }
    return yAxisBounds;
  }, [primaryDataset, secondaryDataset]);

  const xAxisBounds = useMemo(() => {
    const xAxisMin = from;
    const xAxisMax = to;
    return { xAxisMin, xAxisMax };
  }, [from, to]);

  const chartOptions = useMemo<ChartOptions>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxis: {
          display: false,
          type: 'time',
          min: xAxisBounds.xAxisMin,
          to: xAxisBounds.xAxisMax,
        },
        yAxis: {
          display: false,
          stacked: false,
          min: yAxisBounds.yAxisMin,
          max: yAxisBounds.yAxisMax ? yAxisBounds.yAxisMax : undefined,
        },
      },
      animations: {
        colors: false,
      },
      hover: {
        intersect: true,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          mode: 'index',
          intersect: false,
          position: 'nearest',
          external: tooltipHandler as any,
        },
      },
    };
  }, [from, to, tooltipHandler, yAxisBounds]);

  return (
    <div className="line-chart">
      <Line
        ref={chartContainer}
        data={chartData}
        // TODO: after updating the yarn.lock the types here are broken, fix it
        options={chartOptions as any}
      />
    </div>
  );
};
