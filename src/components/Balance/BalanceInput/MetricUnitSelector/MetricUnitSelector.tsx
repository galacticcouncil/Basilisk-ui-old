import { useRef } from 'react';
import { useModalPortal } from '../../AssetBalanceInput/useModalPortal';
import { MetricUnit, MetricUnitMap, unitMap } from './../../FormattedBalance/FormattedBalance';
import { useTogglable } from './useTogglable';

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
    const { modalPortal, openModal } = useModalPortal(
        ({ closeModal }) => {
            const handleUnitSelected = (unit: MetricUnit) => {
                closeModal();
                onUnitSelected(unit);
            };

            return <div>
                {units.map((unit, i) => (
                    <p 
                        key={i}
                        onClick={_ => handleUnitSelected(unit)}
                    >{unitMap[unit]}</p>
                ))}
            </div>
        },
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