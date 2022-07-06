import { AssetTable } from './AssetTable';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import {
  Default as RowStory,
  Centered as RowStoryCentered,
} from '../Row/Row.stories';
import { AssetRowProps, AssetBase, AssetShare, AssetType } from '../Row/Row';
import { WithBothIcons as AssetIconStory } from '../../ConfirmationScreen/AssetIcon/AssetIcon.stories';

export default {
  title: 'components/AssetList/Components/AssetTable',
  component: AssetTable,
  argTypes: {
    onShowInPoolBalances: {
      action: 'clicked',
    },
    showInPoolBalances: {
      type: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetTable>;

const Template: ComponentStory<typeof AssetTable> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ padding: '20px' }}>
        <AssetTable {...args} />
      </div>
    </StorybookWrapper>
  );
};

const shareAsset: AssetShare = {
  id: 1,
  type: AssetType.Shared,
  assetA: {
    id: '1',
    name: 'Basilisk',
    icon: AssetIconStory.args?.assetIcon,
    symbol: 'Basilisk',
    exchangeRate: '0.123',
    chain: {
      id: '0',
      icon: null,
      name: 'Basilisk',
    },
  } as AssetBase,
  assetB: {
    id: '2',
    name: 'Kusama',
    icon: AssetIconStory.args?.assetIcon,
    symbol: 'KSM',
    exchangeRate: '0.123',
    chain: {
      id: '0',
      icon: AssetIconStory.args?.chainIcon,
      name: 'Karura',
    },
  } as AssetBase,
  totalBalance: '2855.245664263456',
  spendableBalance: '2855.245664263456',
  actions: {
    onTransfer: () => console.log('onTransfer'),
    onCrossTransfer: () => console.log('onCrossTransfer'),
    onBuy: () => console.log('onBuy'),
    onSell: () => console.log('onSell'),
    onPositionManagement: () => console.log('onPositionManagement'),
    onRemoveLiquidity: () => console.log('onRemoveLiquidity'),
    onAddLiquidity: () => console.log('onAddLiquidity'),
  },
  totalIssuance: '1000000000',
  pool: 'BSX/DAI',
  totalShare: 1.12,
};

export const Default = Template.bind({});
Default.args = {
  assetsRows: [
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStoryCentered.args as AssetRowProps,
    RowStoryCentered.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
  ],
  shareAssetsRows: [
    shareAsset as AssetShare,
    shareAsset as AssetShare,
    shareAsset as AssetShare,
  ],
};

export const Long = Template.bind({});
Long.args = {
  assetsRows: [
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStoryCentered.args as AssetRowProps,
    RowStoryCentered.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
    RowStory.args as AssetRowProps,
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  assetsRows: [],
};

export const Loading = Template.bind({});
Loading.args = {
  assetsRows: [],
  loading: true,
};
