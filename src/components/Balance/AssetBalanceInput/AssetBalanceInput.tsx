import classNames from 'classnames';
import { MutableRefObject, useCallback } from 'react'
import { Asset } from '../../../generated/graphql';
import { BalanceInput, BalanceInputProps } from '../BalanceInput/BalanceInput';
import {  useModalPortal } from './hooks/useModalPortal';
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
    defaultUnit = MetricUnit.NONE,
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

    return <div className='asset-balance-input flex-container'>
        {/* This portal will be rendered at it's container ref as defined above */}
        {modalPortal}
        {/* TODO: icon */}
        <div className='asset-balance-input__asset-icon' onClick={_ => handleAssetSelectorClick()}>
            <div>{asset?.id}</div>
        </div>
        <div className='asset-balance-input__input-wrapper'>
            <BalanceInput 
                name={name}
                defaultUnit={defaultUnit}
                showMetricUnitSelector={false}
            />
        </div>
        <div className='asset-balance-input__info flex-container column'>
            <MetricUnitSelector 
                unit={unit}
                onUnitSelected={setUnit}
            />
            <div className='asset-balance-input__asset-suffix'>
                <div>{asset?.id}</div>
            </div>
        </div>
    </div>
}