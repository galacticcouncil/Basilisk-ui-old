import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useRef } from 'react';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';
import { useSetActiveAccountMutation } from '../hooks/accounts/mutations/useSetActiveAccountMutation';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const { data: accountsData } = useGetAccountsQuery();

  const [setActiveAccount] = useSetActiveAccountMutation();

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
        onAccountSelected={(account) => console.log(account)}
        modalContainerRef={modalContainerRef}
        setActiveAccount={setActiveAccount}
      />
    </>
  );
};
