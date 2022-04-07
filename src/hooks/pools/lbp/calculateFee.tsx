import { ApiPromise } from '@polkadot/api';
import { LbpPool } from '../../../generated/graphql';

/**
 * Fee applied when the repay target has not yet been met
 *
 * TODO: fetch from constants (?)
 */
export const repayFee = {
  numerator: 2,
  denominator: 10,
};

/**
 * Determines which fee should be applied depending
 * on if the repayTarget has been reached or not.
 * @param apiInstance
 * @param pool
 */
export const calculateFee = async (apiInstance: ApiPromise, pool: LbpPool) => {
  // const poolAssetIds = [pool.assetInId];
  // const balances = getBalancesByAddress(apiInstance, pool.feeCollector, poolAssetIds);
  // const accumulatedAssetBalance = find(balances, {
  //     assetId: pool.assetInId
  // });
};
