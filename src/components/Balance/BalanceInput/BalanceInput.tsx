import log from 'loglevel';
import React, {
  forwardRef,
  MutableRefObject,
  Ref,
  useMemo,
  useRef,
  useState,
} from 'react';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useFormContext, Controller } from 'react-hook-form';
import { formatToSIWithPrecision12, MetricUnit } from '../metricUnit';
import { MetricUnitSelector } from './MetricUnitSelector/MetricUnitSelector';
import { useDefaultUnit } from './hooks/useDefaultUnit';
import { useHandleOnChange } from './hooks/useHandleOnChange';
import classNames from 'classnames';

import './BalanceInput.scss';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import BigNumber from 'bignumber.js';

log.setDefaultLevel('debug');
// TODO Make default unit non-required?
export interface BalanceInputProps {
  defaultUnit?: MetricUnit;
  name: string;
  showMetricUnitSelector?: boolean;
  /**
   * This whole property exists due to my inability to figure out
   * how to pass an actual input ref through react-hook-form controller's field.ref
   *
   * field.ref ends up being a wrapper for validationa and input focusing, without the ability to
   * retrieve the actual input element from the form state
   */
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  required?: boolean;
  disabled?: boolean
}

const MaskedInputWithRef = React.forwardRef(
  (topLevelProps: MaskedInputProps, ref: Ref<HTMLInputElement>) => {
    return (
      <MaskedInput
        render={(textMaskRef, props) => (
          <input
            {...props}
            ref={(node) => {
              if (node) {
                textMaskRef(node);
                if (ref) {
                  (ref as MutableRefObject<HTMLInputElement>).current = node;
                }
              }
            }}
          />
        )}
        {...topLevelProps}
      />
    );
  }
);

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
};

export const BalanceInput = ({
  name,
  defaultUnit = MetricUnit.NONE,
  showMetricUnitSelector = true,
  inputRef,
  required,
  disabled
}: BalanceInputProps) => {
  const { control, register, setValue, getValues, watch } = useFormContext();
  const { unit, setUnit } = useDefaultUnit(defaultUnit);

  const currencyMask = useMemo(
    () =>
      createNumberMask({
        ...currencyMaskOptions,
      }),
    [unit]
  );

  const { handleOnChange, rawValue } = useHandleOnChange({ setValue, unit, name, inputRef, getValues, value: watch(name) });

  return (
    <div
      className={
        'balance-input ' +
        classNames({
          'no-selector': !showMetricUnitSelector,
        })
      }
    >
      <div className="balance-input__input-wrapper">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <>
              <MaskedInputWithRef
                mask={currencyMask}
                inputMode="decimal"
                // TODO: get rid of this
                // value={new BigNumber(
                //   formatToSIWithPrecision12(field.value, unit) || ''
                // ).toString() + (persistLastChar ? lastChar : '')}
                value={rawValue}
                onBlur={field.onBlur}
                ref={inputRef}
                required={required}
                onChange={(e) => handleOnChange(field, e)}
                placeholder="0.00"
                disabled={disabled}
              />
            </>
          )}
        />
      </div>
      {showMetricUnitSelector ? (
        <div className="balance-input__info">
          <MetricUnitSelector unit={unit} onUnitSelected={setUnit} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
