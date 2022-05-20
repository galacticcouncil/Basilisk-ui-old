import { Icon, Icons } from './Icon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Icon',
  component: Icon,
  argTypes: {
    name: {
      options: ['', ...Object.keys(Icons)],
      control: {
        type: 'select',
      },
    },
    size: {
      min: 10,
      max: 100,
      step: 1,
      defaultValue: 24,
      control: {
        type: 'range'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => {
  return (
    <StorybookWrapper>
      <Icon {...args} />
    </StorybookWrapper>
  );
};

export const Wallet = Template.bind({});
Wallet.args = { name: 'Wallet' };
