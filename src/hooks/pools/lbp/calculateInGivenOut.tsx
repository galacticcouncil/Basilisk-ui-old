import { find } from 'lodash';
import { LbpPool, Pool } from '../../../generated/graphql';
import { HydraDxMath } from '../../math/useMath';

/**
 * Wrapper for `math.lbp.calculate_in_given_out`
 * @param math
 * @param inReserve 
 * @param outReserve 
 * @param inWeight 
 * @param outWeight 
 * @param amount 
 * @returns 
 */
export const calculateInGivenOut = (
    math: HydraDxMath,
    inReserve: string,
    outReserve: string,
    inWeight: string,
    outWeight: string,
    amount: string
) => {
    return math.lbp.calculate_in_given_out(inReserve, outReserve, inWeight, outWeight, amount);
}

export const getPoolBalances = (pool: Pool, assetInId: string, assetOutId: string) => {
    const assetABalance = find(pool.balances, { assetId: assetInId })?.balance;
    const assetBBalance = find(pool.balances, { assetId: assetOutId })?.balance

    return { assetABalance, assetBBalance }
}

export const getInAndOutWeights = (pool: LbpPool, assetInId: string, assetOutId: string) => {
    const assetInWeight = assetInId === pool.assetInId
        ? pool.assetAWeights.current
        : pool.assetBWeights.current

    const assetOutWeight = assetOutId === pool.assetOutId
        ? pool.assetBWeights.current
        : pool.assetAWeights.current;

    return { assetInWeight, assetOutWeight };
}

export const calculateInGivenOutFromPool = (
    math: HydraDxMath,
    pool: LbpPool,
    assetInId: string,
    assetOutId: string,
    amountOut: string,
) => {
    const { assetABalance: assetInBalance, assetBBalance: assetOutBalance } = getPoolBalances(
        pool,
        assetInId,
        assetOutId,
    )

    if (!assetInBalance || !assetOutBalance) throw new Error(`Can't find the required balances in the pool`);

    const { assetInWeight, assetOutWeight } = getInAndOutWeights(pool, assetInId, assetOutId);

    return calculateInGivenOut(
        math, 
        assetInBalance, 
        assetOutBalance,
        assetInWeight,
        assetOutWeight,
        amountOut
    );
}