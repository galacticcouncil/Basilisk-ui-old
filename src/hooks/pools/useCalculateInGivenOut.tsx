import { Pool } from '../../generated/graphql';
import { useMathContext } from '../math/useMath'
import { getAssetBalance } from './useSpotPrice';

export const useCalculateInGivenOut = (
    pool?: Pool,
    assetAId?: string,
    assetBId?: string,
    assetBBalanceInput?: string,
) => {
    const { math } = useMathContext();
    const assetABalance = getAssetBalance(pool, assetAId)
    const assetBBalance = getAssetBalance(pool, assetBId)

    if (!assetABalance || !assetBBalance || !math || !assetBBalanceInput) return;

    return math?.calculate_in_given_out(
        assetABalance,
        assetBBalance,
        assetBBalanceInput,
    )
}