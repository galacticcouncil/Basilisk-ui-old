import { useRef } from 'react';
import { useModalPortal } from '../../AssetBalanceInput/hooks/useModalPortal';
import { MetricUnit, MetricUnitMap, unitMap } from './../../FormattedBalance/metricUnit';
import { useModalPortalElement } from './hooks/useModalPortalElement';
import { MetricUnitItem } from './MetricUnitItem/MetricUnitItem';

export interface MetricUnitSelectorProps {
    unit: MetricUnit,
    units: MetricUnit[],
    onUnitSelected: (unit: MetricUnit) => void
}

export const MetricUnitSelector = ({
    unit,
    units,
    onUnitSelected
}: MetricUnitSelectorProps) => {
    const selectorContainerRef = useRef<HTMLDivElement | null>(null);
    const modalPortalElement = useModalPortalElement({ units, onUnitSelected, unit });
    const { modalPortal, openModal } = useModalPortal(
        modalPortalElement,
        selectorContainerRef
    );

    return <div>
        {/* Currently selected unit */}
        <div onClick={openModal}>
            {unitMap[unit]}
        </div>
        {/* List of available units */}
        <div ref={selectorContainerRef}></div>
        {modalPortal}
    </div>
}