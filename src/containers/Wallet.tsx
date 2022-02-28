import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useCallback, useRef, useState } from 'react';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetActiveAccountQuery } from '../hooks/accounts/queries/useGetActiveAccountQuery';
import { Account } from '../generated/graphql';
import { NetworkStatus } from '@apollo/client';
import { useLoading } from '../hooks/misc/useLoading';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const [setActiveAccount] = useSetActiveAccountMutation();
  const depsLoading = useLoading();
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } = useGetActiveAccountQuery({
    skip: depsLoading
  });
  const [isAccountSelectorOpen, setAccountSelectorOpen] = useState(false);
  const { data: accountsData, loading: accountsLoading, networkStatus: accountsNetworkStatus } = useGetAccountsQuery(
    !(extensionData?.extension.isAvailable && isAccountSelectorOpen) || depsLoading
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

  console.log('network status acc', accountsNetworkStatus);

  

  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      <WalletComponent
        activeAccountLoading={depsLoading || activeAccountNetworkStatus === NetworkStatus.loading || activeAccountNetworkStatus === NetworkStatus.setVariables}
        isExtensionAvailable={!!extensionData?.extension.isAvailable}
        extensionLoading={extensionLoading}
        accounts={accountsData?.accounts}
        accountsLoading={accountsNetworkStatus === NetworkStatus.loading || depsLoading}
        account={activeAccountData?.activeAccount}
        onAccountSelected={onAccountSelected}
        onAccountCleared={onAccountCleared}
        modalContainerRef={modalContainerRef}
        setAccountSelectorOpen={setAccountSelectorOpen}
      />
    </>
  );
};
