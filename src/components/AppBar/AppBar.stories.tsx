import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { AppBar } from './AppBar';

export default {
    title: 'components/AppBar/AppBar',
    component: AppBar
}

const Template = () => {
    return <StorybookWrapper>
        <div style={{
            background: 'linear-gradient(90deg, rgba(66,66,80,1) 61%, rgba(55,55,65,1) 100%)',
            height: "100vh"
        }}>
            <AppBar balance={{
                balance: "100000000000",
                asset: {
                    symbol: "BSX",
                    fullName: "Basilisk",
                },
                usdBalance: "10000000"
            }} />
            

        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({})