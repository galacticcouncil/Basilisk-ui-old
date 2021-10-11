import { addHours } from 'date-fns';
import { addMinutes, subMinutes } from 'date-fns/esm';
import { random, times } from 'lodash';
import React from 'react';
import { StorybookWrapper } from "../../shared/StorybookWrapper";
import { TradeGraph, TradeGraphProps } from "./TradeGraph";
import { PoolType, TradeGraphChartTypes, TradeGraphGranularity } from './TradeGraphHeader';


const granularityOptions = (() => {
    const options: string[] = [];
    for (const granularity in TradeGraphGranularity) {
        options.push(granularity)
    }
    return options;
})();

const graphTypeOptions = (() => {
    const options: string[] = [];
    for (const graphType in TradeGraphChartTypes) {
        options.push(graphType)
    }
    return options;
})();

export interface WrapperProps {
    wrapperWidth: string
}

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
                symbol: 'KSM',
                fullName: 'Kusama'
            }
        },
        poolType: PoolType.LBP,
        spotPrice: {
            balance: 3183.123,
            usdBalance: 3183.123,
            timestamp: (() => {
                return Date.now()
            })(),
            asset: {
                symbol: 'KSM',
            }
        },
        historicalSpotPrice: times(59)
            .map((_, i) => {
                let balance = random(3183 * 0.95 + i / 2, 3183 + i / 2)
                // if (i == 59) balance = 3183.123
                if (i == 0) balance = 3183.123 * 0.95
                const timestamp = addMinutes(
                    subMinutes(new Date(), 60)   
                , i).getTime();

                return {
                    balance: balance,
                    usdBalance: balance,
                    timestamp
                }
            }),
        // historicalSpotPrice: [] as any,
        granularity: TradeGraphGranularity.H1,
        availableGranularity: granularityOptions,
        availableChartTypes: graphTypeOptions,
        chartType: TradeGraphChartTypes.PRICE,
        wrapperWidth: '760px'
    } as TradeGraphProps & WrapperProps,
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
        <div style={{
            width: args.wrapperWidth
        }}>
            <TradeGraph {...args} />
        </div>
    </StorybookWrapper>
)

export const Default = Template.bind({})