import KSM from './icons/assets/KSM.svg'
import BSX from './icons/assets/BSX.svg'
import AUSD from './icons/assets/AUSD.svg'
import PHA from './icons/assets/PHA.svg'
import TNKR from './icons/assets/TNKR.svg'
import Unknown from './icons/assets/Unknown.svg'
import { horizontalBar } from '../components/Chart/ChartHeader/ChartHeader'

export enum Environment {
  develop = 'develop',
  rococo = 'rococo',
  production = 'production'
}

export type AssetMetadataMap = {
  [key in Environment]: {
    [key: string]: AssetMetadata | undefined
  }
}

export interface AssetMetadata {
  id: string
  symbol: string
  fullName: string
  icon: string
}

export const assetMetadataMap: AssetMetadataMap = {
  rococo: {
    '0': {
      id: '0',
      symbol: 'BSX',
      fullName: 'Basilisk',
      icon: BSX
    },
    '5': {
      id: '5',
      symbol: 'KSM',
      fullName: 'Kusama',
      icon: KSM
    },
    '4': {
      id: '4',
      symbol: 'aUSD',
      fullName: 'Acala USD',
      icon: AUSD
    },
    '6': {
      id: '6',
      symbol: 'LP BSX/KSM',
      fullName: 'BSX/KSM Share token',
      icon: Unknown
    },
    '7': {
      id: '7',
      symbol: 'LP BSX/aUSD',
      fullName: 'BSX/aUSD Share token',
      icon: Unknown
    },
    '8': {
      id: '8',
      symbol: 'LP KSM/aUSD',
      fullName: 'KSM/aUSD Share token',
      icon: Unknown
    },
    '9': {
      id: '9',
      symbol: 'TNKR',
      fullName: 'Tinkernet',
      icon: TNKR
    }
  },
  production: {
    '0': {
      id: '0',
      symbol: 'BSX',
      fullName: 'Basilisk',
      icon: BSX
    },
    '1': {
      id: '1',
      symbol: 'KSM',
      fullName: 'Kusama',
      icon: KSM
    },
    '2': {
      id: '2',
      symbol: 'aUSD',
      fullName: 'Acala USD',
      icon: AUSD
    },
    '3': {
      id: '3',
      symbol: 'LP BSX/aUSD',
      fullName: 'BSX/aUSD Share token',
      icon: Unknown
    },
    '4': {
      id: '4',
      symbol: 'LP BSX/KSM',
      fullName: 'BSX/KSM Share token',
      icon: Unknown
    },
    '5': {
      id: '5',
      symbol: 'LP KSM/aUSD',
      fullName: 'KSM/aUSD Share token',
      icon: Unknown
    },
    '6': {
      id: '6',
      symbol: 'TNKR',
      fullName: 'Tinkernet',
      icon: TNKR
    },
    '7': {
      id: '7',
      symbol: 'LP TNKR/BSX',
      fullName: 'TNKR/BSX Share token',
      icon: Unknown
    },
    '8': {
      id: '8',
      symbol: 'LP TNKR/KSM',
      fullName: 'TNKR/KSM Share token',
      icon: Unknown
    },
  },
  develop: {
    '0': {
      id: '0',
      symbol: 'BSX',
      fullName: 'Basilisk',
      icon: BSX
    },
    '1': {
      id: '1',
      symbol: 'KSM',
      fullName: 'Kusama',
      icon: KSM
    },
    '2': {
      id: '2',
      symbol: 'BAD',
      fullName: 'BAD Token',
      icon: Unknown
    },
    '3': {
      id: '3',
      symbol: 'PHA',
      fullName: 'Phala',
      icon: PHA
    },
    '4': {
      id: '4',
      symbol: 'BNKR',
      fullName: 'Bankernet',
      icon: Unknown
    },
    '5': {
      id: '5',
      symbol: 'LP KSM/BAD',
      fullName: 'KSM/BAD Share token',
      icon: Unknown
    },
    '8': {
      id: '8',
      symbol: 'TNKR',
      fullName: 'Tinkernet',
      icon: TNKR
    },
    '9': {
      id: '9',
      symbol: 'aUSD',
      fullName: 'Acala USD',
      icon: AUSD
    }
  }
}

export const idToAsset = (id: string | null): AssetMetadata => {
  const environment =
    process.env.REACT_APP_ENV && process.env.REACT_APP_ENV in Environment
      ? process.env.REACT_APP_ENV
      : 'production'

  const metadata = id && assetMetadataMap[environment as Environment][id]

  if (!metadata) {
    return {
      id: id || '',
      symbol: horizontalBar,
      fullName: id ? `Unknown asset ${id}` : '',
      icon: Unknown
    }
  }

  return metadata
}
