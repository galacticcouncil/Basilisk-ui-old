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
import { useGetPoolsQueryProvider } from '../../../hooks/pools/queries/useGetPoolsQuery';
import { computeAllPaths } from '../../../misc/router/computeAllPaths';
import { getSpotPriceFromPath } from '../../../misc/router/getSpotPriceFromPath';
import { useMath } from '../../../hooks/math/useMath';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';

export interface FormattedBalanceProps {
  balance: Balance;
  showDisplayValue?: boolean,
  precision?: number;
  unitStyle?: UnitStyle;
}

export const FormattedBalance = ({
  balance,
  showDisplayValue = false,
  precision = 3,
  unitStyle = UnitStyle.LONG,
}: FormattedBalanceProps) => {
  const assetSymbol = useMemo(() => idToAsset(balance.assetId)?.symbol, [
    balance.assetId,
  ]);
  // const formattedBalance = useFormatSI(precision, unitStyle, balance.balance);
  let formattedBalance = fromPrecision12(balance.balance);

  const decimalPlacesCount = formattedBalance?.split('.')[1]?.length || 0;
  console.log('formattedBalance', decimalPlacesCount, formattedBalance )

  if (formattedBalance && new BigNumber(formattedBalance).gte(1)) {
    formattedBalance = new BigNumber(formattedBalance).toFixed(
      decimalPlacesCount > 4 ? 4 : decimalPlacesCount
    );
  } else if (formattedBalance) {
    formattedBalance = new BigNumber(formattedBalance).toFixed(
      decimalPlacesCount <= 4 ? 4 : decimalPlacesCount
    );
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

  const { data: poolsData } = useGetPoolsQueryProvider();
  const { math } = useMath();
  const displayValue = useMemo(() => {
    console.log('display value', { poolsData, displayId: process.env })
    if (!poolsData?.pools || !process.env.REACT_APP_DISPLAY_VALUE_ASSET_ID || !math) return;
    let spotPrice = toPrecision12('1')!;
    // dont look for a spot price through the router
    if (process.env.REACT_APP_DISPLAY_VALUE_ASSET_ID != balance.assetId) {
      const paths = computeAllPaths(
        { id: balance.assetId }, 
        { id: process.env.REACT_APP_DISPLAY_VALUE_ASSET_ID }, 
        poolsData?.pools, 
        5
      );
  
      spotPrice = getSpotPriceFromPath(paths[1], math);
    }

    const formattedDisplayValue = new BigNumber(balance.balance || '0')
      .dividedBy(spotPrice)

    if (formattedDisplayValue && new BigNumber(formattedDisplayValue).lt(0.01)) {
      return '< 0.01'
    } else {
      return formattedDisplayValue && new BigNumber(formattedDisplayValue).toFixed(2)
    }

  }, [poolsData, balance.assetId, math])

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
      <div className='formatted-balance__native'>
        {/* <div className="formatted-balance__value">{formattedBalance.value}</div> */}
        <div className="formatted-balance__native__value">{formattedBalance}</div>
        {/* <div className={`formatted-balance__suffix ${unitStyle.toLowerCase()}`}>
          {formattedBalance.suffix}
        </div> */}
        <div className="formatted-balance__native__symbol">
          {assetSymbol || horizontalBar}
        </div>
      </div>
     {showDisplayValue
      ? (
        <div className='formatted-balance__display-value'>
          <div className="formatted-balance__display-value__value">{displayValue}</div>
          <div className="formatted-balance__display-value-symbol">
            $
          </div>
        </div>
      )
      : <></>
     }
    </div>
  );
};
