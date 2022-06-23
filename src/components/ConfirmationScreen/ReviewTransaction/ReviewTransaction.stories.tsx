import { ReviewTransaction } from './ReviewTransaction';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import * as MethodText from '../MethodText/MethodText.stories';
import { MethodTextProps } from '../MethodText/MethodText';
import * as Table from '../Table/Table.stories';
import { TableProps } from '../Table/Table';
import { linkTo } from '@storybook/addon-links';
import { FormProvider, useForm } from 'react-hook-form';
import { maskValue } from '../helpers/mask';

export default {
  title: 'components/ConfirmationScreen/Components/Steps/ReviewTransaction',
  component: ReviewTransaction,
  argTypes: {
    onCancel: {
      action: 'Cancel',
    },
    onSign: {
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
} as ComponentMeta<typeof ReviewTransaction>;

const Template: ComponentStory<typeof ReviewTransaction> = (args) => {
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
        <ReviewTransaction {...args} />
      </FormProvider>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  loading: false,
  methodCall: MethodText.Default.args as MethodTextProps,
  table: Table.NoEdit.args as TableProps,
  onCancel: linkTo(
    'components/ConfirmationScreen/Components/Steps/ConfirmSwap'
  ),
  onSign: linkTo(
    'components/ConfirmationScreen/Components/Steps/SentTransaction',
    'Sent'
  ),
  nextBlockTime: 10,
  error: '',
};
