import { AssetPair } from './shared';
import {times, random} from 'lodash';
import { addMinutes, subMinutes } from 'date-fns';

export const assetPair: AssetPair = {
    assetA: {
        symbol: 'BSX',
        fullName: 'Basilisk'
    },
    assetB: {
        symbol: 'kUSD',
        fullName: 'Karura US Dollar'
    }
};

const randomDataPoint = () => random(3000, 3100);

const now = Date.now();
const hourAgo = subMinutes(now, 60);


export const createDataset = (assetPair: AssetPair, entries:number) => times(entries)
    .map(i => ({
        x: now + (i * 100000),
        y: random(3000, 3100) / (assetPair.assetA.symbol === 'BSX' ? 2 : 1)
    }))

// TODO: Proper dataset
export const createLBPDataset = (assetPair: AssetPair, entries:number) => { return {
    primaryDataset: times(entries)
        .map(i => ({
            x: addMinutes(hourAgo, (i + 1) * 10).getTime(),
            y: i === (entries - 1) ? entries / 2 : randomDataPoint()
        })),
    secondaryDataset: times(entries)
        .map(i => ({
            x: addMinutes(now, i * 10).getTime(),
            y: i === 0 ? entries / 2 : randomDataPoint()
        }))
}}