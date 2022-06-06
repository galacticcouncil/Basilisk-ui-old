import { Table } from './Table';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';

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
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <Table {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  handleEdit: linkTo('components/ConfirmationScreen/Settings'),
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
};

export const NoAdvancedSettings = Template.bind({});
NoAdvancedSettings.args = {
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
};

export const NoEdit = Template.bind({});
NoEdit.args = {
  settings: [
    {
      label: { id: 'Minimal amount received:' },
      value: { id: '33 456.46' },
    },
    { label: { id: 'Slippage:' }, value: { id: '5%' } },
    {
      label: { id: 'Transaction cost:' },
      value: { id: '~12 BSX' },
      secondValue: { id: '2%' },
    },
    {
      label: { id: 'Transaction lifetime:' },
      value: { id: '12/10/2022, 10:00:00' },
    },
    {
      label: { id: 'Tip for block author:' },
      value: { id: '0.0066 BSX' },
    },
    { label: { id: 'Nonce' }, value: { id: '0' } },
  ],
};
