import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { useMultiFeePaymentConversionContext } from '../../../../containers/MultiProvider'
import { Balance, TradeType } from '../../../../generated/graphql'
import { FormattedBalance } from '../../../Balance/FormattedBalance/FormattedBalance'
import { horizontalBar } from '../../../Chart/ChartHeader/ChartHeader'
import { TradeFormFields } from '../TradeForm'
import './TradeInfo.scss'

export enum Warning {
  RepayFee,
  LBPFee
}

export interface TradeInfoProps {
  transactionFee?: string
  tradeFee: string
  tradeLimit?: Balance
  isDirty?: boolean
  expectedSlippage?: BigNumber
  errors?: FieldErrors<TradeFormFields>
  paymentInfo?: string
  tradeType?: TradeType
  warning?: Warning | null
}

export const TradeInfo = ({
  errors,
  expectedSlippage,
  tradeLimit,
  isDirty,
  tradeFee,
  tradeType,
  warning,
  paymentInfo
}: TradeInfoProps) => {
  const [displayError, setDisplayError] = useState<string | undefined>()
  const [displayWarning, setDisplayWarning] = useState<string | undefined>()
  const isError = useMemo(() => !!errors?.submit?.type, [errors?.submit])
  const formError = useMemo(() => {
    switch (errors?.submit?.type) {
      case 'minTradeLimitOut':
        return 'Minimal trade limit is not reached'
      case 'minTradeLimitIn':
        return 'Minimal trade limit is not reached'
      case 'maxTradeLimitOut':
        return 'Maximal pool trade limit is reached, please split your trade'
      case 'maxTradeLimitIn':
        return 'Maximal pool trade limit is reached, please split your trade'
      case 'slippageHigherThanTolerance':
        return 'The trade price is higher than your price tolerance, please split your trade or increase your trade limit in settings'
      case 'notEnoughBalanceIn':
        return 'Your trade is bigger than your balance'
      case 'notEnoughFeeBalance':
        return 'Not enough balance to pay fees'
      case 'poolDoesNotExist':
        return 'This pool does not exist'
      case 'activeAccount':
        return 'Please connect a wallet to continue'
    }
    return
  }, [errors?.submit])

  const formWarning = useMemo(() => {
    switch (warning) {
      case Warning.RepayFee:
        return '20% Repay fee will be deducted from distributed asset until repay target is reached'
      case Warning.LBPFee:
        return 'LBP fee will be deducted from distributed asset'
    }
    return
  }, [warning])

  useEffect(() => {
    if (formError) {
      const timeoutId = setTimeout(() => setDisplayError(formError), 50)
      return () => timeoutId && clearTimeout(timeoutId)
    }
    const timeoutId = setTimeout(() => setDisplayError(formError), 300)
    return () => timeoutId && clearTimeout(timeoutId)
  }, [formError])

  useEffect(() => {
    if (formWarning) {
      const timeoutId = setTimeout(() => setDisplayWarning(formWarning), 50)
      return () => timeoutId && clearTimeout(timeoutId)
    }
    const timeoutId = setTimeout(() => setDisplayWarning(formWarning), 300)
    return () => timeoutId && clearTimeout(timeoutId)
  }, [formWarning])

  const { feePaymentAsset } = useMultiFeePaymentConversionContext()

  return (
    <div className="trade-info">
      <div className="trade-info__data">
        <div className="data-piece">
          <span className="data-piece__label">
            {tradeType === TradeType.Buy ? (
              <>Maximum sold limit</>
            ) : (
              <>Minimum received limit</>
            )}
          </span>
          <div className="data-piece__value">
            {tradeLimit?.balance ? (
              <FormattedBalance
                balance={{
                  balance: tradeLimit?.balance,
                  assetId: tradeLimit?.assetId
                }}
              />
            ) : (
              <>{horizontalBar}</>
            )}
          </div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Price impact </span>
          <div className="data-piece__value">
            {!expectedSlippage || expectedSlippage?.isNaN()
              ? horizontalBar
              : `${expectedSlippage?.multipliedBy(100).toFixed(2)}%`}
          </div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Pool fee </span>
          <div className="data-piece__value">{tradeFee + ' %'}</div>
        </div>

        <div className="data-piece">
          <span className="data-piece__label">Transaction fee </span>
          <div className="data-piece__value">
            {paymentInfo ? (
              <FormattedBalance
                balance={{
                  balance: paymentInfo,
                  assetId: feePaymentAsset || '0'
                }}
              />
            ) : (
              <>{horizontalBar}</>
            )}
          </div>
        </div>
      </div>
      {/* TODO Error message */}

      <div
        className={'validation error ' + (isError && isDirty ? 'visible' : '')}
      >
        {displayError}
      </div>
      <div
        className={
          'validation warning ' + (displayWarning && isDirty ? 'visible' : '')
        }
      >
        {displayWarning}
      </div>
    </div>
  )
}
