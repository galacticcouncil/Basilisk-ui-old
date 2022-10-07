import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import ReactTooltip from 'react-tooltip'
import { Balance } from '../../../generated/graphql'
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision'
import { idToAsset } from '../../../misc/idToAsset'
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader'
import { UnitStyle } from '../metricUnit'
import './FormattedBalance.scss'

export interface FormattedBalanceProps {
  balance: Balance
  showDisplayValue?: boolean
  precision?: number
  unitStyle?: UnitStyle
}

export const format = {
  groupSeparator: ' ',
  groupSize: 3,
  decimalSeparator: '.'
}

export const FormattedBalance = ({
  balance,
  showDisplayValue = false,
  precision = 3,
  unitStyle = UnitStyle.LONG
}: FormattedBalanceProps) => {
  const assetSymbol = useMemo(
    () => idToAsset(balance.assetId)?.symbol,
    [balance.assetId]
  )
  // const formattedBalance = useFormatSI(precision, unitStyle, balance.balance);
  let formattedBalance = fromPrecision12(balance.balance)

  const decimalPlacesCount = formattedBalance?.split('.')[1]?.length || 0
  //log.log('formattedBalance', decimalPlacesCount, formattedBalance);

  if (formattedBalance && new BigNumber(formattedBalance).gte(1)) {
    formattedBalance = new BigNumber(formattedBalance)
      .decimalPlaces(decimalPlacesCount > 4 ? 4 : decimalPlacesCount)
      .toFormat(format)
  } else if (formattedBalance) {
    formattedBalance = new BigNumber(formattedBalance)
      .decimalPlaces(decimalPlacesCount <= 4 ? 4 : decimalPlacesCount)
      .toFormat(format)
  }

  const tooltipText = useMemo(() => {
    // TODO: get rid of raw html
    return ` 
      <span class='balance'>${fromPrecision12(balance.balance)}</span>
      <span class='symbol'>${assetSymbol}</span>
    `
  }, [balance, assetSymbol])

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [tooltipText])

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
      <div className="formatted-balance__native">
        {/* <div className="formatted-balance__value">{formattedBalance.value}</div> */}
        <div className="formatted-balance__native__value">
          {formattedBalance}
        </div>
        {/* <div className={`formatted-balance__suffix ${unitStyle.toLowerCase()}`}>
          {formattedBalance.suffix}
        </div> */}
        <div className="formatted-balance__native__symbol">
          {assetSymbol || horizontalBar}
        </div>
      </div>
    </div>
  )
}
