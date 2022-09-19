import KSM from './icons/assets/KSM.svg';
import BSX from './icons/assets/BSX.svg';
import AUSD from './icons/assets/AUSD.svg';
import PHA from './icons/assets/PHA.svg';
import TNKR from './icons/assets/TNKR.png';
import Unknown from './icons/assets/Unknown.svg';
import { horizontalBar } from '../components/Chart/ChartHeader/ChartHeader';

export const idToAsset = (id: string | null) => {
  const assetMetadata: any = {
    rococo: {
      '0': {
        id: '0',
        symbol: 'BSX',
        fullName: 'Basilisk',
        icon: BSX,
      },
      '5': {
        id: '5',
        symbol: 'KSM',
        fullName: 'Kusama',
        icon: KSM,
      },
      '4': {
        id: '4',
        symbol: 'aUSD',
        fullName: 'Acala USD',
        icon: AUSD,
      },
      '6': {
        id: '6',
        symbol: 'LP BSX/KSM',
        fullName: 'BSX/KSM Share token',
        icon: Unknown,
      },
      '7': {
        id: '7',
        symbol: 'LP BSX/aUSD',
        fullName: 'BSX/aUSD Share token',
        icon: Unknown,
      },
      '8': {
        id: '8',
        symbol: 'LP KSM/aUSD',
        fullName: 'KSM/aUSD Share token',
        icon: Unknown,
      },
    },
    production: {
      '0': {
        id: '0',
        symbol: 'BSX',
        fullName: 'Basilisk',
        icon: BSX,
      },
      '1': {
        id: '1',
        symbol: 'KSM',
        fullName: 'Kusama',
        icon: KSM,
      },
      '2': {
        id: '2',
        symbol: 'aUSD',
        fullName: 'Acala USD',
        icon: AUSD,
      },
      '3': {
        id: '3',
        symbol: 'LP BSX/aUSD',
        fullName: 'BSX/aUSD Share token',
        icon: Unknown,
      },
      '4': {
        id: '4',
        symbol: 'LP BSX/KSM',
        fullName: 'BSX/KSM Share token',
        icon: Unknown,
      },
      '5': {
        id: '5',
        symbol: 'LP KSM/aUSD',
        fullName: 'KSM/aUSD Share token',
        icon: Unknown,
      },
    },
    develop: {
      '0': {
        id: '0',
        symbol: 'BSX',
        fullName: 'Basilisk',
        icon: BSX,
      },
      '1': {
        id: '1',
        symbol: 'KSM',
        fullName: 'Kusama',
        icon: KSM,
      },
      '2': {
        id: '2',
        symbol: 'aUSD',
        fullName: 'Acala USD',
        icon: AUSD,
      },
      '3': {
        id: '3',
        symbol: 'PHA',
        fullName: 'Phala',
        icon: PHA,
      },
      '4': {
        id: '4',
        symbol: 'TNKR',
        fullName: 'Tinkernet',
        icon: TNKR,
      },
      '5': {
        id: '5',
        symbol: 'LP KSM/aUSD',
        fullName: 'KSM/aUSD Share token',
        icon: Unknown,
      },
    },
  };

  return (
    (assetMetadata[process.env.REACT_APP_ENV || 'production'][id!] as any) ||
    (id && {
      id,
      symbol: horizontalBar,
      fullName: `Unknown asset ${id}`,
      icon: Unknown,
    })
  );
};
