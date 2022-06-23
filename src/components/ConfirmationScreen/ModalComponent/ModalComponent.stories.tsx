import { ModalComponent } from './ModalComponent';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import styled from '@emotion/styled/macro';

export default {
  title: 'components/ConfirmationScreen/Components/ModalComponent',
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

const ModalContainer = styled.div`
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #211f24;
  box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  margin-top: 77px;
  padding: 30px;
`;

const Template: ComponentStory<typeof ModalComponent> = (args) => (
  <StorybookWrapper>
    <div style={{ background: 'red', height: '90vh' }}>Show glass effect</div>
    <ModalComponent {...args}>
      <ModalContainer>
        <div>Test</div>
        <div>Test</div>
        <div>Test</div>
        <div>Test</div>
        <div>Test</div>
        <div>Test</div>
      </ModalContainer>
    </ModalComponent>
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = { isOpen: true };
