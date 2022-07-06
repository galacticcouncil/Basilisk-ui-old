import { AssetType, AssetRow } from './Row';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { WithBothIcons as AssetIconStory } from '../../ConfirmationScreen/AssetIcon/AssetIcon.stories';

export default {
  title: 'components/AssetList/Components/Row',
  component: AssetRow,
  argTypes: {
    handleClick: {
      action: 'clicked',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetRow>;

const Template: ComponentStory<typeof AssetRow> = (args) => {
  return (
    <StorybookWrapper>
      <table style={{ padding: '0px 50px', width: '100%' }}>
        <AssetRow {...args} />
      </table>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  asset: {
    id: '0',
    type: AssetType.Native,
    name: 'Basilisk',
    icon: AssetIconStory.args?.assetIcon,
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
    actions: {
      onTransfer: () => console.log('onTransfer'),
      onCrossTransfer: () => console.log('onCrossTransfer'),
      onBuy: () => console.log('onBuy'),
      onSell: () => console.log('onSell'),
      onPositionManagement: () => console.log('onPositionManagement'),
      onRemoveLiquidity: () => console.log('onRemoveLiquidity'),
      onSetFeeAsset: () => console.log('onSetFeeAsset'),
      onClaim: () => console.log('onClaim'),
      onAddLiquidity: () => console.log('onAddLiquidity'),
    },
  },
  totalLockedCoins: '1 223 566 356',
};

export const Centered = Template.bind({});
Centered.args = {
  asset: {
    id: '1',
    type: AssetType.Bridged,
    name: 'Kusama',
    icon: AssetIconStory.args?.assetIcon,
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
      icon: AssetIconStory.args?.chainIcon,
      name: 'Kusama',
    },
    actions: {
      onTransfer: () => console.log('onTransfer'),
      onCrossTransfer: () => console.log('onCrossTransfer'),
      onBuy: () => console.log('onBuy'),
      onSell: () => console.log('onSell'),
      onPositionManagement: () => console.log('onPositionManagement'),
      onRemoveLiquidity: () => console.log('onRemoveLiquidity'),
      onSetFeeAsset: () => console.log('onSetFeeAsset'),
      onAddLiquidity: () => console.log('onAddLiquidity'),
    },
  },
  totalLockedCoins: '1 223 566 356',
  feeAssetId: '1',
};

export const Loading = Template.bind({});
