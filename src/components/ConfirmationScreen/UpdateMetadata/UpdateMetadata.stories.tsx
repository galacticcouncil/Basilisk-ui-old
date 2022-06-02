import { UpdateMetadata } from './UpdateMetadata';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/UpdateMetadata',
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
Default.args = { oldVersion: '0.09', newVersion: '0.12', isOpened: true, loading: false };
