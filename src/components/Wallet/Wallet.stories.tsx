import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import cssColors from './../../misc/colors.module.scss';
import { StorybookWrapper } from '../../misc/StorybookWrapper';

import { Wallet } from './Wallet';
import { toPrecision12 } from '../../hooks/math/useToPrecision';

export default {
  title: 'components/Wallet',
  component: Wallet,
  args: {
    account: {
      name: 'Alice 1',
      balances: [{ assetId: '0', balance: toPrecision12('100200') }],
      id: 'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH',
      isActive: true,
      vestingSchedule: {},
    },
  },
} as ComponentMeta<typeof Wallet>;

const Template: ComponentStory<typeof Wallet> = (args) => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const methods = useForm();

  return (
    <StorybookWrapper>
      <div
        style={{
          margin: '-1rem',
          padding: '1rem',
          backgroundColor: cssColors.gray2,
        }}
      >
        {/* This is where the underlying modal should be rendered */}
        <div ref={modalContainerRef} />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            {/*
                        Pass the ref to the element above, so that the Wallet
                        can render the modal there.
                    */}
            <div
              style={{
                width: '360px',
              }}
            >
              <Wallet {...args} modalContainerRef={modalContainerRef} />
            </div>
          </form>
        </FormProvider>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
