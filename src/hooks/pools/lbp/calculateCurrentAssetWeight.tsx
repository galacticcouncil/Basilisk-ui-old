import { LbpAssetWeights, LbpPool, Pool } from '../../../generated/graphql'
import { HydraDxMath } from '../../math/useMath'

/**
 * Used to determine the current asset weight, given the initial/final weights
 * and the interval it should be interpolated on.
 *
 * @param math
 * @param pool
 * @param weights
 * @param relaychainBlockNumber
 * @returns Current asset weight, calculated lineary from the inputs above
 */
export const calculateCurrentAssetWeight = (
  math: HydraDxMath,
  pool: Pick<LbpPool, 'startBlock' | 'endBlock'>,
  weights: Pick<LbpAssetWeights, 'initial' | 'final'>,
  relaychainBlockNumber: string
): number => {
  if (pool.startBlock && pool.endBlock) {
    return parseInt(
      math.lbp.calculate_linear_weights(
        pool.startBlock.toString(),
        pool.endBlock.toString(),
        weights.initial.toString(),
        weights.final.toString(),
        relaychainBlockNumber
      )
    )
  } else return 0
}
