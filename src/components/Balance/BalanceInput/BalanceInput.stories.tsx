import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { MetricUnit } from '../FormattedBalance/FormattedBalance';
import { BalanceInput, BalanceInputProps } from './BalanceInput';

const args: { props: BalanceInputProps[] } = {
    props: [
        {
            unit: MetricUnit.k,
            name: 'balanceInputExample_k'
        },
        {
            unit: MetricUnit.NONE,
            name: 'balanceInputExample_NONE'
        },
        {
            unit: MetricUnit.m,
            name: 'balanceInputExample_m'
        },
        {
            unit: MetricUnit.p,
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
        <p>
            TODO: when updating story controls, the underlying `register` form call causes a loop.
            This only has effect in the storybook development environment
        </p>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {args.props.map(args => <BalanceInput {...args} />)}
                <input type="submit" />
            </form>
        </FormProvider>
    </>
}

export const Default = Template.bind({});