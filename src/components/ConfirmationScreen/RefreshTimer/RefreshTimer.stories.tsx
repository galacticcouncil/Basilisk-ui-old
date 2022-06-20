import { RefreshTimer } from './RefreshTImer';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { useEffect, useState } from 'react';

export default {
  title: 'components/ConfirmationScreen/RefreshTimer',
  component: RefreshTimer,
  argTypes: {
    time: {
      defaultValue: 10,
      control: {
        type: 'range',
        min: -10,
        max: 20,
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
} as ComponentMeta<typeof RefreshTimer>;

const Template: ComponentStory<typeof RefreshTimer> = (args) => {

  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <RefreshTimer {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { time: 10 };
