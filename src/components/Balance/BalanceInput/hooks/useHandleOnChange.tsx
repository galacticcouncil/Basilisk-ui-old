import log from 'loglevel';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ControllerRenderProps, UseFormSetValue } from 'react-hook-form';
import { formatFromSIWithPrecision12, MetricUnit } from '../../metricUnit';
import { BalanceInputProps, thousandsSeparatorSymbol } from '../BalanceInput';

export const useHandleOnChange = ({
    setValue,
    name,
    unit
}: {
    setValue: UseFormSetValue<any>,
    name: BalanceInputProps['name'],
    unit: MetricUnit
}) => {
    const [rawValue, setRawValue] = useState<string | undefined>();

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

    return handleOnChange;
}