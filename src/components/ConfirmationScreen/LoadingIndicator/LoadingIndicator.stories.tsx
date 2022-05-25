import { LoadingIndicator } from './LoadingIndicator';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/LoadingIndicator',
  component: LoadingIndicator,
  argTypes: {
    size: {
      defaultValue: 16,
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
} as ComponentMeta<typeof LoadingIndicator>;

const Template: ComponentStory<typeof LoadingIndicator> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <LoadingIndicator {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { size: 16 };
