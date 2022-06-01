import { SlippageSlider } from './SlippageSlider';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/SlippageSlider',
  component: SlippageSlider,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof SlippageSlider>;

const Template: ComponentStory<typeof SlippageSlider> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <SlippageSlider {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { slippage: { radio: 0.5 } };
