import { Table } from './Table';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';
import { maskValue } from '../helpers/mask';
import { FormProvider, useForm } from 'react-hook-form';

export default {
  title: 'components/ConfirmationScreen/Table',
  component: Table,
  argTypes: {
    handleEdit: {
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
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => {
  const defaults = {
    minimalAmountReceived: { value: maskValue('32456.46') },
    slippage: { custom: '5', value: '5' },
    transactionCost: { value: '12', secondValue: '2' },
    lifetime: {
      blockNumber: '0',
      infinite: true,
      value: '12/10/2022, 10:00:00',
    },
    nonce: { value: 0 },
    tipForBlockAuthor: { value: maskValue('0.0066') },
  };
  const methods = useForm({ defaultValues: defaults });
  console.log('watch(): ', JSON.stringify(methods.watch()));

  return (
    <StorybookWrapper>
      <FormProvider {...methods}>
        <div style={{ width: '460px' }}>
          <Table {...args} />
        </div>
      </FormProvider>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  handleEdit: linkTo('components/ConfirmationScreen/Settings'),
  settings: [
    {
      label: {
        id: 'minimalAmountReceived',
        defaultMessage: 'Minimal amount received:',
      },
    },
    {
      label: { id: 'slippage', defaultMessage: 'Slippage:' },
      valueSuffix: '%',
      editable: true,
    },
    {
      label: { id: 'transactionCost', defaultMessage: 'Transaction cost:' },
      valueSuffix: ' BSX',
      valuePrefix: '~',
      secondValueSuffix: '%',
    },
  ],
  advancedSettings: [
    {
      label: { id: 'lifetime', defaultMessage: 'Transaction lifetime:' },
      editable: true,
    },
    {
      label: {
        id: 'tipForBlockAuthor',
        defaultMessage: 'Tip for block author:',
      },
      valueSuffix: ' BSX',
      editable: true,
    },
    {
      label: { id: 'nonce', defaultMessage: 'Nonce' },
      editable: true,
    },
  ],
};

export const NoAdvancedSettings = Template.bind({});
NoAdvancedSettings.args = {
  settings: [
    {
      label: {
        id: 'minimalAmountReceived',
        defaultMessage: 'Minimal amount received:',
      },
    },
    {
      label: { id: 'slippage', defaultMessage: 'Slippage:' },
      valueSuffix: '%',
      editable: true,
    },
    {
      label: { id: 'transactionCost', defaultMessage: 'Transaction cost:' },
      valueSuffix: ' BSX',
      valuePrefix: '~',
      secondValueSuffix: '%',
    },
    {
      label: { id: 'lifetime', defaultMessage: 'Transaction lifetime:' },
      editable: true,
    },
    {
      label: {
        id: 'tipForBlockAuthor',
        defaultMessage: 'Tip for block author:',
      },
      valueSuffix: ' BSX',
      editable: true,
    },
    {
      label: { id: 'nonce', defaultMessage: 'Nonce' },
      editable: true,
    },
  ],
};

export const NoEdit = Template.bind({});
NoEdit.args = {
  noEdit: true,
  settings: [
    {
      label: {
        id: 'minimalAmountReceived',
        defaultMessage: 'Minimal amount received:',
      },
    },
    {
      label: { id: 'slippage', defaultMessage: 'Slippage:' },
      valueSuffix: '%',
      editable: true,
    },
    {
      label: { id: 'transactionCost', defaultMessage: 'Transaction cost:' },
      valueSuffix: ' BSX',
      valuePrefix: '~',
      secondValueSuffix: '%',
    },
    {
      label: { id: 'lifetime', defaultMessage: 'Transaction lifetime:' },
      editable: true,
    },
    {
      label: {
        id: 'tipForBlockAuthor',
        defaultMessage: 'Tip for block author:',
      },
      valueSuffix: ' BSX',
      editable: true,
    },
    {
      label: { id: 'nonce', defaultMessage: 'Nonce' },
      editable: true,
    },
  ],
};
