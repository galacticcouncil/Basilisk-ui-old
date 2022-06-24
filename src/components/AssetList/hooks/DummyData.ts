import BSX from '../../ConfirmationScreen/AssetIcon/assets/BSX.svg';
import { AssetType } from '../Row/Row';

export const dummyData = [
  {
    id: '0',
    type: AssetType.Native,
    name: 'Basilisk',
    icon: BSX,
    symbol: 'BSX',
    totalBalance: '2855.245664263456',
    spendableBalance: '2855.245664263456',
    lockedBalance: {
      balance: '2855.245664263456',
      reason: 'vesting',
    },
    inPoolBalance: '2855.245664263456',
    freeBalance: '2855.245664263456',
    reservedBalance: '2855.245664263456',
    frozenBalance: '2855.245664263456',
    exchangeRate: '0.123',
    chain: {
      id: '0',
      icon: null,
      name: 'Basilisk',
    },
  },
  {
    id: '1',
    type: AssetType.Native,
    name: 'Kusama',
    icon: BSX,
    symbol: 'KSM',
    totalBalance: '285.245664263456',
    spendableBalance: '285.245664263456',
    lockedBalance: {
      balance: '285.245664263456',
      reason: 'vesting',
    },
    inPoolBalance: '285.245664263456',
    freeBalance: '285.245664263456',
    reservedBalance: '285.245664263456',
    frozenBalance: '285.245664263456',
    exchangeRate: '100',
    chain: {
      id: '1',
      icon: null,
      name: 'Kusama',
    },
  },
];
