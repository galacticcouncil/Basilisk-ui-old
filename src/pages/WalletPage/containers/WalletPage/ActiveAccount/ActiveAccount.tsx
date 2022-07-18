import Identicon from '@polkadot/react-identicon';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { useCallback } from 'react';
import {
  genesisHashToChain,
  sourceToHuman,
} from '../../../../../components/Wallet/AccountSelector/AccountItem/AccountItem';
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
            <h2 className="active-account__title">Active account</h2>
            <div className="active-account-wrapper">
              <div className="account-item__heading item">Name</div>
              <div className="item">Address</div>
              <div className="active-account-actions item"></div>
            </div>
            <div className="active-account-wrapper">
              <div className="account-item__heading item">
                <div className="active-account__account-item__heading__left">
                  <div className="active-account__account-item__heading__left__name">
                    {account.name}
                  </div>
                  <div className="account-item__heading__left__source">
                    {sourceToHuman(account.source)}
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="account-item__address-info">
                  <div className="account-item__address-entry">
                    <Identicon
                      className="account-item__identicon"
                      value={account.id}
                      size={32}
                    />
                    <div className="account-item__chain-info">
                      <div className="account-item__chain-name">Basilisk</div>
                      <div className="account-item__chain-address">
                        {account.id}
                      </div>
                    </div>
                  </div>
                  {genesisHashToChain(account.genesisHash).network !==
                  'basilisk' ? (
                    <div className="account-item__address-entry">
                      <Identicon
                        className="account-item__identicon"
                        value={account.id}
                        size={32}
                        theme="polkadot"
                      />
                      <div className="account-item__chain-info">
                        <div className="account-item__chain-name">
                          {genesisHashToChain(account.genesisHash).displayName}
                        </div>
                        <div className="account-item__chain-address">
                          {encodeAddress(
                            decodeAddress(account.id),
                            genesisHashToChain(account.genesisHash)?.prefix
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="active-account-actions item">
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

          {account?.vesting && (
            <VestingClaim
              vesting={account?.vesting}
              setNotification={setNotification}
            />
          )}

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
