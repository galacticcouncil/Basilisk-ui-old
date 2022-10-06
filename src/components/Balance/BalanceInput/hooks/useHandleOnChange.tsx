import { debounce } from 'lodash'
import log from 'loglevel'
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  ControllerRenderProps,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import {
  formatFromSIWithPrecision12,
  formatToSIWithPrecision12,
  MetricUnit
} from '../../metricUnit'
import { BalanceInputProps, thousandsSeparatorSymbol } from '../BalanceInput'

export const useHandleOnChange = ({
  setValue,
  name,
  unit,
  inputRef,
  getValues,
  value
}: {
  setValue: UseFormSetValue<any>
  getValues: UseFormGetValues<any>
  name: BalanceInputProps['name']
  unit: MetricUnit
  inputRef?: MutableRefObject<HTMLInputElement | null>
  value: UseFormWatch<any>
}) => {
  const [rawValue, setRawValue] = useState<string | undefined>()
  // TODO: type the value
  const setValueAs = useCallback(
    (value) => {
      value = value?.replaceAll(thousandsSeparatorSymbol, '')
      // this converts the given number to unit `NONE` and formats it with 12 digit precision
      const formattedValue = formatFromSIWithPrecision12(value, unit)
      log.debug('BalanceInput', 'setValueAs', value, formattedValue, unit)
      return formattedValue
    },
    [formatFromSIWithPrecision12, unit]
  )

  // TODO better types for `field`
  const handleOnChange = useCallback(
    (field: ControllerRenderProps, e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      log.debug('BalanceInput', 'handleOnChange', value)
      setRawValue(value)
      field.onChange(setValueAs(value))
    },
    [setValueAs, setRawValue]
  )

  // useEffect(() => {
  //   const value = setValueAs(rawValue);
  //   log.debug('BalanceInput', 'unit changed', rawValue, unit, value);
  //   setValue(name, value);
  // }, [unit, rawValue]);

  useEffect(() => {
    const rawValue = formatToSIWithPrecision12(getValues(name), unit)
    setRawValue(rawValue)
  }, [unit])

  useEffect(() => {
    const debounced = debounce(
      () => {
        const rawValue = formatToSIWithPrecision12(getValues(name), unit)
        setRawValue(rawValue)

        const value = setValueAs(rawValue)
        setValue(name, value)
      },
      700,
      { leading: true }
    )

    debounced()

    return () => debounced.cancel()
  }, [value])

  return { handleOnChange, rawValue }
}
