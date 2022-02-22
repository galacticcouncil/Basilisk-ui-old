import { MutableRefObject, useCallback, useEffect } from 'react';
import { FormattedBalance } from '../Balance/FormattedBalance/FormattedBalance';
import { Account } from '../../generated/graphql';
import { UnitStyle } from '../Balance/metricUnit';
import Icon from '../Icon/Icon';
import Identicon from '@polkadot/react-identicon';
import './Wallet.scss';
import { useModalPortal } from '../Balance/AssetBalanceInput/hooks/useModalPortal';
import { useModalPortalElement } from './AccountSelector/hooks/useModalPortalElement';
import { FormattedMessage } from 'react-intl';

const horizontalBar = '―';

export interface WalletProps {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  accounts?: Account[];
  accountsLoading: boolean;
  account?: Account | null;
  onAccountSelected: (account: Account) => void;
  onAccountCleared: () => void;
  extensionLoading: boolean;
  isExtensionAvailable: boolean;
  setAccountSelectorOpen: (isModalOpen: boolean) => void;
}

export const Wallet = ({
  modalContainerRef,
  accounts,
  accountsLoading,
  account,
  onAccountSelected,
  onAccountCleared,
  extensionLoading,
  isExtensionAvailable,
  setAccountSelectorOpen,
}: WalletProps) => {
  const modalPortalElement = useModalPortalElement({
    accounts,
    accountsLoading,
    onAccountSelected,
    onAccountCleared,
    account,
    isExtensionAvailable,
  });
  const { isModalOpen, toggleModal, modalPortal, toggleId } = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    false // don't auto close when clicking outside the modalPortalElement
  );
  const handleAccountSelectorClick = useCallback(
    () => toggleModal(),
    [toggleModal]
  );
  useEffect(() => {
    setAccountSelectorOpen(isModalOpen);
  }, [isModalOpen, setAccountSelectorOpen]);

  return (
    <div className="wallet d-flex justify-content-between">
      {/* This portal will be rendered at it's container ref as defined above */}
      {modalPortal}

      <div className="wallet__icons-wrapper">
        <span className="wallet__icon">
          <Icon name="Help" />
        </span>
        <span className="wallet__icon">
          <Icon name="NotificationInactive" />
        </span>
      </div>
      <div
        className="d-flex wallet__info-wrapper"
        onClick={(_) => handleAccountSelectorClick()}
        data-modal-portal-toggle={toggleId}
      >
        {extensionLoading ? (
          <div className="wallet__info">
            {' '}
            <FormattedMessage id="Wallet.Loading" defaultMessage="Loading..." />
          </div>
        ) : isExtensionAvailable ? (
          <>
            {account ? (
              <>
                <div className="d-flex flex-column align-items-end">
                  {account?.balances ? (
                    account?.balances.map((balance, i) => (
                      <FormattedBalance
                        balance={balance}
                        unitStyle={UnitStyle.SHORT}
                        precision={1}
                      />
                    ))
                  ) : (
                    <div>{horizontalBar}</div>
                  )}
                  <div className="wallet__fiat-balance">~$ {horizontalBar}</div>
                </div>
                <Identicon value={account?.id} size={32} />
                <div className="wallet__account-name">{account?.name}</div>
              </>
            ) : (
              <>
                <div className="wallet__select-account-icon" />
                <div className="wallet__info">
                  <FormattedMessage
                    id="Wallet.ConnectAccount"
                    defaultMessage="Connect account"
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="wallet__info">
            <FormattedMessage
              id="Wallet.InstallExtension"
              defaultMessage="Install extension"
            />
          </div>
        )}
        <div>
          <Icon name="DropdownArrow" />
        </div>
      </div>
    </div>
  );
};
