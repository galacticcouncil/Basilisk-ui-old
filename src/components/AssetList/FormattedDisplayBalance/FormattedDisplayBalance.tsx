import { maskValue } from '../../ConfirmationScreen/helpers/mask';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Asset, AssetBalance } from '../Row/Row';

export interface FormattedDisplayBalanceProps {
  assetBalance: AssetBalance;
  kind?: TextKind;
  // TODO: Get from context
  assets?: Asset[];
  currency?: {
    suffix?: string;
    prefix?: string;
  };
}

export const calculateDisplayBalance = ({
  assetBalance,
  assets,
}: FormattedDisplayBalanceProps): string => {
  const exchangeRate =
    assetBalance.id === undefined
      ? '1'
      : assets?.filter((asset) => asset.id === assetBalance.id)[0]
          ?.exchangeRate ?? '0';

  return maskValue(
    (
      Number(assetBalance.value.replace(/ /g, '')) / Number(exchangeRate)
    ).toFixed(2)
  );
};

export const DisplayBalance = ({
  assetBalance,
  currency = {
    prefix: '$',
  },
  assets,
}: FormattedDisplayBalanceProps): string => {
  const formattedValue = `
  ${currency?.prefix ?? ''} 
  ${calculateDisplayBalance({ assetBalance: assetBalance, assets: assets })} 
  ${currency?.suffix ?? ''}`;

  return formattedValue;
};

export const DisplayBalanceSplit = ({
  assetBalance,
  currency = {
    prefix: '$',
  },
  assets,
}: FormattedDisplayBalanceProps): [string, string] => {
  const balance = calculateDisplayBalance({
    assetBalance: assetBalance,
    assets: assets,
  });
  const splitValues = balance.split(/[,.]/);
  return [
    `${currency?.prefix ?? ''} ${splitValues[0]}.`,
    `${splitValues[1]} ${currency?.suffix ?? ''}`,
  ];
};

export const FormattedDisplayBalance = (
  props: FormattedDisplayBalanceProps
) => {
  return <Text id={DisplayBalance(props)} kind={props.kind} />;
};
