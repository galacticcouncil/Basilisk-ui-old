import classNames from 'classnames';
import { MetricUnit, unitMap } from '../../../FormattedBalance/metricUnit';

export interface MetricUnitItemProps {
    metricUnit: MetricUnit,
    onClick: () => void,
    active: boolean
}

export const MetricUnitItem = ({ metricUnit, onClick, active }: MetricUnitItemProps) => (
    <div
        className={classNames({
            'active': active
        })} 
        onClick={_ => onClick()}>
        {unitMap[metricUnit]}
    </div>
)