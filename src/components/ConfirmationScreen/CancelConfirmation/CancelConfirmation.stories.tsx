import { CancelConfirmation } from './CancelConfirmation';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/Components/Steps/CancelConfirmation',
  component: CancelConfirmation,
  argTypes: {
    onCancel: {
      action: 'Cancel',
    },
    onBack: {
      action: 'Cancel',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof CancelConfirmation>;

const Template: ComponentStory<typeof CancelConfirmation> = (args) => (
  <StorybookWrapper>
    <CancelConfirmation {...args} />
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = {
  onBack: linkTo(
    'components/ConfirmationScreen/Components/Steps/UpdateMetadata'
  ),
  onCancel: linkTo(
    'components/ConfirmationScreen/Components/Steps/UpdateMetadata'
  ),
};
