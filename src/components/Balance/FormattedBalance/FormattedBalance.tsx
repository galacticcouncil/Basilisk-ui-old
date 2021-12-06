import { Balance } from '../../../generated/graphql';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { formatPrecisionSI, formatFixedSI, SI_PREFIXES } from '@gapit/format-si';
import { useMemo } from 'react';
import log from 'loglevel';
import './FormattedBalance.scss';
import BigNumber from 'bignumber.js';
import { prefix } from '@fortawesome/free-solid-svg-icons';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';

export enum UnitStyle {
    LONG = 'LONG',
    SHORT = 'SHORT'
}

// TODO: offer only a constrained range of units
export enum MetricUnit {
    // Y = 'Y',
    // Z = 'Z',
    // E = 'E',
    // P = 'P',
    T = 'T',
    G = 'G',
    M = 'M',
    k = 'k',
    NONE = '',
    m = 'm',
    µ = 'µ',
    n = 'n',
    p = 'p',
    // TODO: we should not allow anything below 'p' = 1e-12
    // f = 'f',
    // a = 'a',
    // z = 'z',
    // y = 'y'
}

// TODO: extract
export const unitMap: Record<string, string> = {
    'T': 'tera',
    'G': 'giga',
    'M': 'mega',
    'k': 'kilo',
    'h': 'hecto',
    'd': 'deci',
    'c': 'centi',
    'm': 'mili',
    'µ': 'micro',
    'n': 'nano',
    'p': 'pico'
}

export const prefixMap: { [key in MetricUnit]?: number } = SI_PREFIXES.reduce((prefixes, prefix) => {
    const key = prefix.metricPrefix;
    return {
        ...prefixes,
        [key]: prefix.base10
    };
}, {});

export const formatFromSIWithPrecision12 = (number: string, metricPrefix: MetricUnit) => {
    const base10 = prefixMap[metricPrefix];
    if (!base10) return;

    const formattedResult = new BigNumber(number)
        .multipliedBy(base10)

    if (!formattedResult.isNaN()) return toPrecision12(formattedResult);
}


// TODO: extract
export const assetIdNameMap: Record<string, { symbol: string, fullName: string }> = {
    '0': {
        symbol: 'BSX',
        fullName: 'Basilisk'
    }
}

export const useFormatSI = (
    assetSymbol: string,
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

        const unitName: string | undefined = unitMap[siFormat.unit];

        return {
            ...siFormat,
            unitName
        }
    }, [number])

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
        return ` ${displayUnit} ${assetSymbol}`;
    }, [formattedBalance])

    return { ...formattedBalance, numberOfDecimalPlaces, suffix };
}

export interface FormattedBalanceProps {
    balance: Balance,
    precision?: number,
    unitStyle: UnitStyle
}

export const FormattedBalance = ({ 
    balance,
    precision = 3,
    unitStyle = UnitStyle.SHORT
}: FormattedBalanceProps) => {
    const assetSymbol = useMemo(() => 
        assetIdNameMap[balance.assetId]?.symbol, 
        [balance.assetId]
    );
    // TODO: use asset.symbol instead
    const formattedBalance = useFormatSI(
        assetSymbol, 
        precision, 
        unitStyle,
        balance.balance,
    );
    
    log.debug('FormattedBalance', formattedBalance?.value, formattedBalance?.unit, formattedBalance?.numberOfDecimalPlaces);

    // We don't need to use the currency input here
    // because when there is more than 3 significant digits, the formatter
    // moves one notch up/down and keeps a fixed precision
    return <>
        <span>{formattedBalance.value}</span>
        <span>{formattedBalance.suffix}</span>
    </>
};