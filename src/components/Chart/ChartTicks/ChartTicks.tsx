import { first, last, orderBy, times } from 'lodash'
import { useMemo } from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'
import { Dataset } from './../LineChart/LineChart'
import './ChartTicks.scss'
import { ChartGranularity } from './../shared'

const middleTicksHour = 6
const middleTicksDay = 1
export const generateMiddleTicks = (
  firstTick: number,
  lastTick: number,
  granularity: ChartGranularity
) => {
  const middleTicks =
    granularity === ChartGranularity.H1 ? middleTicksHour : middleTicksDay
  const dateRange = lastTick - firstTick
  const distance = dateRange / middleTicks + 1
  return times(middleTicks).map((_, i) => {
    return firstTick + distance * (i + 1)
  })
}

export const formatTick = (tick: number, granularity: ChartGranularity) => {
  const tickDate = new Date(tick)

  const asTime = <FormattedTime hourCycle="h24" value={tickDate} />

  const asDate = <FormattedDate month="short" day="2-digit" value={tickDate} />

  switch (granularity) {
    case ChartGranularity.D30:
      return asDate

    case ChartGranularity.D7:
      return asDate

    case ChartGranularity.H24:
      return asDate

    case ChartGranularity.H1:
      return asTime
  }
}

export const ChartTicks = ({
  datasets,
  granularity
}: {
  datasets: Dataset[]
  granularity: ChartGranularity
}) => {
  const ticks = useMemo(() => {
    // compose all datasets into one
    let allData = datasets[0].concat(datasets[1])

    // order the datasets by time
    allData = orderBy(allData, ['x'], ['asc'])

    // find the first/last datapoints from the dataset
    const firstTick = first(allData)?.x
    const lastTick = last(allData)?.x

    // if we don't have a stard and an end, show nothing
    if (!firstTick || !lastTick) return

    let ticks = [firstTick]
    const middleTicks = generateMiddleTicks(firstTick, lastTick, granularity)

    ticks = ticks.concat(middleTicks)
    ticks.push(lastTick)

    return ticks
  }, [datasets])

  const formattedTicks = useMemo(
    () => ticks?.map((tick) => formatTick(tick, granularity)),
    [ticks, granularity]
  )

  return (
    <div
      className={`chart-ticks ${
        granularity === ChartGranularity.H1 ? 'hour' : 'day'
      }`}
    >
      {formattedTicks?.map((formattedTick, i) => (
        <div key={i}>
          <div>{formattedTick}</div>
        </div>
      ))}
    </div>
  )
}
