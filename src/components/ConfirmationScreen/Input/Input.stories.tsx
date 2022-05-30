import { Input } from './Input';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Input',
  component: Input,
  argTypes: {
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    value: {
      type: 'string',
    },
    unit: {
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
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <Input {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: {
    id: 'Tip for block author',
  },
  value: '1231.23123124',
  error: {
    id: 'Not enough funds',
  },
  tooltip: {
    id: 'This is tooltip',
  },
  unit: 'BSX',
};
