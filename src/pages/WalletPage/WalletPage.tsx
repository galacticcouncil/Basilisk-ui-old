import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetActiveAccountQueryContext } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import { NetworkStatus } from '@apollo/client'
import { useLoading } from '../../hooks/misc/useLoading'
import { useGetExtensionQueryContext } from '../../hooks/extension/queries/useGetExtensionQuery'
import { useAccountSelectorModal } from '../../containers/Wallet/hooks/useAccountSelectorModal'
import { ActiveAccount } from './containers/WalletPage/ActiveAccount/ActiveAccount'
import { useTransferFormModalPortal } from './containers/WalletPage/TransferForm/hooks/useTransferFormModalPortal'
import { useSetConfigMutation } from '../../hooks/config/useSetConfigMutation'
import { useGetConfigQuery } from '../../hooks/config/useGetConfigQuery'
import './WalletPage.scss'
import Icon from '../../components/Icon/Icon'

export type Notification = 'standby' | 'pending' | 'success' | 'failed'

export const WalletPage = () => {
  const [notification, setNotification] = useState<
    'standby' | 'pending' | 'success' | 'failed'
  >('standby')

  const { data: extensionData, loading: extensionLoading } =
    useGetExtensionQueryContext()

  const depsLoading = useLoading()
  const { data: activeAccountData, networkStatus: activeAccountNetworkStatus } =
    useGetActiveAccountQueryContext()

  const activeAccount = useMemo(
    () => activeAccountData?.activeAccount,
    [activeAccountData]
  )
  const activeAccountLoading = useMemo(
    () => depsLoading || activeAccountNetworkStatus === NetworkStatus.loading,
    [depsLoading, activeAccountNetworkStatus]
  )

  const { data: configData, networkStatus: configNetworkStatus } =
    useGetConfigQuery({
      skip: activeAccountLoading
    })

  const configLoading = useMemo(() => {
    return depsLoading || configNetworkStatus == NetworkStatus.loading
  }, [configNetworkStatus, depsLoading])

  // couldnt really quickly figure out how to use just activeAccount + extension loading states
  // so depsLoading is reused here as well
  const loading = useMemo(
    () =>
      activeAccountLoading || extensionLoading || depsLoading || configLoading,
    [activeAccountLoading, extensionLoading, depsLoading, configLoading]
  )

  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const { modalPortal, openModal } = useAccountSelectorModal({
    modalContainerRef
  })

  const assets = useMemo(() => {
    return activeAccount?.balances?.map((balance) => balance.assetId)
  }, [activeAccount])

  const {
    modalPortal: transferFormModalPortal,
    openModal: openTransferFormModalPortal
  } = useTransferFormModalPortal(modalContainerRef, setNotification, assets)

  const handleOpenTransformForm = useCallback(
    (assetId: string, balance: string) => {
      console.log('handleOpenTransformForm with asset id', assetId)
      console.log('handleOpenTransformForm with balance', balance)
      openTransferFormModalPortal({ assetId, balance })
    },
    [openTransferFormModalPortal]
  )

  const [setConfigMutation, { loading: setConfigLoading }] =
    useSetConfigMutation()
  const clearNotificationIntervalRef = useRef<any>()

  useEffect(() => {
    if (setConfigLoading) setNotification('pending')
  }, [setConfigLoading])

  const onSetAsFeePaymentAsset = useCallback(
    (feePaymentAsset: string) => {
      clearNotificationIntervalRef.current &&
        clearTimeout(clearNotificationIntervalRef.current)
      clearNotificationIntervalRef.current = null

      console.log('setting fee payment asset', feePaymentAsset)
      setConfigMutation({
        onCompleted: () => {
          setNotification('success')
          clearNotificationIntervalRef.current = setTimeout(() => {
            setNotification('standby')
          }, 4000)
        },
        onError: () => {
          setNotification('failed')
          clearNotificationIntervalRef.current = setTimeout(() => {
            setNotification('standby')
          }, 4000)
        },
        variables: {
          config: {
            feePaymentAsset
          }
        }
      })
    },
    [setConfigMutation]
  )

  return (
    <div className="wallet-page">
      <div ref={modalContainerRef}></div>
      {modalPortal}
      {transferFormModalPortal}
      <div className={'notifications-bar transaction-' + notification}>
        <div className="notification">Transaction {notification}</div>
        <div className="notification-cancel-wrapper">
          <button
            className="notification-cancel-button"
            onClick={() => setNotification('standby')}
          >
            <Icon name="Cancel" />
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="modal-button-container">
            <div className="button--primary">
              <div className="button--primary label">Wallet loading...</div>
            </div>
          </div>
        ) : (
          <div>
            {activeAccount ? (
              <>
                <ActiveAccount
                  account={activeAccount}
                  loading={loading}
                  onOpenAccountSelector={openModal}
                  onOpenTransferForm={handleOpenTransformForm}
                  feePaymentAssetId={configData?.config.feePaymentAsset || '0'}
                  onSetAsFeePaymentAsset={onSetAsFeePaymentAsset}
                  setNotification={setNotification}
                />
              </>
            ) : (
              <div className="modal-button-container">
                <div className="button--primary" onClick={() => openModal()}>
                  <div className="button--primary label">
                    Click here to connect an account
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
