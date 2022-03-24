import { useCallback } from 'react';
import { Account, BrowserExtension, Maybe } from '../../../../generated/graphql';
import { AccountSelector } from './../AccountSelector';
import {
  ModalPortalElementFactory,
  ModalPortalElementFactoryArgs,
} from './../../../Balance/AssetBalanceInput/hooks/useModalPortal';
import { WalletProps } from '../../Wallet';

export type ModalPortalElement = ({
  accounts,
  accountsLoading,
  onAccountSelected,
  onAccountCleared,
  account,
  isExtensionAvailable,
}: Pick<
  WalletProps,
  | 'accounts'
  | 'accountsLoading'
  | 'onAccountSelected'
  | 'onAccountCleared'
  | 'account'
  | 'isExtensionAvailable'
> & {
  activeBrowserExtension?: Maybe<BrowserExtension>,
  browserExtensions?: Maybe<BrowserExtension>[],
  extensionLoading?: boolean,
  onExtensionChange: (extension?: Maybe<BrowserExtension>) => void
}) => ModalPortalElementFactory;
export type CloseModal = ModalPortalElementFactoryArgs['closeModal'];

export const useModalPortalElement: ModalPortalElement = ({
  accounts,
  accountsLoading,
  onAccountSelected,
  onAccountCleared,
  account,
  isExtensionAvailable,
  activeBrowserExtension,
  browserExtensions,
  extensionLoading,
  onExtensionChange
}) => {
  const handleAccountSelected = useCallback(
    (closeModal: CloseModal) => (account: Account) => {
      closeModal();
      onAccountSelected(account);
    },
    [onAccountSelected]
  );

  const handleAccountCleared = useCallback(
    (closeModal: CloseModal) => () => {
      closeModal();
      onAccountCleared();
    },
    [onAccountCleared]
  );

  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return isModalOpen ? (
        <AccountSelector
          innerRef={elementRef}
          accounts={accounts}
          accountsLoading={accountsLoading}
          account={account}
          onAccountSelected={handleAccountSelected(closeModal)}
          onAccountCleared={handleAccountCleared(closeModal)}
          closeModal={closeModal}
          isExtensionAvailable={isExtensionAvailable}
          activeBrowserExtension={activeBrowserExtension}
          browserExtensions={browserExtensions}
          extensionLoading={extensionLoading}
          onExtensionChange={onExtensionChange}
        />
      ) : (
        <></>
      );
    },
    [
      accounts,
      accountsLoading,
      account,
      handleAccountSelected,
      isExtensionAvailable,
      handleAccountCleared,
    ]
  );
};
