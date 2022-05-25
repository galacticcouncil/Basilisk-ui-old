import { Text, TextKind } from './Text';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Text',
  component: Text,
  argTypes: {
    id: {
      type: 'string',
    },
    kind: {
      options: TextKind,
      control: {
        type: 'inline-radio',
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
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <Text {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { id: 'Lorem ipsum' };

export const Title = Template.bind({});
Title.args = { id: 'Lorem ipsum', kind: TextKind.Title };

export const TitleError = Template.bind({});
TitleError.args = { id: 'Lorem ipsum', kind: TextKind.TitleError };

export const NormalText = Template.bind({});
NormalText.args = { id: 'Lorem ipsum', kind: TextKind.Text };

export const TextUrl = Template.bind({});
TextUrl.args = { id: 'Lorem ipsum', kind: TextKind.TextUrl };

export const TextError = Template.bind({});
TextError.args = { id: 'Lorem ipsum', kind: TextKind.TextError };
