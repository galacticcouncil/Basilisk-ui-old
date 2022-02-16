import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useCallback, useRef, useState } from 'react';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { Account } from '../generated/graphql';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const [setActiveAccount] = useSetActiveAccountMutation();
  const { data: activeAccountData } = useGetActiveAccountQuery();
  const [isAccountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const { data: accountsData, loading: accountsLoading } = useGetAccountsQuery(
    !(extensionData?.extension.isAvailable && isAccountSelectorOpen)
  );

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const onAccountSelected = useCallback(
    (account: Account) => {
      setActiveAccount({ variables: { id: account.id } });
    },
    [setActiveAccount]
  );

  const onAccountCleared = useCallback(() => {
    setActiveAccount({ variables: { id: undefined } });
  }, [setActiveAccount]);

  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      <WalletComponent
        isExtensionAvailable={!!extensionData?.extension.isAvailable}
        extensionLoading={extensionLoading}
        accounts={accountsData?.accounts}
        accountsLoading={accountsLoading}
        account={activeAccountData?.activeAccount}
        onAccountSelected={onAccountSelected}
        onAccountCleared={onAccountCleared}
        modalContainerRef={modalContainerRef}
        setAccountSelectorOpen={setAccountSelectorOpen}
      />
    </>
  );
};
