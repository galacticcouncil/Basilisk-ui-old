import { AssetType, Row } from './Row';
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
    chain: {
      id: '1',
      icon: null,
      name: 'Basilisk',
    },
  },
  totalLockedCoins: '1 223 566 356',
  exchangeRate: 0.123,
  actions: DropdownStory.args as DropdownProps,
};

export const Centered = Template.bind({});
Centered.args = {
  asset: {
    id: '1',
    type: AssetType.Native,
    name: 'Basilisk',
    icon: AssetIconStory.args?.assetIcon,
    symbol: 'BSX',
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
    chain: {
      id: '1',
      icon: null,
      name: 'Basilisk',
    },
  },
  totalLockedCoins: '1 223 566 356',
  exchangeRate: 100,
  actions: DropdownStory.args as DropdownProps,
  feeAssetId: '1',
};
