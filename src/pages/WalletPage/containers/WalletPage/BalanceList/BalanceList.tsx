import { Balance, Maybe } from '../../../../../generated/graphql';
import { FormattedBalance } from '../../../../../components/Balance/FormattedBalance/FormattedBalance';
import { idToAsset } from '../../../../TradePage/TradePage';
import { horizontalBar } from '../../../../../components/Chart/ChartHeader/ChartHeader';
import './BalanceList.scss';

export const availableFeePaymentAssetIds = ['0', '1', '2'];

export const BalanceList = ({
  balances,
  onOpenTransferForm,
  onSetAsFeePaymentAsset,
  feePaymentAssetId,
}: {
  balances?: Array<Balance>;
  feePaymentAssetId?: Maybe<string>;
  onOpenTransferForm: (assetId: string) => void;
  onSetAsFeePaymentAsset: (assetId: string) => void;
}) => {
  return (
    <div className="balance-list">
      <h2 className="balance-list__title">Balance</h2>
      <div className="balance-list-wrapper">
        <div className="item">Asset Name</div>
        <div className="item">Balance</div>
        <div className="item balance-list-actions"></div>
      </div>
      {/* TODO: ordere by assetId? */}
      {balances?.map((balance) => (
        <div className="balance-list-wrapper">
          <div className="item">
            {idToAsset(balance.assetId || null)?.fullName ||
              `Unknown asset (ID: ${balance.assetId})`}

            {feePaymentAssetId === balance.assetId ? ' - fee asset' : ''}
          </div>

          <div className="item">
            {/* TODO: how to deal with unknown assets? (not knowing the metadata e.g. symbol/fullname) */}
            <FormattedBalance balance={balance} />
          </div>
          <div className="item balance-list-actions">
            {availableFeePaymentAssetIds.includes(balance.assetId) ? (
              <button
                className="balance-list-button"
                onClick={() => onSetAsFeePaymentAsset(balance.assetId)}
              >
                <div className="balance-list-button__label">
                  Set as fee asset
                </div>
              </button>
            ) : (
              <></>
            )}
            <button
              className="balance-list-button"
              onClick={() => onOpenTransferForm(balance.assetId)}
            >
              <div className="balance-list-button__label">Transfer</div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
