import { useCallback, useRef } from "react"
import { useModalPortal } from "../../../../../../components/Balance/AssetBalanceInput/hooks/useModalPortal"
import { TransferForm } from "../TransferForm"

export const useModalPortalElement = () => {
    return useCallback(({ isModalOpen, closeModal }) => {
        return isModalOpen 
            ? <TransferForm closeModal={closeModal}/>
            : <></>
    }, [])
}

export const useTransferFormModalPortal = (container: any) => {

    return useModalPortal(
        useModalPortalElement(),
        container
    )
}