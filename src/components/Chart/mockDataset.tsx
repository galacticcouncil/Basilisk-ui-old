import { addMinutes, subMinutes } from 'date-fns'
import { random, times } from 'lodash'
import { dataset } from './dataset'
import { AssetPair } from './shared'

export const assetPair: AssetPair = {
  assetA: {
    symbol: 'BSX',
    fullName: 'Basilisk'
  },
  assetB: {
    symbol: 'kUSD',
    fullName: 'Karura US Dollar'
  }
}

const randomDataPoint = () => random(10, 100)
const singularity = randomDataPoint()

const now = Date.now()
const hourAgo = subMinutes(now, 60)

export const createDataset = (assetPair: AssetPair, entries: number) => dataset

// TODO: Proper dataset
export const createLBPDataset = (assetPair: AssetPair, entries: number) => {
  return {
    primaryDataset: times(entries).map((i) => ({
      x: addMinutes(hourAgo, (i + 1) * (60 / entries)).getTime(),
      y: i === entries - 1 ? singularity : randomDataPoint()
    })),
    secondaryDataset: times(entries).map((i) => ({
      x: addMinutes(now, i * (60 / entries)).getTime(),
      y: i === 0 ? singularity : singularity / (i + 2 * 0.5)
    }))
  }
}
