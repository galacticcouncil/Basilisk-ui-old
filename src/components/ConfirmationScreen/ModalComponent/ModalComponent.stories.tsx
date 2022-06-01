import { ModalComponent } from './ModalComponent';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/ModalComponent',
  component: ModalComponent,
  argTypes: {
    isOpen: {
      type: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ModalComponent>;

const Template: ComponentStory<typeof ModalComponent> = (args) => (
  <StorybookWrapper>
    <ModalComponent {...args}>
      <div>Test</div>
      <div>Test</div>
      <div>Test</div>
      <div>Test</div>
      <div>Test</div>
      <div>Test</div>
    </ModalComponent>
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = { isOpen: true };
