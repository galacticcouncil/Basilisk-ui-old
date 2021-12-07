import { MutableRefObject, ReactPortal, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { Asset } from '../../../generated/graphql';
import { BalanceInput, BalanceInputProps } from '../BalanceInput/BalanceInput';
import { AssetSelector } from './AssetSelector/AssetSelector';
import { ModalPortalElementFactory, useModalPortal } from './useModalPortal';
import { useModalPortalElement } from './useModalPortalElement';

export interface TokenBalanceInputProps {
    modalContainerRef: MutableRefObject<HTMLDivElement | null>,
    balanceInputProps: BalanceInputProps,
    asset?: Asset,
    assets?: Asset[],
    onAssetSelected: (asset: Asset) => void
}

export const AssetBalanceInput = ({
    modalContainerRef,
    balanceInputProps,
    asset,
    assets,
    onAssetSelected
}: TokenBalanceInputProps) => {
    const modalPortalElement = useModalPortalElement({ assets, onAssetSelected });
    const { openModal, modalPortal } = useModalPortal(
        modalPortalElement,
        modalContainerRef
    );

    const handleAssetSelectorClick = useCallback(() => openModal(), [openModal]);

    return <div>
        {/* This portal will be rendered at it's container ref as defined above */}
        {modalPortal}

        {/* Selected asset */}
        <div>
            <button onClick={handleAssetSelectorClick}>
                {asset?.id}
            </button>
        </div>

        <BalanceInput {...balanceInputProps} />
    </div>
}