import { StorybookWrapper } from '../shared/StorybookWrapper';
import { TradePage } from './TradePage';
import cssColors from './../shared/colors.module.scss';
import ETHIcon from './../icons/assets/ETH.svg';
import KSMIcon from './../icons/assets/KSM.svg';

export default {
    title: 'Pages/Trade/TradePage',
    component: TradePage,
    args: {
        assetPair: {
            assetA: {
                symbol: 'BSX',
                fullName: 'Basilisk',
                icon: ETHIcon
            },
            assetB: {
                symbol: 'KSM',
                fullName: 'Kusama',
                icon: KSMIcon
            }
        }
    },
    parameters: {
        layout: 'fullscreen'
    }
}

const Template = (args: any) => {
    return <StorybookWrapper>
        <div style={{
            background: 'linear-gradient(90deg, rgba(66,66,80,1) 61%, rgba(55,55,65,1) 100%)',
            paddingTop: '64px',
            paddingBottom: '64px',
            height: '100vh'
        }}>
            <TradePage {...args}/>
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({});