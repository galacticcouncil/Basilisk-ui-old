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
    steps: [
      {
        id: 'metadata',
        defaultMessage: 'Metadata',
      },
      {
        id: 'confirmation',
        defaultMessage: 'Confirmation',
      },
      {
        id: 'reviewAndSign ',
        defaultMessage: 'Review & Sign',
      },
    ],
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
  table: {
    settings: [
      {
        label: { id: 'Minimal amount received:' },
        value: { id: '33 456.46' },
      },
      { label: { id: 'Slippage:' }, value: { id: '5%' }, editable: true },
      {
        label: { id: 'Transaction cost:' },
        value: { id: '~12 BSX' },
        secondValue: { id: '2%' },
      },
    ],
    advancedSettings: [
      {
        label: { id: 'Transaction lifetime:' },
        value: { id: '12/10/2022, 10:00:00' },
        editable: true,
      },
      {
        label: { id: 'Tip for block author:' },
        value: { id: '0.0066 BSX' },
        editable: true,
      },
      { label: { id: 'Nonce' }, value: { id: '0' }, editable: true },
    ],
  },
};
