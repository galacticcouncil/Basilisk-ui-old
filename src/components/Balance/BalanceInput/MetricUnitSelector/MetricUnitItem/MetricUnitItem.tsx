import classNames from 'classnames'
import { MetricUnit, unitMap } from '../../../metricUnit'

export interface MetricUnitItemProps {
  metricUnit: MetricUnit
  onClick: () => void
  active: boolean
}

export const MetricUnitItem = ({
  metricUnit,
  onClick,
  active
}: MetricUnitItemProps) => (
  <div
    className={
      'metric-unit-list-item ' +
      classNames({
        active: active
      })
    }
    onClick={(_) => onClick()}
  >
    {metricUnit === '' ? 'base' : unitMap[metricUnit]}
  </div>
)
