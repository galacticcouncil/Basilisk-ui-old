import { last } from 'lodash';
import log from 'loglevel';
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ControllerRenderProps, UseFormSetValue } from 'react-hook-form';
import { formatFromSIWithPrecision12, MetricUnit } from '../../metricUnit';
import { BalanceInputProps, thousandsSeparatorSymbol } from '../BalanceInput';

export const useHandleOnChange = ({
  setValue,
  name,
  unit,
  inputRef,
}: {
  setValue: UseFormSetValue<any>;
  name: BalanceInputProps['name'];
  unit: MetricUnit;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
}) => {
  const [rawValue, setRawValue] = useState<string | undefined>();
  /**
   * Persists the intent to input decimal numbers by capturing the
   * 'dot' a.k.a. the decimal point in the raw user input
   */
  const [isLastCharDot, setIsLastCharDot] = useState<boolean>(false);

  // TODO: type the value
  const setValueAs = useCallback(
    (value) => {
      // entering dangerous waters
      const lastChar = last(value?.split(''));
      value = value?.replaceAll(thousandsSeparatorSymbol, '');
      setIsLastCharDot(lastChar === '.');
      log.debug('BalanceInput', value, lastChar, isLastCharDot);
      // this converts the given number to unit `NONE` and formats it with 12 digit precision
      const formattedValue = formatFromSIWithPrecision12(value, unit);
      log.debug('BalanceInput', 'setValueAs', value, formattedValue, unit);
      return formattedValue;
    },
    [formatFromSIWithPrecision12, unit]
  );

  // TODO better types for `field`
  const handleOnChange = useCallback(
    (field: ControllerRenderProps, e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      log.debug('BalanceInput', 'handleOnChange', value);
      setRawValue(value);
      field.onChange(setValueAs(value));
    },
    [setValueAs, setRawValue]
  );

  useEffect(() => {
    const value = setValueAs(rawValue);
    log.debug('BalanceInput', 'unit changed', rawValue, unit, value);
    setValue(name, value);
  }, [unit, rawValue]);

  return { handleOnChange, isLastCharDot };
};
