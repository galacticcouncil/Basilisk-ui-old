import { XykPool } from '../../../generated/graphql'
import { HydraDxMath } from '../../math/useMath'
import { getPoolBalances } from '../lbp/calculateInGivenOut'

export const calculateInGivenOut = (
  math: HydraDxMath,
  outReserve: string,
  inReserve: string,
  amountOut: string
) => math.xyk.calculate_in_given_out(outReserve, inReserve, amountOut)

export const calculateInGivenOutFromPool = (
  math: HydraDxMath,
  pool: XykPool,
  assetInId: string,
  assetOutId: string,
  amountOut: string
) => {
  const { assetABalance: assetInBalance, assetBBalance: assetOutBalance } =
    getPoolBalances(pool, assetInId, assetOutId)

  if (!assetInBalance || !assetOutBalance)
    throw new Error(`Can't find the required balances in the pool`)

  //TODO: argument order appears swapped when compared to the hydradx-math library
  return calculateInGivenOut(math, assetInBalance, assetOutBalance, amountOut)
}
