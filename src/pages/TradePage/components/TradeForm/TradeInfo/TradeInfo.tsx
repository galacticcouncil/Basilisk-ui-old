import BigNumber from 'bignumber.js';
import { debounce, delay, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { Balance, Fee } from '../../../../../generated/graphql';
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance';
import { horizontalBar } from '../../../../../components/Chart/ChartHeader/ChartHeader';
import { TradeFormFields } from '../TradeForm';
import constants from '../../../../../constants';
import './TradeInfo.scss';

export interface TradeInfoProps {
  transactionFee?: string;
  tradeFee?: Fee;
  tradeLimit?: Balance;
  isDirty?: boolean;
  expectedSlippage?: BigNumber;
  errors?: FieldErrors<TradeFormFields>;
  paymentInfo?: string,
}

export const TradeInfo = ({
  errors,
  expectedSlippage,
  tradeLimit,
  isDirty,
  tradeFee = constants.xykFee,
  paymentInfo
}: TradeInfoProps) => {
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
        return 'Insufficient fee balance'
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

  return (
    <div className="trade-info">
      <div className="trade-info__data">
        <div className="data-piece">
          <span className="data-piece__label">Current slippage </span>
          <div className="data-piece__value">
            {!expectedSlippage || expectedSlippage?.isNaN()
              ? horizontalBar
              : `${expectedSlippage?.multipliedBy(100).toFixed(2)}%`
            }
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
                  assetId: '0',
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
