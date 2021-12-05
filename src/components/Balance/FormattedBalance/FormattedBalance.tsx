import { Balance } from '../../../generated/graphql';
import { fromPrecision12 } from '../../../hooks/math/useFromPrecision';
import { formatPrecisionSI } from '@gapit/format-si';
import { useMemo } from 'react';
import log from 'loglevel';
import './FormattedBalance.scss';

export const unitMap: Record<string, string> = {
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

export const useFormatSI = (
    assetSymbol: string,
    precision: number, 
    number?: string) => {
    const formattedBalance = useMemo(() => {
        const balanceWithPrecision12 = fromPrecision12(number);
        if (!balanceWithPrecision12) return;

        let siFormat = formatPrecisionSI(
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

        return ` ${unitName || unit} ${assetSymbol}`;
    }, [formattedBalance])

    return { ...formattedBalance, numberOfDecimalPlaces, suffix };
}

export interface FormattedBalanceProps {
    balance: Balance,
    precision?: number
}

export const FormattedBalance = ({ 
    balance,
    precision = 3
}: FormattedBalanceProps) => {
    // TODO: use asset.symbol instead
    const formattedBalance = useFormatSI('BSX', precision, balance.balance);
    
    log.debug('FormattedBalance', formattedBalance?.value, formattedBalance?.unit, formattedBalance?.numberOfDecimalPlaces);

    // We don't need to use the currency input here
    // because when there is more than 3 significant digits, the formatter
    // moves one notch up/down and keeps a fixed precision
    return <>
        <span>{formattedBalance.value}</span>
        <span>{formattedBalance.suffix}</span>
    </>
};