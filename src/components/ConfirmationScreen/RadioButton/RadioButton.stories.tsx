import { RadioButton } from './RadioButton';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/RadioButton',
  component: RadioButton,
  argTypes: {
    value: {
      type: 'number',
    },
    checked: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <RadioButton {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  value: 0.5,
};
export const Checked = Template.bind({});
Checked.args = {
  value: 0.5,
  checked: true,
};
