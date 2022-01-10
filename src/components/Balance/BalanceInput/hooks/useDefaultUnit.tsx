import { useEffect, useState } from 'react';
import { MetricUnit } from '../../metricUnit';

// TODO: maybe make this return a full MetricUnitSelector?
export const useDefaultUnit = (defaultUnit: MetricUnit) => {
    const [unit, setUnit] = useState(defaultUnit);

    useEffect(() => {
        setUnit(defaultUnit)
    }, [defaultUnit, setUnit]);

    return { unit, setUnit };
};