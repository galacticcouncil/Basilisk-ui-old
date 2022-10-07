import { NetworkStatus } from '@apollo/client'
import { useRef } from 'react'
import { Wallet as WalletComponent } from '../../components/Wallet/Wallet'
import { useSetActiveAccountMutation } from '../../hooks/accounts/mutations/useSetActiveAccountMutation'
import { useGetActiveAccountQueryContext } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import { useGetExtensionQueryContext } from '../../hooks/extension/queries/useGetExtensionQuery'
import { useFaucetMintMutation } from '../../hooks/faucet/mutations/useFaucetMintMutation'
import { useLoading } from '../../hooks/misc/useLoading'
import { useAccountSelectorModal } from './hooks/useAccountSelectorModal'

export const Wallet = () => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQueryContext()
  const [setActiveAccount] = useSetActiveAccountMutation()
  const depsLoading = useLoading()
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQueryContext()

  const modalContainerRef = useRef<HTMLDivElement | null>(null)

  const [faucetMint, { loading: faucetMintLoading }] = useFaucetMintMutation()

  const { modalPortal, toggleModal, isModalOpen } = useAccountSelectorModal({
    modalContainerRef
  })

  // request data from the data layer
  // render the component with the provided data
  return (
    <>
      <div ref={modalContainerRef} />
      {modalPortal}
      <WalletComponent
        activeAccountLoading={
          depsLoading ||
          activeAccountNetworkStatus === NetworkStatus.loading ||
          activeAccountNetworkStatus === NetworkStatus.setVariables
        }
        isExtensionAvailable={!!extensionData?.extension.isAvailable}
        extensionLoading={extensionLoading}
        account={activeAccountData?.activeAccount}
        modalContainerRef={modalContainerRef}
        onToggleAccountSelector={toggleModal}
        faucetMint={() => faucetMint()}
        faucetMintLoading={faucetMintLoading}
      />
    </>
  )
}
