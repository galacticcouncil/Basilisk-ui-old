import { AssetInput, AssetInputType } from './AssetInput';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import BSX from '../AssetIcon/assets/BSX.svg';
import BSXChain from '../AssetIcon/assets/BSXChain.svg';

export default {
  title: 'components/ConfirmationScreen/Components/AssetInput',
  component: AssetInput,
  argTypes: {
    type: {
      options: AssetInputType,
      control: {
        type: 'inline-radio',
      },
    },
    name: {
      type: 'string',
    },
    symbol: {
      type: 'string',
    },
    amount: {
      type: 'string',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetInput>;

const Template: ComponentStory<typeof AssetInput> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <AssetInput {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Buy = Template.bind({});
Buy.args = {
  name: 'Basilisk',
  icon: BSX,
  symbol: 'BSX',
  chain: {
    name: 'Karura',
    icon: BSXChain,
  },
  amount: '10000000.000000000',
  type: AssetInputType.Buy,
};

export const Sell = Template.bind({});
Sell.args = {
  name: 'Basilisk',
  icon: BSX,
  symbol: 'BSX',
  chain: {
    name: 'Karura',
    icon: BSXChain,
  },
  amount: '10000000.000000000',
  type: AssetInputType.Sell,
};

export const Receive = Template.bind({});
Receive.args = {
  name: 'Basilisk',
  icon: BSX,
  symbol: 'BSX',
  chain: {
    name: 'Karura',
    icon: BSXChain,
  },
  amount: '10000000.000000000',
  type: AssetInputType.Receive,
};
