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
    weights: {
      assetA: {
        initial: lbpPool.initialWeight.toString(),
        final: lbpPool.finalWeight.toString(),
      },
      assetB: {
        initial: lbpPool.finalWeight.toString(),
        final: lbpPool.initialWeight.toString(),
      },
    },
    assetIds: {
      a: lbpPool.assets[0].toString(),
      b: lbpPool.assets[1].toString(),
    },
    sale: {
      start: lbpPool.start?.toString(),
      end: lbpPool.end?.toString(),
    },
    fee: {
      numerator: lbpPool.fee[0].toString(),
      denominator: lbpPool.fee[1].toString(),
    },
    feeCollector: lbpPool.feeCollector.toString(),
    repayTarget: lbpPool.repayTarget.toString(),
  };
};
