import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useRef } from 'react';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery } from '../hooks/extension/queries/useGetExtensionQuery';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const { data: accountsData, loading: accountsLoading } =
    useGetAccountsQuery();

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  console.log(accountsLoading);

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
      />
    </>
  );
};
