import { conformToMask } from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

export const thousandsSeparatorSymbol = ' ';
export const mask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 12,
  // integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
});

export const maskValue = (value: string) => {
  return conformToMask(value, mask).conformedValue;
};
