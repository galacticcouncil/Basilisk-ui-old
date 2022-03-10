import { LbpAssetWeights, LbpPool } from '../../../generated/graphql';
import { HydraDxMath } from '../../math/useMath';

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
  pool: Pick<LbpPool, 'sale'>,
  weights: Pick<LbpAssetWeights, 'initial' | 'final'>,
  relaychainBlockNumber: string
): string => {
  if (!pool.sale) throw Error('LBP sale start and end is unknown');
  return math.lbp.calculate_linear_weights(
    pool.sale.start!,
    pool.sale.end!,
    weights.initial,
    weights.final,
    relaychainBlockNumber
  );
};
