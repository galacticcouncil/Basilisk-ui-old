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
import { linkTo } from '@storybook/addon-links';
import { FormProvider, useForm } from 'react-hook-form';
import { maskValue } from '../helpers/mask';

export default {
  title: 'components/ConfirmationScreen/Steps/ConfirmSwap',
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

const Template: ComponentStory<typeof ConfirmSwap> = (args) => {
  const defaults = {
    minimalAmountReceived: { value: maskValue('32456.46') },
    slippage: { custom: '5', value: '5' },
    transactionCost: { value: '12', secondValue: '2' },
    lifetime: {
      blockNumber: '0',
      infinite: true,
      value: '12/10/2022, 10:00:00',
    },
    nonce: { value: '0' },
    tipForBlockAuthor: { value: maskValue('0.0066') },
  };
  const methods = useForm({ defaultValues: defaults });

  return (
    <StorybookWrapper>
      <FormProvider {...methods}>
        <ConfirmSwap {...args} />
      </FormProvider>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  error: '',
  nextBlockTime: 10,
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
  onCancel: linkTo('components/ConfirmationScreen/Steps/CancelConfirmation'),
  onReview: linkTo('components/ConfirmationScreen/Steps/ReviewTransaction'),
};
