import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { MetricUnit } from '../FormattedBalance/FormattedBalance';
import { AssetBalanceInput } from './AssetBalanceInput';

export default {
    title: 'components/Balance/AssetBalanceInput',
    component: AssetBalanceInput,
    args: {
        asset: {
            id: '0'
        },
        assets: [
            {
                id: '0',
            },
            {
                id: '1'
            }
        ],
        unit: MetricUnit.k,
        name: 'test-input'
    }
} as ComponentMeta<typeof AssetBalanceInput>

const Template: ComponentStory<typeof AssetBalanceInput> = (args) => {
    const modalContainerRef = useRef<HTMLDivElement | null>(null);
    const methods = useForm();

    return <div>
        {/* This is where the underlying modal should be rendered */}
        <div ref={modalContainerRef}></div>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(() => {})}>
                {/* 
                    Pass the ref to the element above, so that the TokenBalanceInput
                    can render the modal there.
                */}
                <AssetBalanceInput {...args} modalContainerRef={modalContainerRef}/>
            </form>
        </FormProvider>
    </div>
}

export const Default = Template.bind({});