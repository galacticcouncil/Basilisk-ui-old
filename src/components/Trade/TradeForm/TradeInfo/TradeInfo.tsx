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
      <div className="trade-info__data">
        <div className="data-piece">
          Current slippage{' '}
          <div className="data-piece__value">{expectedSlippage || '0'}%</div>
        </div>
        <div className="data-piece">
          Trade limit{' '}
          <div className="data-piece__value">
            {new BigNumber(tradeLimit || '0').toFixed(2)}
          </div>
        </div>
        <div className="data-piece">
          Trade fee{' '}
          <div className="data-piece__value">
            {new BigNumber(tradeFee.numerator)
              .dividedBy(tradeFee.denominator)
              .multipliedBy(100)
              .toFixed(2)}
            %
          </div>
        </div>
        {/* {JSON.stringify({
        assetIn: errors?.assetIn?.type,
        assetOut: errors?.assetOut?.type,
        assetInAmount: errors?.assetInAmount?.type,
        assetOutAmount: errors?.assetOutAmount?.type,
        submit: errors?.submit?.type,
      })} */}
      </div>
    </div>
  );
};
