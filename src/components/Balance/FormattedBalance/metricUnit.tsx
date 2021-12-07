import { SI_PREFIXES } from '@gapit/format-si';
import BigNumber from 'bignumber.js';
import log from 'loglevel';
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

export type MetricUnitMap = Record<MetricUnit, string>;

// TODO: extract
export const unitMap: MetricUnitMap = {
    'T': 'tera',
    'G': 'giga',
    'M': 'mega',
    'k': 'kilo',
    '': 'no unit',
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
    log.debug('formatFromSIWithPrecision12', 'base10', base10, metricPrefix);
    if (!base10) return;

    const formattedResult = new BigNumber(number)
        .multipliedBy(base10)

    if (!formattedResult.isNaN()) return toPrecision12(formattedResult);
}