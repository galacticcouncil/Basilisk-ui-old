import { StorybookWrapper } from '../shared/StorybookWrapper';
import { TradePage } from './TradePage';
import cssColors from './../shared/colors.module.scss';

export default {
    title: 'Pages/Trade/TradePage',
    component: TradePage
}

const Template = (args: any) => {
    return <StorybookWrapper>
        <div style={{
            background: 'linear-gradient(90deg, rgba(66,66,80,1) 61%, rgba(55,55,65,1) 100%)',
            paddingTop: '64px',
            paddingBottom: '64px'
        }}>
            <TradePage {...args}/>
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({});