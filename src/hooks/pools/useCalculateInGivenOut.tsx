import { Pool, TradeType } from '../../generated/graphql';
import { useMathContext } from '../math/useMath'
import { applyTradeFee } from './resolvers/useSubmitTradeMutationResolvers';
import { getAssetBalance } from './useSpotPrice';

export const useCalculateInGivenOut = (
    pool?: Pool,
    assetInId?: string,
    assetOutId?: string,
    assetBBalanceInput?: string,
    tradeType?: TradeType,
) => {
    const { math } = useMathContext();
    const assetABalance = getAssetBalance(pool, assetInId)
    const assetBBalance = getAssetBalance(pool, assetOutId)

    if (!assetABalance || !assetBBalance || !math || !assetBBalanceInput || !tradeType) return;

    const inGivenOut = math?.xyk.calculate_in_given_out(
        assetABalance, // out_reserve
        assetBBalance, // in_reserve
        assetBBalanceInput, // amount_out
    );

    if (!inGivenOut) return;

    return {
        inGivenOut,
        inGivenOutWithFee: applyTradeFee(
            inGivenOut,
            '0.002',
            tradeType
        )
    }
}