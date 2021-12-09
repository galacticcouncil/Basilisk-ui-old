import { useRef } from 'react';
import { useModalPortal } from '../../AssetBalanceInput/hooks/useModalPortal';
import { MetricUnit, MetricUnitMap, unitMap } from '../../metricUnit';
import { useModalPortalElement } from './hooks/useModalPortalElement';
import { MetricUnitItem } from './MetricUnitItem/MetricUnitItem';
import './MetricUnitSelector.scss';

export interface MetricUnitSelectorProps {
    unit: MetricUnit,
    units?: MetricUnit[],
    onUnitSelected: (unit: MetricUnit) => void
}

export const MetricUnitSelector = ({
    unit,
    units = Object.values(MetricUnit),
    onUnitSelected
}: MetricUnitSelectorProps) => {
    const selectorContainerRef = useRef<HTMLDivElement | null>(null);
    const modalPortalElement = useModalPortalElement({ units, onUnitSelected, unit });
    const { modalPortal, closeModal, toggleModal } = useModalPortal(
        modalPortalElement,
        selectorContainerRef
    );

    return <div className="metric-unit-selector">
        {/* Currently selected unit */}
        <div className='metric-unit-selector__select' onClick={toggleModal}>
            <div className='metric-unit-selector__icon'>v</div>
            <div className='metric-unit-selector__unit'>{unitMap[unit]}</div>
        </div>
        {/* List of available units */}
        <div className='metric-unit-selector__unit-list flex-container column' ref={selectorContainerRef}></div>
        {modalPortal}
    </div>
}