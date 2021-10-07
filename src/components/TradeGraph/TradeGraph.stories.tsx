import { addHours } from 'date-fns';
import { addMinutes } from 'date-fns/esm';
import { random, times } from 'lodash';
import { StorybookWrapper } from "../../shared/StorybookWrapper";
import { TradeGraph, TradeGraphProps } from "./TradeGraph";
import { PoolType, TradeGraphGranularity } from './TradeGraphHeader';


const granularityOptions = (() => {
    const options: string[] = [];
    for (const granularity in TradeGraphGranularity) {
        options.push(granularity)
    }
    return options;
})();
export default {
    component: TradeGraph,
    title: 'components/TradeGraph',
    args: {
        assetPair: {
            assetA: {
                symbol: 'BSX',
                fullName: 'Basilisk'
            },
            assetB: {
                symbol: 'USDC',
                fullName: 'USD Coin'
            }
        },
        poolType: PoolType.LBP,
        spotPrice: {
            balance: 3183.123,
            usdBalance: 3183.123,
            blockHeight: 1,
            asset: {
                symbol: 'USDC',
            }
        },
        // spotPriceBalanceChange: 3183.123 * 0.5,
        historicalSpotPrice: times(61)
            .map((_, i) => {
                let balance = random(3183 * 0.95 + i / 2, 3183 + i / 2)
                if (i == 12) balance = 3183.123
                if (i == 0) balance = 3183.123 * 0.95

                return {
                    balance: balance,
                    usdBalance: balance,
                    blockHeight: 9539336 + i,
                    timestamp: (() => {
                        let date = addMinutes(new Date, i);
                        const timestamp = date.getTime();
                        return `${timestamp}`;
                    })()
                }
            }),
        granularity: TradeGraphGranularity.H1,
        availableGranularity: granularityOptions
    } as TradeGraphProps,
    argTypes: {
        poolType: {
            options: (() => {
                const options: string[] = [];
                for (const poolType in PoolType) {
                    options.push(poolType)
                }
                return options;
            })(),
            control: {
                type: 'select'
            }
        },
        granularity: {
            options: granularityOptions,
            control: {
                type: 'select'
            }
        }
    }
}

const Template = (args: any) => (
    <StorybookWrapper>
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <TradeGraph {...args} />
                </div>
            </div>
        </div>
    </StorybookWrapper>
)

export const Default = Template.bind({})