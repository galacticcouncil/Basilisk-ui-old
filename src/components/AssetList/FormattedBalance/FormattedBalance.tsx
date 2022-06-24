import { Text } from '../../ConfirmationScreen/Text/Text';
import { TextKind } from '../../ConfirmationScreen/Text/TextTheme';
import { useBalanceContext } from '../hooks/UseBalanceContext';
import { AssetBalance } from '../Row/Row';

export interface FormattedBalanceProps {
  assetBalance: AssetBalance;
  kind?: TextKind;
}

export const FormattedBalance = ({
  assetBalance,
  kind,
}: FormattedBalanceProps) => {
  const value = useBalanceContext(assetBalance);

  return <Text id={value} kind={kind} />;
};
