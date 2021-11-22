import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { TradeChart } from './TradeChart';
import cssColors from './../../../misc/colors.module.scss'
import { ChartGranularity, ChartType, PoolType } from '../shared';

export default {
    title: 'Components/Chart/TradeChart',
    component: TradeChart,
    args: {
        assetPair: {
            assetA: {
                symbol: 'BSX',
                fullName: 'Basilisk'
            },
            assetB: {
                symbol: 'kUSD',
                fullName: 'Karura US Dollar'
            }
        },
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
        wrapperWidth: '760px'
    }
}


const Template = (args: any) => (
    <StorybookWrapper>
        <div style={{
            width: args.wrapperWidth
        }}>
            <TradeChart {...args} />
        </div>
    </StorybookWrapper>
)

export const Default = Template.bind({})