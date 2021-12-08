import { Balance } from '@open-web3/orml-types/interfaces';
import { decorateDeriveSections } from '@polkadot/api/util/decorate';
import classNames from 'classnames';
import { MutableRefObject, ReactPortal, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { Asset } from '../../../generated/graphql';
import { BalanceInput, BalanceInputProps } from '../BalanceInput/BalanceInput';
import { AssetSelector } from './AssetSelector/AssetSelector';
import { ModalPortalElementFactory, useModalPortal } from './hooks/useModalPortal';
import { useModalPortalElement } from './hooks/useModalPortalElement';

export interface AssetBalanceInputProps {
    modalContainerRef: MutableRefObject<HTMLDivElement | null>,
    name: BalanceInputProps['name'],
    defaultUnit: BalanceInputProps['defaultUnit']
    asset?: Asset,
    assets?: Asset[],
    isAssetSelectable: boolean,
    onAssetSelected: (asset: Asset) => void
}

export const AssetBalanceInput = ({
    modalContainerRef,
    name,
    defaultUnit,
    asset,
    assets,
    isAssetSelectable = true,
    onAssetSelected
}: AssetBalanceInputProps) => {
    const modalPortalElement = useModalPortalElement({ assets, onAssetSelected });
    const { openModal, modalPortal } = useModalPortal(
        modalPortalElement,
        modalContainerRef
    );

    const handleAssetSelectorClick = useCallback(() => isAssetSelectable && openModal(), [isAssetSelectable, openModal]);

    return <div>
        {/* This portal will be rendered at it's container ref as defined above */}
        {modalPortal}

        {/* Selected asset */}
        <div>
            <button 
                className={classNames({
                    'is-asset-selectable': isAssetSelectable
                })}
                onClick={handleAssetSelectorClick}>
                {asset?.id}
            </button>
        </div>

        <BalanceInput 
            name={name}
            asset={asset}
            defaultUnit={defaultUnit}
        />
    </div>
}