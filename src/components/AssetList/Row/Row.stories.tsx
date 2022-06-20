import { Row } from './Row';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { WithBothIcons as AssetIconStory } from '../../ConfirmationScreen/AssetIcon/AssetIcon.stories';
import { DropdownProps } from '../Dropdown/Dropdown';
import { Default as DropdownStory } from '../Dropdown/Dropdown.stories';

export default {
  title: 'components/AssetList/Row',
  component: Row,
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
} as ComponentMeta<typeof Row>;

const Template: ComponentStory<typeof Row> = (args) => {
  return (
    <StorybookWrapper>
      <table style={{ padding: '0px 50px', width: '100%' }}>
        <Row {...args} />
      </table>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  asset: {
    id: '1',
    name: 'Basilisk',
    icon: AssetIconStory.args?.assetIcon,
    symbol: 'BSX',
    chain: {
      id: '1',
      icon: null,
      name: 'Basilisk',
    },
  },
  totalBalanceCoins: '2855.245664263456',
  totalBalance: '$2855.24',
  spendableBalanceCoins: '2855.245664263456',
  spendableBalance: '$2855.24',
  lockedBalanceCoins: '2855.245664263456',
  lockedBalance: '$2855.24',
  totalLockedCoins: '1 223 566 356 BSX',
  inPoolBalanceCoins: '2855.245664263456',
  inPoolBalance: '$2855.24',
  exchangeRate: '$1 = 10 000 BSX',
  actions: DropdownStory.args as DropdownProps,
};

export const Centered = Template.bind({});
Centered.args = {
  asset: {
    id: '1',
    name: 'Basilisk',
    icon: AssetIconStory.args?.assetIcon,
    symbol: 'BSX',
    chain: {
      id: '1',
      icon: null,
      name: 'Basilisk',
    },
  },
  totalBalanceCoins: '2855.24',
  totalBalance: '$2855.24',
  spendableBalanceCoins: '2855.245664263456',
  spendableBalance: '$2855.24',
  lockedBalanceCoins: '2855.245664263456',
  lockedBalance: '$2855.24',
  totalLockedCoins: '1 223 566 356 BSX',
  inPoolBalanceCoins: '2855.245664263456',
  inPoolBalance: '$2855.24',
  exchangeRate: '$1 = 10 000 BSX',
  actions: DropdownStory.args as DropdownProps,
  feeAssetId: '1',
};
