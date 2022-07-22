import { useCallback, useRef } from "react"
import { ModalPortalElementFactory, useModalPortal } from "../../../../../../components/Balance/AssetBalanceInput/hooks/useModalPortal"
import { Asset } from "../../../../../../generated/graphql"
import { Notification } from "../../../../WalletPage"
import { TransferForm } from "../TransferForm"

export const useModalPortalElement = (setNotification: (notification: Notification) => void, assets?: Asset[]) => {
    return useCallback<ModalPortalElementFactory<{ assetId: string, balance: string }>>(({ isModalOpen, closeModal, state }) => {
        return isModalOpen 
            ? <TransferForm closeModal={closeModal} assetId={state?.assetId} balance={state?.balance} setNotification={setNotification} assets={assets}/>
            : <></>
    }, [assets, setNotification])
}

export const useTransferFormModalPortal = (container: any, setNotification: (notification: Notification) => void, assets?: Asset[]) => {

    return useModalPortal(
        useModalPortalElement(setNotification, assets),
        container
    )
}