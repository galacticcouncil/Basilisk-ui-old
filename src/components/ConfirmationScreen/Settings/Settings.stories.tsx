import { Settings } from './Settings';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { linkTo } from '@storybook/addon-links';
import { FormProvider, useForm } from 'react-hook-form';

export default {
  title: 'components/ConfirmationScreen/Components/Settings',
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
  const defaults = {
    slippage: { radio: '0.5', auto: true },
    lifetime: { blockNumber: '0', infinite: true },
    nonce: '',
    tipForBlockAuthor: '',
  };
  const methods = useForm({ defaultValues: defaults });
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
  error: '',
  unit: 'BSX',
  onBack: linkTo('components/ConfirmationScreen/Components/ConfirmSwap'),
  onSave: linkTo('components/ConfirmationScreen/Components/ConfirmSwap'),
};
