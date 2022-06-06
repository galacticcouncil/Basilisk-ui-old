import { ConfirmSwap } from './ConfirmSwap';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import BSX from '../AssetIcon/assets/BSX.svg';
import BSXChain from '../AssetIcon/assets/BSXChain.svg';
import KSM from '../AssetIcon/assets/KSM.svg';
import { AssetInputType } from '../AssetInput/AssetInput';
import * as Table from '../Table/Table.stories';
import { TableProps } from '../Table/Table';
import * as Stepper from '../Stepper/Stepper.stories';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/ConfirmSwap',
  component: ConfirmSwap,
  argTypes: {
    onCancel: {
      action: 'Cancel',
    },
    onReview: {
      action: 'Review',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ConfirmSwap>;

const Template: ComponentStory<typeof ConfirmSwap> = (args) => (
  <StorybookWrapper>
    <ConfirmSwap {...args} />
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = {
  error: '',
  nextBlockTime: 10,
  steps: {
    steps: Stepper.Default.args?.steps || [],
    currentStep: 1,
  },
  assetIn: {
    name: 'Basilisk',
    icon: BSX,
    symbol: 'BSX',
    chain: {
      name: 'Karura',
      icon: BSXChain,
    },
    amount: '10 000 000.000000000',
    type: AssetInputType.Buy,
  },
  assetOut: {
    name: 'Kusama',
    icon: KSM,
    symbol: 'KSM',
    chain: {
      name: 'Karura',
      icon: BSXChain,
    },
    amount: '10 000.000000000',
    type: AssetInputType.Receive,
  },
  table: Table.Default.args as TableProps,
  onCancel: linkTo('components/ConfirmationScreen/CancelConfirmation'),
  onReview: linkTo('components/ConfirmationScreen/ReviewTransaction'),
};
