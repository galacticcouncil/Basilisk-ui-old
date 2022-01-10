import { Wallet as WalletComponent } from '../components/Wallet/Wallet';
import { useGetExtensionQuery } from '../hooks/polkadotJs/useGetExtensionQuery';
import { useRef } from 'react';
import { useGetAccountsQuery } from '../hooks/accounts/queries/useGetAccountsQuery';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQuery();
  const { data: accountsData, loading: accountsLoading } =
    useGetAccountsQuery();

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  console.log(extensionData, extensionLoading, accountsLoading);

  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      <WalletComponent
        accounts={accountsData?.accounts}
        onAccountSelected={(account) => console.log(account)}
        modalContainerRef={modalContainerRef}
      />
    </>
  );
};
