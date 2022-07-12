import BigNumber from 'bignumber.js';
import { debounce, delay, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useMultiFeePaymentConversionContext } from '../../../containers/MultiProvider';
import { Balance, Fee } from '../../../generated/graphql';
import { FormattedBalance } from '../../Balance/FormattedBalance/FormattedBalance';
import { horizontalBar } from '../../Chart/ChartHeader/ChartHeader';
import { PoolsFormFields } from '../PoolsForm';
import constants from '../../../constants';
import './PoolsInfo.scss';

export interface PoolsInfoProps {
  transactionFee?: string;
  tradeFee?: Fee;
  tradeLimit?: Balance;
  isDirty?: boolean;
  expectedSlippage?: BigNumber;
  errors?: FieldErrors<PoolsFormFields>;
  paymentInfo?: string;
}

export const PoolsInfo = ({
  errors,
  expectedSlippage,
  tradeLimit,
  isDirty,
  tradeFee = constants.xykFee,
  paymentInfo,
}: PoolsInfoProps) => {
  const [displayError, setDisplayError] = useState<string | undefined>();
  const isError = useMemo(() => !!errors?.submit?.type, [errors?.submit]);
  const formError = useMemo(() => {
    switch (errors?.submit?.type) {
      case 'minTradeLimitOut':
        return 'Min trade limit not reached';
      case 'minTradeLimitIn':
        return 'Min trade limit not reached';
      case 'maxTradeLimitOut':
        return 'Max trade limit reached';
      case 'maxTradeLimitIn':
        return 'Max trade limit reached';
      case 'slippageHigherThanTolerance':
        return 'Slippage higher than tolerance';
      case 'notEnoughBalanceIn':
        return 'Insufficient balance';
      case 'notEnoughFeeBalance':
        return 'Insufficient fee balance';
      case 'poolDoesNotExist':
        return 'Please select valid pool';
      case 'activeAccount':
        return 'Please connect a wallet to continue';
    }
    return;
  }, [errors?.submit]);

  useEffect(() => {
    if (formError) {
      const timeoutId = setTimeout(() => setDisplayError(formError), 50);
      return () => timeoutId && clearTimeout(timeoutId);
    }
    const timeoutId = setTimeout(() => setDisplayError(formError), 300);
    return () => timeoutId && clearTimeout(timeoutId);
  }, [formError]);

  const { feePaymentAsset } = useMultiFeePaymentConversionContext();

  return (
    <div className="pools-info">
      <div className="pools-info__data">
        <div className="data-piece">
          <span className="data-piece__label">Current slippage </span>
          <div className="data-piece__value">
            {!expectedSlippage || expectedSlippage?.isNaN()
              ? horizontalBar
              : `${expectedSlippage?.multipliedBy(100).toFixed(2)}%`}
          </div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Trade limit </span>
          <div className="data-piece__value">
            {tradeLimit?.balance ? (
              <FormattedBalance
                balance={{
                  balance: tradeLimit?.balance,
                  assetId: tradeLimit?.assetId,
                }}
              />
            ) : (
              <>{horizontalBar}</>
            )}
          </div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Transaction fee </span>
          <div className="data-piece__value">
            {paymentInfo ? (
              <FormattedBalance
                balance={{
                  balance: paymentInfo,
                  assetId: feePaymentAsset || '0',
                }}
              />
            ) : (
              <>{horizontalBar}</>
            )}
          </div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Trade fee </span>
          <div className="data-piece__value">
            {new BigNumber(tradeFee.numerator)
              .dividedBy(tradeFee.denominator)
              .multipliedBy(100)
              .toFixed(2)}
            %
          </div>
        </div>
      </div>
      {/* TODO Error message */}

      <div
        className={'validation error ' + (isError && isDirty ? 'visible' : '')}
      >
        {displayError}
      </div>
    </div>
  );
};
