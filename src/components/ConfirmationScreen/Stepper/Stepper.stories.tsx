import { Stepper } from './Stepper';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Stepper',
  component: Stepper,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <Stepper {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  steps: [
    {
      id: 'Lorem',
    },
    {
      id: 'ipsum',
    },
    {
      id: 'dolor ',
    },
    {
      id: 'sit ',
    },
    {
      id: 'amet',
    },
  ],
  currentStep: 2,
};
