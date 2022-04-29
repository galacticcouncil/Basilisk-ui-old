import { Wallet as WalletComponent } from '../../components/Wallet/Wallet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetAccountsQuery } from '../../hooks/accounts/queries/useGetAccountsQuery';
import { useGetExtensionQuery, useGetExtensionQueryContext } from '../../hooks/extension/queries/useGetExtensionQuery';
import { useSetActiveAccountMutation } from '../../hooks/accounts/mutations/useSetActiveAccountMutation';
import { useGetActiveAccountQuery, useGetActiveAccountQueryContext } from '../../hooks/accounts/queries/useGetActiveAccountQuery';
import { Account } from '../../generated/graphql';
import { NetworkStatus } from '@apollo/client';
import { useLoading } from '../../hooks/misc/useLoading';
import { useFaucetMintMutation } from '../../hooks/faucet/mutations/useFaucetMintMutation';
import { useAccountSelectorModal } from './hooks/useAccountSelectorModal';

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQueryContext();
  const [setActiveAccount] = useSetActiveAccountMutation();
  const depsLoading = useLoading();
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } = useGetActiveAccountQueryContext();

  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const [faucetMint, { loading: faucetMintLoading }] = useFaucetMintMutation();

  const { modalPortal, toggleModal, isModalOpen } = useAccountSelectorModal({ 
    modalContainerRef
  });
  
  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      {modalPortal}
      <WalletComponent
        activeAccountLoading={depsLoading || activeAccountNetworkStatus === NetworkStatus.loading || activeAccountNetworkStatus === NetworkStatus.setVariables}
        isExtensionAvailable={!!extensionData?.extension.isAvailable}
        extensionLoading={extensionLoading}
        account={activeAccountData?.activeAccount}
        modalContainerRef={modalContainerRef}
        onToggleAccountSelector={toggleModal}
        faucetMint={() => faucetMint()}
        faucetMintLoading={faucetMintLoading}
      />
    </>
  );
};
