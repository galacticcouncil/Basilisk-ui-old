import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { FormattedBalance } from './FormattedBalance';

export default {
    title: 'components/FormattedBalance',
    component: FormattedBalance
}

const Template = () => {
    return <StorybookWrapper>
        <FormattedBalance balance={'199999999'} symbol={'BSX'} />
    </StorybookWrapper>
}

export const Default = Template.bind({})