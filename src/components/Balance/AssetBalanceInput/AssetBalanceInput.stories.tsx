import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { MetricUnit } from '../metricUnit'
import { AssetBalanceInput } from './AssetBalanceInput'

import cssColors from './../../../misc/colors.module.scss'
import { StorybookWrapper } from '../../../misc/StorybookWrapper'

export default {
  title: 'components/Balance/AssetBalanceInput',
  component: AssetBalanceInput,
  args: {
    defaultAsset: 'BSX',

    assets: ['BSX', 'kUSD'],
    defaultUnit: MetricUnit.k,
    balanceInputName: 'test-input',
    assetInputName: 'test-input-asset'
  }
} as ComponentMeta<typeof AssetBalanceInput>

const Template: ComponentStory<typeof AssetBalanceInput> = (args) => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const methods = useForm()
  const balanceInputRef = useRef(null)

  useEffect(() => {
    console.log('form', methods.getValues())
    console.log('balanceInputRef', balanceInputRef.current)
  }, [methods.watch()])

  return (
    <StorybookWrapper>
      <div
        style={{
          backgroundColor: cssColors.gray2
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
              balanceInputRef={balanceInputRef}
            />
            {/* <br/>
                    <div className='style2'>
                        <AssetBalanceInput 
                            {...args} 
                            modalContainerRef={modalContainerRef}
                            balanceInputRef={balanceInputRef}
                        />
                    </div>
                    <br/>
                    <div style={{
                        width: '325px'
                    }}>
                        <AssetBalanceInput 
                            {...args} 
                            modalContainerRef={modalContainerRef}
                            balanceInputRef={balanceInputRef}
                        />
                    <br/>
                    <div className='style2'>
                        <AssetBalanceInput 
                            {...args} 
                            modalContainerRef={modalContainerRef}
                            balanceInputRef={balanceInputRef}
                        />
                    </div>
                    </div> */}
          </form>
        </FormProvider>
      </div>
    </StorybookWrapper>
  )
}

export const Default = Template.bind({})
