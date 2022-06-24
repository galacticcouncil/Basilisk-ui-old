import { useMemo } from 'react';
import { maskValue } from '../../ConfirmationScreen/helpers/mask';
import { AssetBalance } from '../Row/Row';
import { dummyData } from './DummyData';

export const useBalanceContext = (assetBalance: AssetBalance): string => {
  const assets = dummyData;
  const assetSymbol =
    assetBalance.id === '0' || assetBalance.id === undefined
      ? 'BSX'
      : assets?.filter((asset) => asset.id === assetBalance.id)[0]?.symbol ??
        '';
  const formattedValue = useMemo(
    () => `${maskValue(assetBalance.value)} ${assetSymbol}`,
    [assetBalance, assetSymbol]
  );

  return formattedValue;
};
