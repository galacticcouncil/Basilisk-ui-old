import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { TradeChart, TradeChartProps } from './TradeChart';
import tradeFormStory from './../TradeForm/TradeForm.stories';

export default {
    title: 'components/Trade/TradeChart',
    component: TradeChart,
    args: {
        spotPrice: tradeFormStory.args?.spotPrice,
        poolLiquidity: {
            assetABalance: '100000000',
            assetBBalance: '200000000'
        }
    }
} as ComponentMeta<typeof TradeChart>

const Template: ComponentStory<typeof TradeChart> = (args: TradeChartProps) => {
    return <StorybookWrapper>
        <TradeChart {...args} />
    </StorybookWrapper>
}

export const Default = Template.bind({});