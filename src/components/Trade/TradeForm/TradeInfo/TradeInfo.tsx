import BigNumber from 'bignumber.js';
import { FieldErrors } from 'react-hook-form';
import { Fee } from '../../../../generated/graphql';
import { TradeFormFields } from '../TradeForm';
import constants from './../../../../constants';
import './TradeInfo.scss';

export interface TradeInfoProps {
  transactionFee?: string;
  tradeFee?: Fee;
  tradeLimit?: string;
  expectedSlippage?: string;
  errors?: FieldErrors<TradeFormFields>;
}

export const TradeInfo = ({
  errors,
  expectedSlippage,
  tradeLimit,
  tradeFee = constants.xykFee,
}: TradeInfoProps) => {
  return (
    <div className="trade-info">
      <div
        className={
          'trade-info__data' +
          (errors?.assetIn?.type ||
          errors?.assetOut?.type ||
          errors?.assetInAmount?.type ||
          errors?.assetOutAmount?.type ||
          errors?.submit?.type
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
      <div className="error">
        {errors?.assetIn?.type ||
          errors?.assetOut?.type ||
          errors?.assetInAmount?.type ||
          errors?.assetOutAmount?.type ||
          errors?.submit?.type}
      </div>
    </div>
  );
};
