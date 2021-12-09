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
import { MetricUnit } from '../metricUnit';
import { MetricUnitSelector } from '../BalanceInput/MetricUnitSelector/MetricUnitSelector';
import { useDefaultUnit } from '../BalanceInput/hooks/useDefaultUnit';

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
    const { unit, setUnit } = useDefaultUnit(defaultUnit);
    const handleAssetSelectorClick = useCallback(() => isAssetSelectable && toggleModal(), [isAssetSelectable, toggleModal]);

    return <div className='asset-balance-input'>
        {/* This portal will be rendered at it's container ref as defined above */}
        {modalPortal}

        {/* Selected asset */}
        
        {/* <button 
            className={
                'asset-balance-input__select '
                + classNames({
                    'is-asset-selectable': isAssetSelectable    
                })
            }
            onClick={handleAssetSelectorClick}>
        </button> */}

        {/* TODO: css/rename classes */}
        <div className='balance-input__info flex-container column'>
            <div className='balance-input__unit-selector'>
                <MetricUnitSelector 
                    unit={unit}
                    onUnitSelected={setUnit}
                />
            </div>
        </div>

        {/* TODO: css */}
        <div className='test' onClick={_ => handleAssetSelectorClick()}>
            {asset?.id}
        </div>
        
        <BalanceInput 
            name={name}
            defaultUnit={defaultUnit}
            showMetricUnitSelector={false}
        />
    </div>
}