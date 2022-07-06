import { LoadingPlaceholder } from './LoadingPlaceholder';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/AssetList/Components/LoadingPlaceholder',
  component: LoadingPlaceholder,
  argTypes: {
    width: {
      defaultValue: 100,
      control: {
        type: 'range',
        min: 10,
        max: 200,
        step: 1,
      },
    },
    height: {
      defaultValue: 50,
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
} as ComponentMeta<typeof LoadingPlaceholder>;

const Template: ComponentStory<typeof LoadingPlaceholder> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <LoadingPlaceholder {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  width: 100,
  height: 50,
};
