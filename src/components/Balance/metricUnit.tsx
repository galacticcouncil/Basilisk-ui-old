import { SI_PREFIXES } from '@gapit/format-si';
import BigNumber from 'bignumber.js';
import log from 'loglevel';
import { fromPrecision12 } from '../../hooks/math/useFromPrecision';
import { toPrecision12 } from '../../hooks/math/useToPrecision';

// Used to select in what format should the given unit be displayed
export enum UnitStyle {
  LONG = 'LONG',
  SHORT = 'SHORT',
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

// Mapping between short/long metric unit names
export type MetricUnitMap = Record<MetricUnit, string>;
export const unitMap: MetricUnitMap = {
  T: 'tera',
  G: 'giga',
  M: 'mega',
  k: 'kilo',
  '': ' ',
  m: 'mili',
  µ: 'micro',
  n: 'nano',
  p: 'pico',
};

// Mapping used to retrieve the base10 multiplier by the short metric unit name
export const prefixMap: { [key in MetricUnit]?: number } = SI_PREFIXES.reduce(
  (prefixes, prefix) => {
    const key = prefix.metricPrefix;
    return {
      ...prefixes,
      [key]: prefix.base10,
    };
  },
  {}
);

// convert a number to a baseline value given its metric unit
export const formatFromSIWithPrecision12 = (
  number: string,
  metricPrefix: MetricUnit
) => {
  const base10 = prefixMap[metricPrefix];
  log.debug('formatFromSIWithPrecision12', 'base10', base10, metricPrefix);
  if (!base10) return;

  const formattedResult = new BigNumber(number).multipliedBy(base10);

  if (!formattedResult.isNaN()) return toPrecision12(formattedResult);
};

export const formatToSIWithPrecision12 = (
  number: string,
  metricPrefix: MetricUnit
) => {
  const base10 = prefixMap[metricPrefix];
  log.debug('formatFromSIWithPrecision12', 'base10', base10, metricPrefix);
  if (!base10) return;

  const formattedResult = new BigNumber(number).dividedBy(base10);

  if (!formattedResult.isNaN()) return fromPrecision12(formattedResult);
};
