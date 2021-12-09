import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { MetricUnit } from '../metricUnit';
import { BalanceInput, BalanceInputProps } from './BalanceInput';

import cssColors from './../../../misc/colors.module.scss'
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

const args: { props: BalanceInputProps[] } = {
    props: [
        {
            defaultUnit: MetricUnit.k,
            name: 'balanceInputExample_k'
        },
        {
            defaultUnit: MetricUnit.NONE,
            name: 'balanceInputExample_NONE'
        },
        {
            defaultUnit: MetricUnit.m,
            name: 'balanceInputExample_m',
        },
        {
            defaultUnit: MetricUnit.p,
            name: 'balanceInputExample_p',
        }
    ]    
}
export default {
    title: 'components/Balance/BalanceInput',
    component: BalanceInput,
    args,
} as ComponentMeta<typeof BalanceInput>;

const Template = (args: { props: BalanceInputProps[] }) => {
    const methods = useForm({});

    const onSubmit = useCallback((data: any) => {
        Object.keys(data)
            .forEach((key: string) => {
                console.log(fromPrecision12(data[key]));
            });
    }, []);
    
    return <StorybookWrapper>
        <FormProvider {...methods}>
            <form style={{
                    margin: '-1rem',
                    padding: '1rem',
                    backgroundColor: cssColors.gray2
                }} 
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                {
                    args.props.map((args, i) => <>
                        <BalanceInput key={i} {...args} /><br />
                    </>
                )}
                <br />
                <input type="submit" />
            </form>
        </FormProvider>
    </StorybookWrapper>
}

export const Default = Template.bind({});