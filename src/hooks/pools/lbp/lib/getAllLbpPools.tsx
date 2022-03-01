import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { LbpPool } from '../../../../generated/graphql';
import { PalletLbpPool } from '../../types';
import '@polkadot/api-augment';

/**
 * This function fetches all LBP pools in the network.
 *
 * @param apiInstance APIPromise of polkadot.js
 * @returns an array of all LBP pools. Can be an empty array.
 */
export const getAllLbpPools = async (
  apiInstance: ApiPromise
): Promise<LbpPool[]> => {
  // fetch all LBP pools
  const allLbpPools = await apiInstance.query.lbp.poolData.entries<
    Option<PalletLbpPool>
  >();

  const lbpPools: LbpPool[] = [];

  allLbpPools.forEach(([address, lbpPoolOptional]) => {
    // safety check before unwrapping
    if (lbpPoolOptional.isNone) return;
    const lbpPool = unwrapOptionalLbpPool(lbpPoolOptional);
    // basilisk formatted address as ID
    lbpPool.id = address.args.toString();

    lbpPools.push(lbpPool as LbpPool);
  });

  return lbpPools;
};

const unwrapOptionalLbpPool = (
  lbpPoolOptional: Option<PalletLbpPool>
): Partial<LbpPool> => {
  const lbpPool = lbpPoolOptional.unwrap();

  return {
    assetAWeights: {
      initial: lbpPool.initialWeight.toString(),
      final: lbpPool.finalWeight.toString(),
      current: lbpPool.initialWeight.toString(),
    },
    assetBWeights: {
      initial: lbpPool.finalWeight.toString(),
      final: lbpPool.initialWeight.toString(),
      current: lbpPool.finalWeight.toString(),
    },
    assetInId: lbpPool.assets[0].toString(),
    assetOutId: lbpPool.assets[1].toString(),
    startBlock: lbpPool.start.toString(),
    endBlock: lbpPool.end.toString(),
    fee: {
      numerator: lbpPool.fee[0].toString(),
      denominator: lbpPool.fee[1].toString(),
    },
    repayTargetReached: false,
  };
};
