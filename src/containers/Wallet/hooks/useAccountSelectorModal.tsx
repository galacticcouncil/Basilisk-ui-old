import { NetworkStatus } from '@apollo/client'
import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { useModalPortal } from '../../../components/Balance/AssetBalanceInput/hooks/useModalPortal'
import { useModalPortalElement } from '../../../components/Wallet/AccountSelector/hooks/useModalPortalElement'
import { Account } from '../../../generated/graphql'
import { useSetActiveAccountMutation } from '../../../hooks/accounts/mutations/useSetActiveAccountMutation'
import {
  useGetAccountsLazyQuery,
  useGetAccountsQuery
} from '../../../hooks/accounts/queries/useGetAccountsQuery'
import {
  useGetActiveAccountQuery,
  useGetActiveAccountQueryContext
} from '../../../hooks/accounts/queries/useGetActiveAccountQuery'
import {
  useGetExtensionQuery,
  useGetExtensionQueryContext
} from '../../../hooks/extension/queries/useGetExtensionQuery'
import { useLoading } from '../../../hooks/misc/useLoading'

export const useAccountSelectorModal = ({
  modalContainerRef
}: {
  modalContainerRef: MutableRefObject<HTMLDivElement | null>
}) => {
  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQueryContext()
  const [setActiveAccount] = useSetActiveAccountMutation()
  const depsLoading = useLoading()
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQueryContext()
  const [
    getAccounts,
    { data: accountsData, networkStatus: accountsNetworkStatus }
  ] = useGetAccountsLazyQuery()

  const onAccountSelected = useCallback(
    (account: Account) => {
      setActiveAccount({ variables: { id: account.id } })
    },
    [setActiveAccount]
  )

  const onAccountCleared = useCallback(() => {
    setActiveAccount({ variables: { id: undefined } })
  }, [setActiveAccount])

  const modalPortalElement = useModalPortalElement({
    accounts: accountsData?.accounts,
    accountsLoading: accountsNetworkStatus === NetworkStatus.loading,
    onAccountSelected,
    onAccountCleared,
    account: activeAccountData?.activeAccount,
    isExtensionAvailable: !!extensionData?.extension.isAvailable
  })

  const modal = useModalPortal(
    modalPortalElement,
    modalContainerRef,
    // TODO: this doesnt work anyhow due to the backdrop
    // being included in the outside-click detection
    false // don't auto close when clicking outside the modalPortalElement
  )

  useEffect(() => {
    extensionData?.extension.isAvailable &&
      !depsLoading &&
      modal.isModalOpen &&
      getAccounts()
  }, [modal.isModalOpen, extensionData, depsLoading, getAccounts])

  return modal
}
