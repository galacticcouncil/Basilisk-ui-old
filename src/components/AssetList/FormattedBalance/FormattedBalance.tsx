import { maskValue } from '../../ConfirmationScreen/helpers/mask';
import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { Asset, AssetBalance } from '../Row/Row';

export interface FormattedBalanceProps {
  assetBalance: AssetBalance;
  kind?: TextKind;
  // TODO: Get from context
  assets?: Asset[];
}

export const Balance = ({
  assetBalance,
  kind,
  assets,
}: FormattedBalanceProps): string => {
  const assetSymbol =
    assetBalance.id === '0' || assetBalance.id === undefined
      ? 'BSX'
      : assets?.filter((asset) => asset.id === assetBalance.id)[0]?.symbol ??
        '';
  const formattedValue = `${maskValue(assetBalance.value)} ${assetSymbol}`;

  return formattedValue;
};

export const FormattedBalance = (props: FormattedBalanceProps) => {
  return <Text id={Balance(props)} kind={props.kind} />;
};
