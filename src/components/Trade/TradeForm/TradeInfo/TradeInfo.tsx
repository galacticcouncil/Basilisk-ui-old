import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';
import { Fee } from '../../../../generated/graphql';
import { TradeFormFields } from '../TradeForm';
import constants from './../../../../constants';
import './TradeInfo.scss';

export interface TradeInfoProps {
  transactionFee?: string;
  tradeFee?: Fee;
  tradeLimit?: string;
  isDirty?: boolean,
  expectedSlippage?: string;
  errors?: FieldErrors<TradeFormFields>;
}

export const TradeInfo = ({
  errors,
  expectedSlippage,
  tradeLimit,
  isDirty,
  tradeFee = constants.xykFee,
}: TradeInfoProps) => {

  const error = useMemo(() => {
    switch (errors?.submit?.type) {
      case 'minTradeLimitOut':
        return 'Min trade limit not reached'
      case 'minTradeLimitIn':
        return 'Min trade limit not reached'
      case 'maxTradeLimitOut':
        return 'Max trade limit reached'
      case 'maxTradeLimitIn':
        return 'Max trade limit reached'
      case 'slippageHigherThanTolerance':
        return 'Slippage higher than tolerance'
      case 'notEnoughBalanceIn':
        return 'Insufficient balance'
    }
    return;
  }, [errors?.submit])

  return (
    <div className="trade-info">
      <div
        className={
          'trade-info__data' +
          (Object.keys(errors || {}).length && isDirty
            ? ' hidden'
            : '')
        }
      >
        <div className="data-piece">
          <span className="data-piece__label">Current slippage </span>
          <div className="data-piece__value">{expectedSlippage || '0'}%</div>
        </div>
        <div className="data-piece">
          <span className="data-piece__label">Trade limit </span>
          <div className="data-piece__value">
            {new BigNumber(tradeLimit || '0').toFixed(2)}
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
        className={
          'validation' +
          (Object.keys(errors || {}).length && isDirty
            ? ' error'
            : '')
        }
      >
        {error}
      </div>
    </div>
  );
};
