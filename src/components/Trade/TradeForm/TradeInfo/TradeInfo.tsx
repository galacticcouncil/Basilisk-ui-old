import BigNumber from 'bignumber.js';
import { FieldErrors } from 'react-hook-form';
import { Fee } from '../../../../generated/graphql';
import { TradeFormFields } from '../TradeForm';
import constants from './../../../../constants';

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
      <p>Trade info</p>
      <p>Expected slippage: {expectedSlippage}</p>
      <p>Trade limit: {tradeLimit}</p>
      <p>
        Trade fee (%):{' '}
        {new BigNumber(tradeFee.numerator)
          .dividedBy(tradeFee.denominator)
          .toFixed(3)}
        %
      </p>
    </div>
  );
};
