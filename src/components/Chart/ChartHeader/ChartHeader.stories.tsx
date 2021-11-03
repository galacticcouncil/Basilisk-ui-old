import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { ChartGranularity, ChartType, PoolType } from '../shared';
import { ChartHeader } from './ChartHeader';
import cssColors from './../../../misc/colors.module.scss'

export default {
    title: 'Components/Chart/ChartHeader',
    component: ChartHeader,
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
        referenceData: {
            balance: 200,
            usdBalance: 200,
            asset: {
                symbol: 'kUSD',
                fullName: 'Karura US Dollar'
            }
        },
        availableChartTypes: [
            ChartType.PRICE,
            ChartType.VOLUME,
            ChartType.WEIGHTS
        ],
        availableGranularity: [
            ChartGranularity.D30,
            ChartGranularity.D7,
            ChartGranularity.H24,
            ChartGranularity.H1,
        ]
    }
}

const Template = (args: any) => {
    return <StorybookWrapper>
        <div style={{
            width: args.wrapperWidth,
            backgroundColor: cssColors.gray2
        }}>
            <ChartHeader {...args} />
        </div>
    </StorybookWrapper>
}

export const Default = Template.bind({})