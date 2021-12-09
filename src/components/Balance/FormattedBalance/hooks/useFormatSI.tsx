import { formatFixedSI } from '@gapit/format-si';
import { useMemo } from 'react';
import { fromPrecision12 } from '../../../../hooks/math/useFromPrecision';
import { MetricUnit, unitMap, UnitStyle } from '../../metricUnit';

export const useFormatSI = (
    precision: number, 
    unitStyle: UnitStyle,
    number?: string,
) => {
    const formattedBalance = useMemo(() => {
        const balanceWithPrecision12 = fromPrecision12(number);
        if (!balanceWithPrecision12) return;

        // alternatively use formatPrecisionSI
        let siFormat = formatFixedSI(
            balanceWithPrecision12,
            '',
            precision
        );

        // TODO: get rid of the 'as' call
        const unitName: string | undefined = unitMap[siFormat.unit as MetricUnit];

        return {
            ...siFormat,
            unitName
        }
    }, [number, precision])

    const numberOfDecimalPlaces = useMemo(() => (
        formattedBalance?.value?.split('.')[1]?.length
    ), [formattedBalance]);

    const suffix = useMemo(() => {
        if (!formattedBalance) return;

        const unit = formattedBalance.unit;
        const unitName = formattedBalance.unitName;
        const displayUnit = unitStyle === UnitStyle.LONG
            ? unitName || unit
            : unit

        // TODO: tweak how the displayUnit is positioned
        return ` ${displayUnit}`;
    }, [formattedBalance, unitStyle])

    return { ...formattedBalance, numberOfDecimalPlaces, suffix };
}