import { useCallback, useMemo } from 'react'
import { ModalPortalElementFactory } from '../../../AssetBalanceInput/hooks/useModalPortal'
import { CloseModal } from '../../../AssetBalanceInput/hooks/useModalPortalElement'
import { MetricUnit } from '../../../metricUnit'
import { MetricUnitItem } from '../MetricUnitItem/MetricUnitItem'
import { MetricUnitSelectorProps } from '../MetricUnitSelector'

export type ModalPortalElement = ({
  units,
  onUnitSelected,
  unit
}: Pick<
  MetricUnitSelectorProps,
  'units' | 'onUnitSelected' | 'unit'
>) => ModalPortalElementFactory

export const useModalPortalElement: ModalPortalElement = ({
  units,
  onUnitSelected,
  unit
}) => {
  const handleUnitSelected = useCallback(
    (closeModal: CloseModal) => (unit: MetricUnit) => {
      closeModal()
      onUnitSelected(unit)
    },
    [onUnitSelected]
  )

  const activeUnit = useMemo(() => unit, [unit])

  return useCallback(
    ({ closeModal, elementRef, isModalOpen }) => {
      return (
        <div className="metric-unit-selector__unit-list" ref={elementRef}>
          {isModalOpen ? (
            <>
              {units?.map((unit, i) => (
                <MetricUnitItem
                  key={i}
                  metricUnit={unit}
                  active={unit === activeUnit}
                  onClick={() => handleUnitSelected(closeModal)(unit)}
                />
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      )
    },
    // TODO: figure out why `units` causes an ininite render loop
    [handleUnitSelected, activeUnit, unit]
  )
}
