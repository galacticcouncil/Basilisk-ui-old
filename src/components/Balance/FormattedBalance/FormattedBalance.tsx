import { Balance } from '../../../generated/graphql';
import { useEffect, useMemo } from 'react';
import log from 'loglevel';
import './FormattedBalance.scss';
import { UnitStyle } from '../metricUnit';
import { useFormatSI } from './hooks/useFormatSI';
import { idToAsset } from '../../../pages/TradePage/TradePage';
import ReactTooltip from 'react-tooltip';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader';
import BigNumber from 'bignumber.js';

export interface FormattedBalanceProps {
  balance: Balance;
  precision?: number;
  unitStyle?: UnitStyle;
}

export const FormattedBalance = ({
  balance,
  precision = 3,
  unitStyle = UnitStyle.LONG,
}: FormattedBalanceProps) => {
  const assetSymbol = useMemo(() => idToAsset(balance.assetId)?.symbol, [
    balance.assetId,
  ]);
  // const formattedBalance = useFormatSI(precision, unitStyle, balance.balance);
  let formattedBalance = fromPrecision12(balance.balance);

  const decimalPlacesCount = formattedBalance!.split('.')[1]?.length;
  console.log('formattedBalance', decimalPlacesCount, formattedBalance )

  if (formattedBalance && !(new BigNumber(formattedBalance).isZero()) && new BigNumber(formattedBalance).lte(0.000001)) {
    formattedBalance = '< 0.000001'
  } else if (formattedBalance && decimalPlacesCount > 6 && new BigNumber(formattedBalance).gt(0.000001)) {
    formattedBalance = '~' + new BigNumber(formattedBalance).toFixed(6);
  } 


  const tooltipText = useMemo(() => {
    // TODO: get rid of raw html
    return ` 
      <span class='balance'>${fromPrecision12(balance.balance)}</span>
      <span class='symbol'>${assetSymbol}</span>
    `;
  }, [balance, assetSymbol]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [tooltipText]);

  // log.debug(
  //   'FormattedBalance',
  //   formattedBalance?.value,
  //   formattedBalance?.unit,
  //   formattedBalance?.numberOfDecimalPlaces
  // );

  // We don't need to use the currency input here
  // because when there is more than 3 significant digits, the formatter
  // moves one notch up/down and keeps a fixed precision
  return (
    // WARNING POSSIBLY UNSAFE??
    <div
      className="formatted-balance"
      data-tip={tooltipText}
      data-html={true}
      data-delay-show={20}
    >
      {/* <div className="formatted-balance__value">{formattedBalance.value}</div> */}
      <div className="formatted-balance__value">{formattedBalance}</div>
      {/* <div className={`formatted-balance__suffix ${unitStyle.toLowerCase()}`}>
        {formattedBalance.suffix}
      </div> */}
      <div className="formatted-balance__symbol">
        {assetSymbol || horizontalBar}
      </div>
    </div>
  );
};
