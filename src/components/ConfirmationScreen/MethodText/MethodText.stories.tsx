import { MethodText } from './MethodText';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/MethodText',
  component: MethodText,
  argTypes: {
    method: {
      type: 'string',
    },
    call: {
      type: 'string',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof MethodText>;

const Template: ComponentStory<typeof MethodText> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <MethodText {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  method: 'utility.batchAll(calls)',
  call: JSON.stringify({
    calls: [
      {
        args: {
          asset_out: '0',
          asset_in: '1',
          amount: '10 000 000 000 000 000',
          max_limit: '33 000 000 000 000',
          discount: false,
        },
        method: 'buy',
        section: 'xyk',
      },
      {
        args: {
          asset_in: '1',
          asset_out: '0',
          amount: '10 000 000 000 000 000',
          max_limit: '33 000 000 000 000',
          discount: false,
        },
        method: 'sell',
        section: 'xyk',
      },
    ],
  }),
};
