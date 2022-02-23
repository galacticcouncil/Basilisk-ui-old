import log from 'loglevel';
import React, { MutableRefObject, Ref, useMemo, useState } from 'react';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { useFormContext, Controller } from 'react-hook-form';
import {  MetricUnit } from '../metricUnit';
import { MetricUnitSelector } from './MetricUnitSelector/MetricUnitSelector';
import { useDefaultUnit } from './hooks/useDefaultUnit';
import { useHandleOnChange } from './hooks/useHandleOnChange';
import classNames from 'classnames';

import './BalanceInput.scss';

log.setDefaultLevel('debug')
// TODO Make default unit non-required?
export interface BalanceInputProps {
    defaultUnit?: MetricUnit,
    name: string,
    showMetricUnitSelector?: boolean
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

const MaskedInputWithRef = React.forwardRef((topLevelProps: MaskedInputProps, ref: Ref<HTMLInputElement>) => {
    return (
      <MaskedInput
        render={(textMaskRef, props) => (
          <input
            {...props}
            ref={(node) => {
              if (node) {
                console.log('node', node)
                textMaskRef(node);
                if (ref) {
                    console.log('i ref', ref);
                  (ref as MutableRefObject<HTMLInputElement>).current = node;
                }
              }
            }}
          />
        )}
        {...topLevelProps}
      />
    );
  });

export const BalanceInput = ({
    name,
    defaultUnit = MetricUnit.NONE,
    showMetricUnitSelector = true,
}: BalanceInputProps) => {
    const { control, register, setValue, getValues } = useFormContext();
    const [rawValue, setRawValue] = useState<string | undefined>();
    const { unit, setUnit } = useDefaultUnit(defaultUnit);

    const currencyMask = useMemo(() => createNumberMask({
        ...currencyMaskOptions
    }), [unit])

    const handleOnChange = useHandleOnChange({ setValue, unit, name });

    return <div className={'balance-input flex-container ' + classNames({
        'no-selector': !showMetricUnitSelector
    })}>
        <div className='balance-input__input-wrapper'>
            <Controller 
                control={control}
                name={name}
                render={
                    (({ field }) => (
                        <MaskedInput
                            mask={currencyMask}
                            ref={(ref) => {
                                field.ref(ref?.inputElement);
                            }}
                            onChange={e => handleOnChange(field, e)}
                        />
                    ))
                }
            />
        </div>
        {showMetricUnitSelector
            ? (
                <div className='balance-input__info flex-container column'>
                    <MetricUnitSelector 
                        unit={unit}
                        onUnitSelected={setUnit}
                    />
                </div>
            )
            : <></>
        }
    </div>
}