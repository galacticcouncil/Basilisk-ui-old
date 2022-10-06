import { XykPool, TradeType } from '../../../generated/graphql'
import { useMathContext } from '../../math/useMath'
import { applyTradeFee } from '../resolvers/useSubmitTradeMutationResolvers'
import { getAssetBalance } from './useSpotPrice'

export const useCalculateOutGivenIn = (
  pool?: XykPool,
  assetInId?: string,
  assetOutId?: string,
  assetABalanceInput?: string,
  tradeType?: TradeType
) => {
  const { math } = useMathContext()
  const assetABalance = getAssetBalance(pool, assetInId)
  const assetBBalance = getAssetBalance(pool, assetOutId)

  if (
    !assetABalance ||
    !assetBBalance ||
    !math ||
    !assetABalanceInput ||
    !tradeType
  )
    return

  const outGivenIn = math?.xyk.calculate_out_given_in(
    assetABalance, // in_reserve
    assetBBalance, // out_reserve
    assetABalanceInput // amount_in
  )

  if (!outGivenIn) return

  return {
    outGivenIn,
    outGivenInWithFee: applyTradeFee(outGivenIn, '0.003', tradeType)
  }
}
