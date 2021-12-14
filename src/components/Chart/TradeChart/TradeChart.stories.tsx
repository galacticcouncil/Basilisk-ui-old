import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { TradeChart, TradeChartProps } from './TradeChart';
import { AssetPair, ChartGranularity, ChartType, PoolType } from '../shared';
import {createDataset, assetPair} from '../mockDataset'
import { Story } from '@storybook/react';

const primaryDataset = createDataset(assetPair, 60);

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
        primaryDataset,
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