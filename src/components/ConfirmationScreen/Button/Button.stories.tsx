import { Button, ButtonVariant } from './Button';
import { Icons } from '../Icon/Icon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Button',
  component: Button,
  argTypes: {
    text: {
      type: 'string',
    },
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    variant: {
      options: ButtonVariant,
      control: {
        type: 'inline-radio',
      },
    },
    icon: {
      options: ['', ...Object.keys(Icons)],
      control: {
        type: 'select',
      },
    },
    onClick: {
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
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '480px' }}>
        <Button {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { text: 'Click here' };

export const Primary = Template.bind({});
Primary.args = {
  variant: ButtonVariant.Primary,
  text: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: ButtonVariant.Secondary,
  text: 'Secondary',
};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, text: 'Disabled' };

export const Loading = Template.bind({});
Loading.args = {
  variant: ButtonVariant.Loading,
  text: 'Click here',
};

export const WithIcon = Template.bind({});
WithIcon.args = { icon: 'Wallet', text: 'Click here' };
