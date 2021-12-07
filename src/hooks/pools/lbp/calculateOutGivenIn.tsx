import { find } from 'lodash';
import { LbpPool } from '../../../generated/graphql';
import { HydraDxMath } from '../../math/useMath';
import { getInAndOutWeights, getPoolBalances } from './calculateInGivenOut';

/**
 * Wrapper for `math.lbp.calculate_out_given_in`
 * @param math 
 * @param inReserve 
 * @param outReserve 
 * @param inWeight 
 * @param outWeight 
 * @param amount 
 * @returns 
 */
export const calculateOutGivenIn = (
    math: HydraDxMath,
    inReserve: string,
    outReserve: string,
    inWeight: string,
    outWeight: string,
    amount: string,
) => {
    return math.lbp.calculate_out_given_in(inReserve, outReserve, inWeight, outWeight, amount);
}

export const calculateOutGivenInFromPool = (
    math: HydraDxMath,
    pool: LbpPool,
    assetInId: string,
    assetOutId: string,
    amountIn: string,
) => {
    const { assetABalance: assetInBalance, assetBBalance: assetOutBalance } = getPoolBalances(
        pool,
        assetInId,
        assetOutId,
    )

    if (!assetInBalance || !assetOutBalance) throw new Error(`Can't find the required balances in the pool`);

    const { assetInWeight, assetOutWeight } = getInAndOutWeights(pool, assetInId, assetOutId);

    return calculateOutGivenIn(
        math, 
        assetInBalance, 
        assetOutBalance,
        assetInWeight,
        assetOutWeight,
        amountIn
    );
}