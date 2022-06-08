import { SlippageSlider } from './SlippageSlider';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { FormProvider, useForm } from 'react-hook-form';

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
  const methods = useForm({ defaultValues: { slippage: { radio: '0.5' } } });
  console.log('watch(): ', JSON.stringify(methods.watch()));

  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            <SlippageSlider />
          </form>
        </FormProvider>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {};
