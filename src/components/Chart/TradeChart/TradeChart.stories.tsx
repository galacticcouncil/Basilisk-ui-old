import { Story } from '@storybook/react'
import { StorybookWrapper } from '../../../misc/StorybookWrapper'
import { assetPair, createDataset } from '../mockDataset'
import { ChartGranularity, ChartType, PoolType } from '../shared'
import { TradeChart, TradeChartProps } from './TradeChart'

const primaryDataset = createDataset(assetPair, 60)

export default {
  title: 'Components/Chart/TradeChart',
  component: TradeChart,
  args: {
    assetPair,
    poolType: PoolType.LBP,
    chartType: ChartType.PRICE,
    granularity: ChartGranularity.H1,
    displayData: {
      balance: 400,
      usdBalance: 400,
      asset: {
        symbol: 'kUSD',
        fullName: 'Karura US Dollar'
      }
    },
    primaryDataset
  }
}

const Template: Story<TradeChartProps> = (args) => (
  <StorybookWrapper>
    <TradeChart {...args} />
  </StorybookWrapper>
)

export const Default = Template.bind({})
export const NoData = Template.bind({})
NoData.args = {
  primaryDataset: undefined
}
