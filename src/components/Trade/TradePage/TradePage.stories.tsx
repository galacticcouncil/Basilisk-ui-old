import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TradePage, TradePageProps } from './TradePage';
import tradeFormStory from './../TradeForm/TradeForm.stories';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
    title: 'components/Trade/TradePage',
    component: TradePage,
    args: {
        ...tradeFormStory.args
    },
} as ComponentMeta<typeof TradePage>

const Template: ComponentStory<typeof TradePage> = (args: TradePageProps) => {
    return <StorybookWrapper>
        <TradePage {...args} />
    </StorybookWrapper>
};

export const Default = Template.bind({});