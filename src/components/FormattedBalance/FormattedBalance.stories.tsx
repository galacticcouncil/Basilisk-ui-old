import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { FormattedBalance } from './FormattedBalance';

export default {
    title: 'components/Balance/FormattedBalance',
    component: FormattedBalance,
    args: {
        value: 1234,
        precision: 12,
        decimals: 2
    }
}

const Template = (args: any) => {
    return <StorybookWrapper>
        <div style={{
            width: '380px'
        }}>
            <FormattedBalance {...args} />
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({})