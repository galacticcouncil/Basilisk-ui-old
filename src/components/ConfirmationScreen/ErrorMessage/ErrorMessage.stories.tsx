import { ErrorMessage } from './ErrorMessage';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/ConfirmationScreen/ErrorMessage',
  component: ErrorMessage,
  argTypes: {
    text: {
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
} as ComponentMeta<typeof ErrorMessage>;

const Template: ComponentStory<typeof ErrorMessage> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <ErrorMessage {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const ShortText = Template.bind({});
ShortText.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

export const LongText = Template.bind({});
LongText.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet sem magna. Praesent lectus leo, mattis vitae dolor quis, volutpat feugiat augue. Etiam ut convallis leo, vel gravida velit. Nunc congue bibendum tortor, vitae placerat dui consectetur nec. Nullam gravida risus vel turpis tempus posuere. Aenean vitae eros pretium, tincidunt nulla vitae, viverra risus.',
};
