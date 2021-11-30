import { find } from 'lodash';
import { useMemo } from 'react';
import { LbpPool } from '../../../generated/graphql';
import { HydraDxMath, useMathContext } from '../../math/useMath';

export const oneWithPrecision = '1000000000000'; // 10^12 doesnt work, use 10^9 instead

export const calculateSpotPrice = (
    math: HydraDxMath,
    inReserve: string,
    outReserve: string,
    inWeight: string,
    outWeight: string,
    amount: string = oneWithPrecision,
) => math.lbp.get_spot_price(inReserve, outReserve, inWeight, outWeight, amount);

export const calculateSpotPriceFromPool = (
    math: HydraDxMath,
    pool: LbpPool,
    assetInId: string,
    assetOutId: string,
) => {
    const assetInBalance = find(pool.balances, { assetId: assetInId })?.balance;
    const assetOutBalance = find(pool.balances, { assetId: assetOutId })?.balance

    if (!assetInBalance || !assetOutBalance) throw new Error(`Can't find the required balances in the pool`);

    const assetInWeight = assetInId === pool.assetAId
        ? pool.assetAWeights.current
        : pool.assetBWeights.current

    const assetOutWeight = assetOutId === pool.assetBId
        ? pool.assetBWeights.current
        : pool.assetAWeights.current;

    return calculateSpotPrice(
        math, 
        assetInBalance, 
        assetOutBalance,
        assetInWeight,
        assetOutWeight,
    );
}
