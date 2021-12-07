import { FormattedBalance, FormattedBalanceProps } from './FormattedBalance';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js'
import { toPrecision12 } from '../../../hooks/math/useToPrecision';
import { UnitStyle } from './metricUnit';

const args: FormattedBalanceProps = {
    balance: {
        assetId: '0',
        balance: toPrecision12('1123456')!
    },
    precision: 2,
    unitStyle: UnitStyle.LONG
}
export default {
    title: 'components/Balance/FormattedBalance',
    component: FormattedBalance,
    args
} as ComponentMeta<typeof FormattedBalance>

const Template: ComponentStory<typeof FormattedBalance> = (args: FormattedBalanceProps) => (
    <>
    {/* TODO: generate a better dataset */}
    {[
        '0.000000001',
        '0.000000012',
        '0.00000012',
        '0.0000012',
        '0.000012',
        '0.00012',
        '0.0012',
        '0.012',
        '0.01',
        '0.1',
        '1',
        '11',
        '112',
        '1123',
        '11231',
        '112312',
        '1123123',
        '11231231',
        '112312312',
        '1123123123',
        '11231231231',
        '112312312312',
        '12560.5',
    ].map(balance => (
        <div>
            <FormattedBalance 
                {...args} 
                balance={{
                    ...args.balance,
                    balance: toPrecision12(balance)!
                }}
            />
        </div>
    ))}
    </>
)

export const Default = Template.bind({})
