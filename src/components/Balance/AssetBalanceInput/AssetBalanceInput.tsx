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

import './AssetBalanceInput.scss';

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
    const modalPortalElement = useModalPortalElement({ assets, onAssetSelected, asset });
    const { toggleModal, modalPortal } = useModalPortal(
        modalPortalElement,
        modalContainerRef,
        false // don't auto close when clicking outside the modalPortalElement
    );

    const handleAssetSelectorClick = useCallback(() => isAssetSelectable && toggleModal(), [isAssetSelectable, toggleModal]);

    return <div className='asset-balance-input'>
        {/* This portal will be rendered at it's container ref as defined above */}
        {modalPortal}

        {/* Selected asset */}
        
        <button 
            className={
                'asset-balance-input__select '
                + classNames({
                    'is-asset-selectable': isAssetSelectable    
                })
            }
            onClick={handleAssetSelectorClick}>
        </button>
        
        <BalanceInput 
            name={name}
            asset={asset}
            defaultUnit={defaultUnit} // TODO: Let's paste the button inside here as param and replace the static asset if available?
        />
    </div>
}