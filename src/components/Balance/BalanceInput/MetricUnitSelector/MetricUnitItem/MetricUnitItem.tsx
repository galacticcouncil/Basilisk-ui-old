import { MetricUnit, unitMap } from '../../../FormattedBalance/metricUnit';

export interface MetricUnitItemProps {
    metricUnit: MetricUnit,
    onClick: () => void
}

export const MetricUnitItem = ({ metricUnit, onClick }: MetricUnitItemProps) => (
    <div onClick={_ => onClick()}>
        {unitMap[metricUnit]}
    </div>
)