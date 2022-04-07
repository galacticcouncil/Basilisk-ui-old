import { useCallback } from 'react';
import { Account, Maybe } from '../../../../generated/graphql';
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
}: {
  accounts?: Account[],
  accountsLoading: boolean,
  account?: Maybe<Account>,
  isExtensionAvailable: boolean,
  onAccountSelected: (account: Account) => void,
  onAccountCleared: () => void
}) => ModalPortalElementFactory;
export type CloseModal = ModalPortalElementFactoryArgs<void>['closeModal'];

export const useModalPortalElement: ModalPortalElement = ({
  accounts,
  accountsLoading,
  onAccountSelected,
  onAccountCleared,
  account,
  isExtensionAvailable,
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
