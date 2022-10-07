import { find } from 'lodash'
import { XykPool } from '../../../generated/graphql'
import { HydraDxMath } from '../../math/useMath'
import { oneWithPrecision } from '../lbp/calculateSpotPrice'

export const calculateSpotPrice = (
  math: HydraDxMath,
  inReserve: string,
  outReserve: string
) => math.xyk.get_spot_price(inReserve, outReserve, oneWithPrecision)

export const calculateSpotPriceFromPool = (
  math: HydraDxMath,
  pool: XykPool,
  assetInId: string,
  assetOutId: string
) => {
  const assetInBalance = find(pool.balances, { assetId: assetInId })?.balance
  const assetOutBalance = find(pool.balances, { assetId: assetOutId })?.balance

  if (!assetInBalance || !assetOutBalance) return

  return calculateSpotPrice(math, assetInBalance, assetOutBalance)
}
