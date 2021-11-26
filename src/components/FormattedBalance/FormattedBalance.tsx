import {formatBalance} from '../../misc/utils/formatBalance';

export const FormattedBalance = ({
    value, // Balance
    precision, // Balance precision, eg 12
    decimals // output decimals - max possible 3.
}: {
    value: number,
    precision: number,
    decimals: number
}) => {
    return <span> `${formatBalance(value, precision, decimals)}` </span>
}