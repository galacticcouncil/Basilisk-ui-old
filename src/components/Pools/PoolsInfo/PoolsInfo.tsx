import { useEffect, useMemo, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { useMultiFeePaymentConversionContext } from '../../../containers/MultiProvider'
import { Balance } from '../../../generated/graphql'
import { FormattedBalance } from '../../Balance/FormattedBalance/FormattedBalance'
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader'
import { PoolsFormFields, ProvisioningType } from '../PoolsForm'
import './PoolsInfo.scss'

export interface PoolsInfoProps {
  transactionFee?: string
  tradeLimit?: Balance
  isDirty?: boolean
  errors?: FieldErrors<PoolsFormFields>
  paymentInfo?: string
  provisioningType: ProvisioningType
}

export const PoolsInfo = ({
  errors,
  tradeLimit,
  provisioningType,
  isDirty,
  paymentInfo
}: PoolsInfoProps) => {
  const [displayError, setDisplayError] = useState<string | undefined>()
  const isError = useMemo(() => !!errors?.submit?.type, [errors?.submit])
  const formError = useMemo(() => {
    switch (errors?.submit?.type) {
      case 'poolDoesNotExist':
        return 'This pool does not exist'
      case 'slippageHigherThanTolerance':
        return 'Slippage higher than tolerance'
      case 'minBalanceInA':
        return 'Minimal amount of liquidity not reached'
      case 'minBalanceInB':
        return 'Minimal amount of liquidity not reached'
      case 'minBalanceInShare':
        return 'Minimal amount of liquidity not reached'
      case 'notEnoughBalanceInA':
        return 'Insufficient first token balance'
      case 'notEnoughBalanceInB':
        return 'Insufficient second token balance'
      case 'notEnoughBalanceInShare':
        return 'Insufficient Share token balance'
      case 'notEnoughFeeBalance':
        return 'Insufficient fee balance'
      case 'activeAccount':
        return 'Please connect a wallet to continue'
    }
    return
  }, [errors?.submit])

  useEffect(() => {
    if (formError) {
      const timeoutId = setTimeout(() => setDisplayError(formError), 50)
      return () => timeoutId && clearTimeout(timeoutId)
    }
    const timeoutId = setTimeout(() => setDisplayError(formError), 300)
    return () => timeoutId && clearTimeout(timeoutId)
  }, [formError])

  const { feePaymentAsset } = useMultiFeePaymentConversionContext()

  return (
    <div className="pools-info">
      <div className="pools-info__data">
        {/* <div className="data-piece">
          <span className="data-piece__label">Current slippage </span>
          <div className="data-piece__value">
            {!expectedSlippage || expectedSlippage?.isNaN()
              ? horizontalBar
              : `${expectedSlippage?.multipliedBy(100).toFixed(2)}%`}
          </div>
        </div> */}
        {provisioningType === ProvisioningType.Add ? (
          <div className="data-piece">
            <span className="data-piece__label">Provisioning limit </span>
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
        ) : (
          <></>
        )}
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
        {/* <div className="data-piece">
          <span className="data-piece__label">Trade fee </span>
          <div className="data-piece__value">
            {new BigNumber(tradeFee.numerator)
              .dividedBy(tradeFee.denominator)
              .multipliedBy(100)
              .toFixed(2)}
            %
          </div>
        </div> */}
      </div>
      {/* TODO Error message */}

      <div
        className={'validation error ' + (isError && isDirty ? 'visible' : '')}
      >
        {displayError}
      </div>
    </div>
  )
}
