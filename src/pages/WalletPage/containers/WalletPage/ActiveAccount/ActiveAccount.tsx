import { useCallback } from 'react';
import { Account, Maybe } from '../../../../../generated/graphql';
import { useSetActiveAccountMutation } from '../../../../../hooks/accounts/mutations/useSetActiveAccountMutation';
import { Notification } from '../../../WalletPage';
import { BalanceList } from '../BalanceList/BalanceList';
import { VestingClaim } from '../VestingClaim/VestingClaim';
import './ActiveAccount.scss';

export const ActiveAccount = ({
  account,
  loading,
  onOpenAccountSelector,
  onOpenTransferForm,
  onSetAsFeePaymentAsset,
  feePaymentAssetId,
  setNotification,
}: {
  account?: Maybe<Account>;
  loading: boolean;
  feePaymentAssetId?: Maybe<string>;
  onOpenAccountSelector: () => void;
  onOpenTransferForm: (assetId: string) => void;
  onSetAsFeePaymentAsset: (assetId: string) => void;
  setNotification: (notification: Notification) => void;
}) => {
  const [setActiveAccount] = useSetActiveAccountMutation();

  const handleClearAccount = useCallback(() => {
    setActiveAccount({ variables: { id: undefined } });
  }, [setActiveAccount]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : account ? (
        <>
          <div className="active-account">
            <h2 className="active-account__title">
              Active account
            </h2>
            <div className="active-account-wrapper">
              <div>{account.name}</div>
              <div>{account.source}</div>
              <div>{account.id}</div>
              <div className="active-account-actions">
                <div
                  className="active-account-button"
                  onClick={() => onOpenAccountSelector()}
                >
                  <div className="active-account-button__label">
                    Change account
                  </div>
                </div>
                <div
                  className="active-account-button"
                  onClick={() => handleClearAccount()}
                >
                  <div className="active-account-button__label">
                    Clear account
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VestingClaim
            vesting={account?.vesting}
            setNotification={setNotification}
          />
          
          <BalanceList
            balances={account.balances}
            onOpenTransferForm={onOpenTransferForm}
            feePaymentAssetId={feePaymentAssetId}
            onSetAsFeePaymentAsset={onSetAsFeePaymentAsset}
          />
        </>
      ) : (
        <div>Please connect a wallet first</div>
      )}
    </>
  );
};
