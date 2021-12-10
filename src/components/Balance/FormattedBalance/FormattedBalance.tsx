import { Balance } from '../../../generated/graphql';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { formatPrecisionSI, formatFixedSI, SI_PREFIXES } from '@gapit/format-si';
import { useMemo } from 'react';
import log from 'loglevel';
import './FormattedBalance.scss';
import BigNumber from 'bignumber.js';
import { prefix } from '@fortawesome/free-solid-svg-icons';
import { toPrecision12 } from '../../../hooks/math/useToPrecision';
import { MetricUnit, unitMap, UnitStyle } from '../metricUnit';
import { useFormatSI } from './hooks/useFormatSI';

// TODO: extract
export const assetIdNameMap: Record<string, { symbol: string, fullName: string }> = {
    '0': {
        symbol: 'BSX',
        fullName: 'Basilisk'
    }
}

export interface FormattedBalanceProps {
    balance: Balance,
    precision?: number,
    unitStyle: UnitStyle
}

export const FormattedBalance = ({ 
    balance,
    precision = 3,
    unitStyle = UnitStyle.LONG
}: FormattedBalanceProps) => {
    const assetSymbol = useMemo(() => 
        assetIdNameMap[balance.assetId]?.symbol, 
        [balance.assetId]
    );
    const formattedBalance = useFormatSI(
        precision, 
        unitStyle,
        balance.balance,
    );
    
    log.debug('FormattedBalance', formattedBalance?.value, formattedBalance?.unit, formattedBalance?.numberOfDecimalPlaces);

    // We don't need to use the currency input here
    // because when there is more than 3 significant digits, the formatter
    // moves one notch up/down and keeps a fixed precision
    return <div className='formatted-balance flex-container'>
        <div className='formatted-balance__value'>{formattedBalance.value}</div>
        <div className={`formatted-balance__suffix ${unitStyle.toLowerCase()}`}>{formattedBalance.suffix}</div>
        <div className='formatted-balance__symbol'>{assetSymbol}</div>
    </div>
};