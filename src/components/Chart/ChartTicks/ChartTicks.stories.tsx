import { addMinutes } from 'date-fns/esm'
import subMinutes from 'date-fns/subMinutes'
import { random, times } from 'lodash'
import { StorybookWrapper } from '../../../misc/StorybookWrapper'
import { ChartTicks } from './ChartTicks'
import { ChartGranularity } from './../shared'
import cssColors from './../../../misc/colors.module.scss'

const now = Date.now()
const hourAgo = subMinutes(now, 60)
const demoDataCount = 60
const jointValue = 3
const randomDataPoint = () => random(1, 5)
const datasets = {
  primaryDataset: times(demoDataCount).map((i) => ({
    x: addMinutes(hourAgo, (i + 1) * 10),
    y: i == demoDataCount - 1 ? jointValue : randomDataPoint()
  })),
  secondaryDataset: times(demoDataCount).map((i) => ({
    x: addMinutes(now, i * 10),
    y: i === 0 ? jointValue : randomDataPoint()
  }))
}

export default {
  title: 'Components/Chart/ChartTicks',
  component: ChartTicks,
  args: {
    datasets: [datasets.primaryDataset, datasets.secondaryDataset],
    granularity: ChartGranularity.H1
  }
}

const Template = (args: any) => (
  <StorybookWrapper>
    <div
      style={{
        backgroundColor: cssColors.gray2
      }}
    >
      <ChartTicks {...args} />
    </div>
  </StorybookWrapper>
)

export const Default = Template.bind({})
