import { Settings } from './Settings';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/Settings',
  component: Settings,
  argTypes: {
    onBack: {
      action: 'Action',
    },
    onSave: {
      action: 'Action',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Settings>;

const Template: ComponentStory<typeof Settings> = (args) => (
  <StorybookWrapper>
    <Settings {...args} />
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = {
  slippage: 'autoSlippage',
  lifetime: 'infinite',
  error: '',
  unit: 'BSX',
  onBack: linkTo('components/ConfirmationScreen/ConfirmSwap'),
  onSave: linkTo('components/ConfirmationScreen/ConfirmSwap'),
};

export const AllSettings = Template.bind({});
AllSettings.args = {
  slippage: { radio: 0.5 },
  lifetime: 200000,
  error: '',
  unit: 'BSX',
  onBack: linkTo('components/ConfirmationScreen/ConfirmSwap'),
  onSave: linkTo('components/ConfirmationScreen/ConfirmSwap'),
};
