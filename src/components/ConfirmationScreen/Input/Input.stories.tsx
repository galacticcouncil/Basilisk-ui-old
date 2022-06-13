import { Input } from './Input';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { FormProvider, useForm } from 'react-hook-form';

export default {
  title: 'components/ConfirmationScreen/Input',
  component: Input,
  argTypes: {
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    value: {
      type: 'string',
    },
    unit: {
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
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  const defaults = { test: '112312.21323' };
  const methods = useForm({ defaultValues: defaults });
  console.log('watch(): ', methods.watch());

  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            <Input {...args} value={methods.getValues('test')} />
          </form>
        </FormProvider>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  label: {
    id: 'Tip for block author',
  },
  error: {
    id: 'Not enough funds',
  },
  tooltip: {
    id: 'This is tooltip',
  },
  unit: 'BSX',
};
