import { Text, TextVariant } from './Text';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/Text',
  component: Text,
  argTypes: {
    text: {
      type: 'string',
    },
    variant: {
      options: TextVariant,
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
      <div style={{ width: '480px' }}>
        <Text {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { id: 'Lorem ipsum' };

export const Title = Template.bind({});
Title.args = { id: 'Lorem ipsum', variant: TextVariant.Title };

export const TitleError = Template.bind({});
TitleError.args = { id: 'Lorem ipsum', variant: TextVariant.TitleError };

export const NormalText = Template.bind({});
NormalText.args = { id: 'Lorem ipsum', variant: TextVariant.Text };

export const TextUrl = Template.bind({});
TextUrl.args = { id: 'Lorem ipsum', variant: TextVariant.TextUrl };

export const TextError = Template.bind({});
TextError.args = { id: 'Lorem ipsum', variant: TextVariant.TextError };

export const Button = Template.bind({});
Button.args = { id: 'Lorem ipsum', variant: TextVariant.Button };

export const ButtonLoading = Template.bind({});
ButtonLoading.args = { id: 'Lorem ipsum', variant: TextVariant.ButtonLoading };

export const RowLabel = Template.bind({});
RowLabel.args = { id: 'Lorem ipsum', variant: TextVariant.RowLabel };

export const RowValue = Template.bind({});
RowValue.args = { id: 'Lorem ipsum', variant: TextVariant.RowValue };
