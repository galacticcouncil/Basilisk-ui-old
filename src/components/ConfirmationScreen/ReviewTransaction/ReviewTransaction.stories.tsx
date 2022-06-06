import { ReviewTransaction } from './ReviewTransaction';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import * as Stepper from '../Stepper/Stepper.stories';
import * as MethodText from '../MethodText/MethodText.stories';
import { MethodTextProps } from '../MethodText/MethodText';
import * as Table from '../Table/Table.stories';
import { TableProps } from '../Table/Table';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'components/ConfirmationScreen/ReviewTransaction',
  component: ReviewTransaction,
  argTypes: {
    onCancel: {
      action: 'Cancel',
    },
    onSign: {
      action: 'Review',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ReviewTransaction>;

const Template: ComponentStory<typeof ReviewTransaction> = (args) => (
  <StorybookWrapper>
    <ReviewTransaction {...args} />
  </StorybookWrapper>
);

export const Default = Template.bind({});
Default.args = {
  loading: false,
  methodCall: MethodText.Default.args as MethodTextProps,
  steps: {
    steps: Stepper.Default.args?.steps || [],
    currentStep: 2,
  },
  table: Table.NoEdit.args as TableProps,
  onCancel: linkTo('components/ConfirmationScreen/ConfirmSwap'),
  onSign: linkTo('components/ConfirmationScreen/SentTransaction', 'Sent'),
};
