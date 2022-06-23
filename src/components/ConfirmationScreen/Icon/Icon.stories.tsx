import { Icon, Icons } from './Icon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      options: Object.keys(Icons),
      control: {
        type: 'select',
      },
    },
    size: {
      defaultValue: 24,
      control: {
        type: 'range',
        min: 10,
        max: 200,
        step: 1,
      },
    },
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

export const Loading = Template.bind({});
Loading.args = { name: 'Loading' };

export const Error = Template.bind({});
Error.args = { name: 'Error' };

export const ArrowDown = Template.bind({});
ArrowDown.args = { name: 'ArrowDown', size: 14 };

export const ArrowUp = Template.bind({});
ArrowUp.args = { name: 'ArrowUp', size: 14 };

export const ArrowAssetPicker = Template.bind({});
ArrowAssetPicker.args = { name: 'ArrowAssetPicker', size: 36 };

export const UpdateMetadata = Template.bind({});
UpdateMetadata.args = { name: 'UpdateMetadata', size: 136 };
