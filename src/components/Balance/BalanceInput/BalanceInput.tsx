import log from 'loglevel';
import { useCallback, useEffect, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { useFormContext, Controller } from 'react-hook-form';
import { prefixMap, MetricUnit, formatFromSIWithPrecision12 } from '../FormattedBalance/FormattedBalance';

export interface BalanceInputProps {
    unit: MetricUnit,
    name: string
}

export const thousandsSeparatorSymbol = ',';
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
    unit,
    name
}: BalanceInputProps) => {
    const { register, control } = useFormContext();

    const currencyMask = useMemo(() => createNumberMask({
        ...currencyMaskOptions
    }), [unit])

    // TODO: type the value
    const setValueAs = useCallback(value => {
        // entering dangerous waters
        value = value?.replaceAll(thousandsSeparatorSymbol, '');
        // this converts the given number to unit `NONE` and formats it with 12 digit precision
        const formattedValue = formatFromSIWithPrecision12(value, unit);
        log.debug('BalanceInput', 'setValueAs', value, formattedValue);
        return formattedValue;
    }, [formatFromSIWithPrecision12, unit]);

    return <div>
        <Controller 
            control={control}
            name={name}
            render={
                (({ field }) => (
                    <MaskedInput 
                        mask={currencyMask}
                        ref={field.ref}
                        onChange={e => field.onChange(setValueAs(e.target.value))}
                    />
                ))
            }
        />
        <span>{unit}</span>
    </div>
}