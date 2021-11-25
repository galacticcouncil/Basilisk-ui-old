import { Pool } from '../../generated/graphql';
import { useMathContext } from '../math/useMath'
import { getAssetBalance } from './useSpotPrice';

export const useCalculateOutGivenIn = (
    pool?: Pool,
    assetAId?: string,
    assetBId?: string,
    assetABalanceInput?: string,
) => {
    const { math } = useMathContext();
    const assetABalance = getAssetBalance(pool, assetAId)
    const assetBBalance = getAssetBalance(pool, assetBId)

    if (!assetABalance || !assetBBalance || !math || !assetABalanceInput) return;

    return math?.calculate_out_given_in(
        assetABalance, // in_reserve
        assetBBalance, // out_reserve
        assetABalanceInput, // amount_in
    )
}