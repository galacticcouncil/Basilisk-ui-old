import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { MetricUnit } from '../FormattedBalance/metricUnit';
import { BalanceInput, BalanceInputProps } from './BalanceInput';

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
            name: 'balanceInputExample_m'
        },
        {
            defaultUnit: MetricUnit.p,
            name: 'balanceInputExample_p'
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
    
    return <>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {args.props.map((args, i) => <BalanceInput key={i} {...args} />)}
                <input type="submit" />
            </form>
        </FormProvider>
    </>
}

export const Default = Template.bind({});