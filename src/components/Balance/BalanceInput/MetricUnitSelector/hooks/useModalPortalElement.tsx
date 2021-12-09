import { useCallback, useMemo } from 'react';
import { AssetBalanceInputProps } from '../../../AssetBalanceInput/AssetBalanceInput';
import { ModalPortalElementFactory } from '../../../AssetBalanceInput/hooks/useModalPortal';
import { CloseModal } from '../../../AssetBalanceInput/hooks/useModalPortalElement';
import { MetricUnit } from '../../../metricUnit';
import { MetricUnitItem } from '../MetricUnitItem/MetricUnitItem';
import { MetricUnitSelectorProps } from '../MetricUnitSelector';

export type ModalPortalElement =
    ({ units, onUnitSelected, unit }: Pick<MetricUnitSelectorProps, 'units' | 'onUnitSelected' | 'unit'>)
    => ModalPortalElementFactory

export const useModalPortalElement: ModalPortalElement = ({ units, onUnitSelected, unit }) => {
    const handleUnitSelected = useCallback((closeModal: CloseModal) => (
        (unit: MetricUnit) => {
            closeModal();
            onUnitSelected(unit);
        }
    ), [onUnitSelected]);

    const activeUnit = useMemo(() => unit, [unit]);

    return useCallback(({ closeModal, elementRef, isModalOpen }) => {
        return isModalOpen
            ? <div
                className="metric-unit-selector__unit-list__wrapper"
                ref={elementRef}>
                {units.map((unit, i) => (
                    <MetricUnitItem
                        key={i}
                        metricUnit={unit}
                        active={unit === activeUnit}
                        onClick={() => handleUnitSelected(closeModal)(unit)}
                    />
                ))}
            </div>
            : undefined
    }, [handleUnitSelected, units, onUnitSelected, unit])
}