import { Settings } from './Settings';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';
import { FormProvider, useForm } from 'react-hook-form';

export default {
  title: 'components/ConfirmationScreen/Settings',
  component: Settings,
  argTypes: {
    isOpened: {
      type: 'boolean',
    },
    onBack: {
      action: 'Action',
    },
    onSave: {
      action: 'Action',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Settings>;

const Template: ComponentStory<typeof Settings> = (args) => {
  const defaultSettings = {
    slippage: { radio: '0.5', auto: true },
    lifetime: { blockNumber: '0', infinite: true },
  };
  const methods = useForm({ defaultValues: defaultSettings });
  console.log('watch(): ', JSON.stringify(methods.watch()));

  return (
    <StorybookWrapper>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <Settings {...args} />
        </form>
      </FormProvider>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpened: true,
  error: '',
  unit: 'BSX',
  onBack: linkTo('components/ConfirmationScreen/ConfirmSwap'),
  onSave: linkTo('components/ConfirmationScreen/ConfirmSwap'),
};
