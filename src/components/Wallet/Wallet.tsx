import { MutableRefObject, useCallback, useEffect } from 'react';
import { FormattedBalance } from '../Balance/FormattedBalance/FormattedBalance';
import { Account } from '../../generated/graphql';
import Icon from '../Icon/Icon';
import Identicon from '@polkadot/react-identicon';
import './Wallet.scss';
import { useModalPortal } from '../Balance/AssetBalanceInput/hooks/useModalPortal';
import { useModalPortalElement } from './AccountSelector/hooks/useModalPortalElement';
import { FormattedMessage } from 'react-intl';
import getBsxBalance from '../../misc/utils/getBsxBalance';

export interface WalletProps {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>;
  accounts?: Account[];
  accountsLoading: boolean;
  account?: Account;
  onAccountSelected: (account: Account) => void;
  onAccountCleared: () => void;
  extensionLoading: boolean;
  isExtensionAvailable: boolean;
  setAccountSelectorOpen: (isModalOpen: boolean) => void;
  activeAccountLoading: boolean
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
  activeAccountLoading
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
  const handleAccountSelectorClick = useCallback(() => toggleModal(), [
    toggleModal,
  ]);

  useEffect(() => {
    setAccountSelectorOpen(isModalOpen);
  }, [isModalOpen, setAccountSelectorOpen]);

  return (
    <div className="wallet">
      {/* This portal will be rendered at it's container ref as defined above */}
      {modalPortal}

      <div className="wallet__icons-wrapper">
        <span className="wallet__icons-wrapper__icon">
          <Icon name="Help" />
        </span>
        {/* <span className="wallet__icons-wrapper__icon">
          <Icon name="NotificationInactive" />
        </span> */}
      </div>
      <div className="wallet__info" data-modal-portal-toggle={toggleId}>
        {extensionLoading || activeAccountLoading ? (
          <div
            className="wallet__info__account wallet__account-btn"
            onClick={(_) => handleAccountSelectorClick()}
          >
            {' '}
            <FormattedMessage id="Wallet.Loading" defaultMessage="Loading..." />
          </div>
        ) : isExtensionAvailable ? (
          account ? (
            <>
              <div className="wallet__info__account">
                {<FormattedBalance balance={getBsxBalance(account)} />}
                <div className="wallet__address">{account?.id}</div>
              </div>
              <Identicon value={account?.id} size={32} />
              <div
                className="wallet__account-btn"
                onClick={(_) => handleAccountSelectorClick()}
              >
                {account?.name}
              </div>
            </>
          ) : (
            <div
              className="wallet__info__account wallet__account-btn"
              onClick={(_) => handleAccountSelectorClick()}
            >
              <FormattedMessage
                id="Wallet.ConnectAccount"
                defaultMessage="Connect account"
              />
            </div>
          )
        ) : (
          <div
            className="wallet__info__account wallet__account-btn"
            onClick={(_) => handleAccountSelectorClick()}
          >
            <FormattedMessage
              id="Wallet.InstallExtension"
              defaultMessage="Install extension"
            />
          </div>
        )}
      </div>
    </div>
  );
};
