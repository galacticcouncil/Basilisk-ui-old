import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useEffect, useRef, useState } from 'react';
import { useGetAccountsLazyQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const [setActiveAccount] = useSetActiveAccountMutation();
  const { data: activeAccountData } = useGetActiveAccountQuery();
  const [getAccounts, { data: accountsData }] = useGetAccountsLazyQuery();
  const [isAccountSelectorOpen, setAccountSelectorOpen] = useState(false);

  useEffect(() => {
    if (extensionData?.extension.isAvailable && isAccountSelectorOpen) {
      getAccounts();
    }
  }, [extensionData, isAccountSelectorOpen, getAccounts]);

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      <WalletComponent
        isExtensionAvailable={!!extensionData?.extension.isAvailable}
        extensionLoading={extensionLoading}
        accounts={accountsData?.accounts}
        account={activeAccountData?.activeAccount}
        onAccountSelected={(account) => console.log(account)}
        modalContainerRef={modalContainerRef}
        setActiveAccount={setActiveAccount}
        setAccountSelectorOpen={setAccountSelectorOpen}
      />
    </>
  );
};
