import { useMemo } from 'react';
import { maskValue } from '../../ConfirmationScreen/helpers/mask';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { useDisplayCurrencyContext } from '../hooks/UseDisplayCurrencyContext';
import { useDisplayValueContext } from '../hooks/UseDisplayValueContext';
import { AssetBalance } from '../Row/Row';

export interface Currency {
  suffix?: string;
  prefix?: string;
}
export interface FormattedDisplayBalanceProps {
  assetBalance: AssetBalance;
  kind?: TextKind;
}

export const calculateDisplayBalance = (
  assetBalance: AssetBalance,
  exchangeRate: string
): string => {
  return maskValue(
    (
      Number(assetBalance.value.replace(/ /g, '')) / Number(exchangeRate)
    ).toFixed(2)
  );
};

export const DisplayBalance = (
  assetBalance: AssetBalance,
  exchangeRate: string,
  currency: Currency
): string => {
  const formattedValue = `
  ${currency?.prefix ?? ''} 
  ${calculateDisplayBalance(assetBalance, exchangeRate)} 
  ${currency?.suffix ?? ''}`;

  return formattedValue;
};

export const DisplayBalanceSplit = (
  assetBalance: AssetBalance,
  exchangeRate: string,
  currency: Currency
): [string, string] => {
  const balance = calculateDisplayBalance(assetBalance, exchangeRate);

  const splitValues = balance.split(/[,.]/);

  return [
    `${currency?.prefix ?? ''} ${splitValues[0]}.`,
    `${splitValues[1]} ${currency?.suffix ?? ''}`,
  ];
};

export const FormattedDisplayBalance = ({
  assetBalance,
  kind,
}: FormattedDisplayBalanceProps) => {
  const exchangeRate = useDisplayValueContext(assetBalance.id);
  const currency = useDisplayCurrencyContext();
  const value = useMemo(
    () => DisplayBalance(assetBalance, exchangeRate, currency),
    [assetBalance, exchangeRate, currency]
  );

  return <Text id={value} kind={kind} />;
};
