import { SentTransaction } from './SentTransaction';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/Components/Steps/SentTransaction',
  component: SentTransaction,
  argTypes: {
    onAction: {
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
} as ComponentMeta<typeof SentTransaction>;

const Template: ComponentStory<typeof SentTransaction> = (args) => (
  <StorybookWrapper>
    <SentTransaction {...args} />
  </StorybookWrapper>
);

export const Sent = Template.bind({});
Sent.args = {
  status: 'sent',
  onAction: linkTo(
    'components/ConfirmationScreen/Components/Steps/SentTransaction',
    'submitted'
  ),
};

export const Error = Template.bind({});
Error.args = {
  status: 'error',
};

export const submitted = Template.bind({});
submitted.args = {
  status: 'submitted',
  onAction: linkTo(
    'components/ConfirmationScreen/Components/Steps/UpdateMetadata'
  ),
};
