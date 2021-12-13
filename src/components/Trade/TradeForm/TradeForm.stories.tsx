import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { TradeForm, TradeFormProps } from './TradeForm';

export default {
    title: 'components/Trade/TradeForm',
    component: TradeForm,
    args: {
        pool: {
            __typename: 'XYKPool',
            id: 'mock-pool',
            //  TODO: this should be assetA/assetB but it got renamed when i was doing replace-all earlier
            assetInId: '0',
            assetOutId: '1',
            balances: [
                { assetId: '0', balance: '100000000000000'},
                { assetId: '1', balance: '200000000000000'}
            ]
        },
        loading: false,
        // TODO: provide a real spot price from the balances above
        spotPrice: {
            aToB: '100000000000',
            bToA: '200000000000'
        },
        assetIds: {
            assetInId: '0',
            assetOutId: '1',
        }
    }
} as ComponentMeta<typeof TradeForm>

const Template: ComponentStory<typeof TradeForm> = (args: TradeFormProps) => {
    return <StorybookWrapper>
        <TradeForm {...args}/>
    </StorybookWrapper>
}

export const Default = Template.bind({});

