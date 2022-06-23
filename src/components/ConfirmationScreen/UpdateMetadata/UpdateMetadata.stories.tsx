import { UpdateMetadata } from './UpdateMetadata';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/Components/Steps/UpdateMetadata',
  component: UpdateMetadata,
  argTypes: {
    oldVersion: {
      type: 'string',
    },
    newVersion: {
      type: 'string',
    },
    isOpened: {
      type: 'boolean',
    },
    loading: {
      type: 'boolean',
    },
    onUpdateMetadata: {
      action: 'Update Metadata',
    },
    onCancel: {
      action: 'Cancel',
    },
    error: {
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
} as ComponentMeta<typeof UpdateMetadata>;

const Template: ComponentStory<typeof UpdateMetadata> = (args) => (
  <StorybookWrapper>
    <UpdateMetadata {...args} />
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = {
  oldVersion: '0.09',
  newVersion: '0.12',
  isOpened: true,
  loading: false,
  error: '',
  onCancel: linkTo(
    'components/ConfirmationScreen/Components/Steps/CancelConfirmation'
  ),
  onUpdateMetadata: linkTo(
    'components/ConfirmationScreen/Components/Steps/ConfirmSwap'
  ),
};
