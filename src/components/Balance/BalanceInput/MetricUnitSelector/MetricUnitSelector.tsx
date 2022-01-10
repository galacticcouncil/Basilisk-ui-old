import { useCallback, useRef } from 'react';
import { useModalPortal } from '../../AssetBalanceInput/hooks/useModalPortal';
import { MetricUnit, unitMap } from '../../metricUnit';
import { useModalPortalElement } from './hooks/useModalPortalElement';
import './MetricUnitSelector.scss';

export interface MetricUnitSelectorProps {
    unit: MetricUnit,
    units?: MetricUnit[],
    onUnitSelected: (unit: MetricUnit) => void
}

export const modalPortalToggleId = 'metric-unit-selector-toggle'

export const MetricUnitSelector = ({
    unit,
    units = Object.values(MetricUnit),
    onUnitSelected
}: MetricUnitSelectorProps) => {
    const selectorContainerRef = useRef<HTMLDivElement | null>(null);
    const modalPortalElement = useModalPortalElement({ units, onUnitSelected, unit });
    const { modalPortal, openModal, toggleId } = useModalPortal(
        modalPortalElement,
        selectorContainerRef,
        true,
    );
    
    const handleUnitClick = useCallback(openModal, [openModal]);

    // TODO short / long
    return <div className="metric-unit-selector">
        {/* Currently selected unit */}
        <div 
            className='metric-unit-selector__select flex-container' 
            onClick={handleUnitClick}
            data-modal-portal-toggle={toggleId}
        >
            <div className='metric-unit-selector__unit'>{unitMap[unit]}</div>
            <div className='metric-unit-selector__icon'>v</div>
        </div>
        {/* List of available units */}
        <div ref={selectorContainerRef}></div>
        {modalPortal}
    </div>
}