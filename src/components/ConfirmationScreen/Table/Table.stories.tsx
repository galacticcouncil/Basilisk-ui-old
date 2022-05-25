import { Table } from './Table';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

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
        460
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  mainData: [
    {
      label: { id: 'lorem' },
      value: { id: 'ipsum' },
      secondValue: { id: 'ipsum' },
      editable: true,
    },
    { label: { id: 'lorem' }, value: { id: 'ipsum' }, editable: true },
    {
      label: { id: 'lorem' },
      value: { id: 'ipsum' },
      secondValue: { id: 'ipsum' },
    },
    { label: { id: 'lorem' }, value: { id: 'ipsum' } },
  ],
  hiddenData: [
    { label: { id: 'lorem' }, value: { id: 'ipsum' }, editable: true },
    { label: { id: 'lorem' }, value: { id: 'ipsum' } },
  ],
};
