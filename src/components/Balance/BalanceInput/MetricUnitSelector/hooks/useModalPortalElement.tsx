import { useCallback } from 'react';
import { AssetBalanceInputProps } from '../../../AssetBalanceInput/AssetBalanceInput';
import { ModalPortalElementFactory } from '../../../AssetBalanceInput/hooks/useModalPortal';
import { CloseModal } from '../../../AssetBalanceInput/hooks/useModalPortalElement';
import { MetricUnit } from '../../../FormattedBalance/metricUnit';
import { MetricUnitItem } from '../MetricUnitItem/MetricUnitItem';
import { MetricUnitSelectorProps } from '../MetricUnitSelector';

export type ModalPortalElement =
    ({ units, onUnitSelected }: Pick<MetricUnitSelectorProps, 'units' | 'onUnitSelected'>)
    => ModalPortalElementFactory

export const useModalPortalElement: ModalPortalElement = ({ units, onUnitSelected }) => {
    const handleUnitSelected = useCallback((closeModal: CloseModal) => (
        (unit: MetricUnit) => {
            closeModal();
            onUnitSelected(unit);
        }
    ), [onUnitSelected]);

    return ({ closeModal }) => {
        return <div>
            {units.map((unit, i) => (
                <MetricUnitItem
                    key={i}
                    metricUnit={unit}
                    onClick={() => handleUnitSelected(closeModal)(unit)}
                />
            ))}
        </div>
    }
}