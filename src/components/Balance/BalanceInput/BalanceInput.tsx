import log from 'loglevel';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { useFormContext, Controller, ControllerRenderProps } from 'react-hook-form';
import { prefixMap, MetricUnit, formatFromSIWithPrecision12, unitMap } from '../FormattedBalance/metricUnit';
import { MetricUnitSelector } from './MetricUnitSelector/MetricUnitSelector';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { Asset } from '../../../generated/graphql';
import './BalanceInput.scss';

log.setDefaultLevel('debug')
export interface BalanceInputProps {
    defaultUnit: MetricUnit,
    name: string,
    asset?: Asset
}

export const thousandsSeparatorSymbol = ' ';
export const currencyMaskOptions = {
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol,
    allowDecimal: true,
    decimalSymbol: '.',
    // TODO: adjust decimal limit dependin on the selected MetricUnit
    decimalLimit: 12,
    // integerLimit: 7,
    allowNegative: false,
    allowLeadingZeroes: false,
}

export const BalanceInput = ({
    name,
    defaultUnit,
    asset
}: BalanceInputProps) => {
    const { control, setValue, getValues } = useFormContext();
    const [unit, setUnit] = useState(defaultUnit);
    const [rawValue, setRawValue] = useState<string | undefined>();

    const currencyMask = useMemo(() => createNumberMask({
        ...currencyMaskOptions
    }), [unit])

    // TODO: type the value
    const setValueAs = useCallback(value => {
        // entering dangerous waters
        value = value?.replaceAll(thousandsSeparatorSymbol, '');
        // this converts the given number to unit `NONE` and formats it with 12 digit precision
        const formattedValue = formatFromSIWithPrecision12(value, unit);
        log.debug('BalanceInput', 'setValueAs', value, formattedValue, unit);
        return formattedValue;
    }, [formatFromSIWithPrecision12, unit]);

    // TODO better types for `field`
    const handleOnChange = useCallback((field: ControllerRenderProps, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        field.onChange(setValueAs(value));
        setRawValue(value);
    }, [setValueAs, setRawValue]);

    useEffect(() => {
        log.debug('BalanceInput', 'unit changed', rawValue, unit);
        setValue(name, setValueAs(rawValue));
    }, [unit]);

    return <div>
        <div>{asset?.id}</div>
        <MetricUnitSelector 
            unit={unit}
            units={Object.values(MetricUnit)}
            onUnitSelected={unit => setUnit(unit)}
        />
        <Controller 
            control={control}
            name={name}
            render={
                (({ field }) => (
                    <MaskedInput 
                        mask={currencyMask}
                        ref={field.ref}
                        onChange={e => handleOnChange(field, e)}
                    />
                ))
            }
        />
    </div>
}