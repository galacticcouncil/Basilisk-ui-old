import { find } from 'lodash';
import { XykPool } from '../../../generated/graphql';
import { HydraDxMath } from '../../math/useMath';

export const calculateOutGivenIn = (
    math: HydraDxMath,
    inReserve: string,
    outReserve: string,
    amountIn: string,
) => math.xyk.calculate_out_given_in(inReserve, outReserve, amountIn);

export const calculateOutGivenInFromPool = (
    math: HydraDxMath,
    pool: XykPool,
    assetInId: string,
    assetOutId: string,
    amountIn: string,
) => {
    const assetInBalance = find(pool.balances, { assetId: assetInId })?.balance;
    const assetOutBalance = find(pool.balances, { assetId: assetOutId })?.balance

    if (!assetInBalance || !assetOutBalance) throw new Error(`Can't find the required balances in the pool`);

    return calculateOutGivenIn(math, assetInBalance, assetOutBalance, amountIn);
}