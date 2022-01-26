import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MetricUnit } from '../metricUnit';
import { AssetBalanceInput } from './AssetBalanceInput';

import cssColors from './../../../misc/colors.module.scss';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

import './AssetBalanceInput2.scss';

export default {
  title: 'components/Balance/AssetBalanceInput',
  component: AssetBalanceInput,
  args: {
    asset: {
      id: 'BSX',
    },
    assets: [
      {
        id: 'BSX',
      },
      {
        id: 'kUSD',
      },
    ],
    defaultUnit: MetricUnit.k,
    name: 'test-input',
  },
} as ComponentMeta<typeof AssetBalanceInput>;

const Template: ComponentStory<typeof AssetBalanceInput> = (args) => {
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
        <div ref={modalContainerRef}></div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            {/* 
                        Pass the ref to the element above, so that the TokenBalanceInput
                        can render the modal there.
                    */}
            <AssetBalanceInput
              {...args}
              modalContainerRef={modalContainerRef}
            />
            <br />
            <div className="style2">
              <AssetBalanceInput
                {...args}
                modalContainerRef={modalContainerRef}
              />
            </div>
            <br />
            <div
              style={{
                width: '325px',
              }}
            >
              <AssetBalanceInput
                {...args}
                modalContainerRef={modalContainerRef}
              />
              <br />
              <div className="style2">
                <AssetBalanceInput
                  {...args}
                  modalContainerRef={modalContainerRef}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
