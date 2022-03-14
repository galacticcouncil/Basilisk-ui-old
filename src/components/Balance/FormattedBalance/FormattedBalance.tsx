import { Balance } from '../../../generated/graphql';
import { useEffect, useMemo } from 'react';
import log from 'loglevel';
import './FormattedBalance.scss';
import { UnitStyle } from '../metricUnit';
import { useFormatSI } from './hooks/useFormatSI';
import { idToAsset } from '../../../pages/TradePage/TradePage';
import ReactTooltip from 'react-tooltip';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';

export interface FormattedBalanceProps {
  balance: Balance;
  precision?: number;
  unitStyle?: UnitStyle;
}

export const FormattedBalance = ({
  balance,
  precision = 2,
  unitStyle = UnitStyle.LONG,
}: FormattedBalanceProps) => {
  const assetSymbol = useMemo(() => idToAsset(balance.assetId)?.symbol, [
    balance.assetId,
  ]);
  const formattedBalance = useFormatSI(precision, unitStyle, balance.balance);

  const tooltipText = useMemo(() => {
    return ` 
      <span class='balance'>${fromPrecision12(balance.balance)}</span>
      <span class='symbol'>${assetSymbol}</span>
    `
  }, [balance, assetSymbol]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [tooltipText]);

  log.debug(
    'FormattedBalance',
    formattedBalance?.value,
    formattedBalance?.unit,
    formattedBalance?.numberOfDecimalPlaces
  );

  // We don't need to use the currency input here
  // because when there is more than 3 significant digits, the formatter
  // moves one notch up/down and keeps a fixed precision
  return (
    // WARNING POSSIBLY UNSAFE??
    <div className="formatted-balance" data-tip={tooltipText} data-html={true}>
      <div className="formatted-balance__value">{formattedBalance.value}</div>
      <div className={`formatted-balance__suffix ${unitStyle.toLowerCase()}`}>
        {formattedBalance.suffix}
      </div>
      <div className="formatted-balance__symbol">{assetSymbol}</div>
    </div>
  );
};
