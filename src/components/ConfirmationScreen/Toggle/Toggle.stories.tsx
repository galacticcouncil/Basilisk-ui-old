import { Toggle } from './Toggle';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Components/Toggle',
  component: Toggle,
  argTypes: {
    toggled: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
    },
    onClick: {
      action: 'Click',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px', background: '#211F24' }}>
        <Toggle {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { toggled: false, disabled: false };
