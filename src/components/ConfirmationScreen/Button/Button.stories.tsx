import { Button, ButtonKind } from './Button';
import { Icons } from '../Icon/Icon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Components/Button',
  component: Button,
  argTypes: {
    text: {
      type: 'string',
    },
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    kind: {
      options: ButtonKind,
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
      <div style={{ width: '460px' }}>
        <Button {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { text: { id: 'Click here' } };

export const Primary = Template.bind({});
Primary.args = {
  kind: ButtonKind.Primary,
  text: { id: 'Primary' },
};

export const Secondary = Template.bind({});
Secondary.args = {
  kind: ButtonKind.Secondary,
  text: { id: 'Secondary' },
};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, text: { id: 'Disabled' } };

export const Loading = Template.bind({});
Loading.args = {
  kind: ButtonKind.Loading,
  text: { id: 'Click here' },
};

export const WithIcon = Template.bind({});
WithIcon.args = { icon: 'Wallet', text: { id: 'Click here' } };
