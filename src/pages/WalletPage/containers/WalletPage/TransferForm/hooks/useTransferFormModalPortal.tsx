import { useCallback } from 'react'
import {
  ModalPortalElementFactory,
  useModalPortal
} from '../../../../../../components/Balance/AssetBalanceInput/hooks/useModalPortal'
import { Notification } from '../../../../WalletPage'
import { TransferForm } from '../TransferForm'

export const useModalPortalElement = (
  setNotification: (notification: Notification) => void,
  assets?: string[]
) => {
  return useCallback<
    ModalPortalElementFactory<{ assetId: string; balance: string }>
  >(
    ({ isModalOpen, closeModal, state }) => {
      return isModalOpen ? (
        <TransferForm
          closeModal={closeModal}
          assetId={state?.assetId}
          balance={state?.balance}
          setNotification={setNotification}
          assets={assets}
        />
      ) : (
        <></>
      )
    },
    [assets, setNotification]
  )
}

export const useTransferFormModalPortal = (
  container: any,
  setNotification: (notification: Notification) => void,
  assets?: string[]
) => {
  return useModalPortal(
    useModalPortalElement(setNotification, assets),
    container
  )
}
