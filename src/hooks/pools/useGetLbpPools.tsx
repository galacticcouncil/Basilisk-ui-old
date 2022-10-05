import { ApiPromise } from '@polkadot/api'
import { useCallback } from 'react'
import { Fee, LbpAssetWeights, LbpPool } from '../../generated/graphql'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import type { Codec } from '@polkadot/types/types'
import { mapToPoolId } from './useGetXykPools'
import { calculateOppositeAssetWeight } from './lbp/calculateOppositeAssetWeight'
import { HydraDxMath, useMathContext } from '../math/useMath'
import { calculateCurrentAssetWeight } from './lbp/calculateCurrentAssetWeight'
import { ApolloClient } from '@apollo/client'
import { readLastBlock } from '../lastBlock/readLastBlock'
import { BigNumber } from 'bignumber.js'
import { getLockedBalanceByAddressAndLockId } from '../vesting/calculateClaimableAmount'

export type AssetPair = number[]
export interface PoolData {
  assets: AssetPair
  feeCollector: string
  fee: string[]
  repayTarget: number
  repayTargetReached: string
  initialWeight: number
  finalWeight: number
  start: number
  end: number
}

// ID isnt parsed when converting the codec into a JSON
export const lbpRepayFeeLockId = '0x6c6270636c6c6374' // 'lbpcllct';
export const balanceDataType = 'BalanceOf'

// fee applied in a case when the repayTarget has not been reached
const repayFee: Fee = {
  numerator: '2',
  denominator: '10'
}

/**
 * @param math
 * @param client
 * @returns Function to format the given codec into an LBPPool
 */
export const mapToPool =
  (math: HydraDxMath, client: ApolloClient<object>, apiInstance: ApiPromise) =>
  /**
   * @param [id, codec]
   * @returns LBPPool parsed from the coded provided as an argument
   */
  async ([id, codec]: [string, Codec]) => {
    // TODO this is possibly VERY unsafe and needs to be revisited for type parsing / creation

    // const poolData = apiInstance.registry.createType(
    //   'Option<PalletLbpPool>',
    //   codec
    // ).unwrap()

    const poolData = codec.toJSON() as unknown as PoolData

    const lastBlockData = readLastBlock(client)
    const relaychainBlockNumber =
      lastBlockData?.lastBlock?.relaychainBlockNumber

    if (!poolData || !relaychainBlockNumber) return

    console.log('have LBP pool data', poolData)

    const feeCollector = poolData.feeCollector.toString()
    const repayTarget = apiInstance
      .createType(balanceDataType, poolData.repayTarget.toString())
      .toString()

    // construct the pool entity without weights
    const partialPool: Omit<
      LbpPool,
      | 'assetBWeights'
      | 'assetAWeights'
      | 'repayTargetReached'
      | 'repayTarget'
      | 'fee'
      | 'feeCollectorBalance'
    > = {
      id,
      assetInId: poolData.assets[0].toString(), // Accumulated asset
      assetOutId: poolData.assets[1].toString(), // Distributed asset
      startBlock: poolData.start,
      endBlock: poolData.end,
      feeCollector
    }

    // determine weights for asset A
    const partialAssetAWeights: Omit<LbpAssetWeights, 'current'> = {
      initial: poolData.initialWeight,
      final: poolData.finalWeight
    }

    const assetAWeights: LbpAssetWeights = {
      ...partialAssetAWeights,
      current: calculateCurrentAssetWeight(
        math,
        partialPool,
        partialAssetAWeights,
        relaychainBlockNumber.toString()
      )
    }

    // determine weights for asset B
    const assetBWeights: LbpAssetWeights = {
      initial: calculateOppositeAssetWeight(assetAWeights.initial),
      final: calculateOppositeAssetWeight(assetAWeights.final),
      current: calculateOppositeAssetWeight(assetAWeights.current)
    }

    // TODO: this function only works by finding the first lock with the given ID
    // TODO: this data fetching should be moved to a resolver, and this mapper
    // should be a plain function
    const feeCollectorBalanceLockAmount = (
      await getLockedBalanceByAddressAndLockId(
        apiInstance,
        feeCollector,
        lbpRepayFeeLockId
      )
    )?.amount?.toString()

    const repayTargetReached =
      repayTarget && feeCollectorBalanceLockAmount
        ? // if collected fees are greater than the repay target, the repay target has been reached
          // this means that we won't apply the repay fee down the line
          new BigNumber(feeCollectorBalanceLockAmount).gt(
            new BigNumber(repayTarget)
          )
        : false

    const poolFee: Fee = {
      numerator: poolData.fee[0],
      denominator: poolData.fee[1]
    }

    console.log(
      'REPAY TARGET REACHED:',
      repayTargetReached,
      feeCollector,
      repayTarget,
      feeCollectorBalanceLockAmount
    )

    console.log('have fee', poolFee)

    const pool: LbpPool = {
      ...partialPool,
      assetAWeights,
      assetBWeights,
      repayTargetReached,
      feeCollector,
      feeCollectorBalance: feeCollectorBalanceLockAmount,
      repayTarget,
      // if we've haven't reached the repay target, the pool will carry a larger fee
      fee: repayTargetReached ? poolFee : repayFee
    }

    console.log('returning pool', pool)

    return pool
  }

export const getLbpPools = async (
  apiInstance: ApiPromise,
  math: HydraDxMath,
  client: ApolloClient<object>
) => {
  return (
    (await Promise.all(
      (await apiInstance.query.lbp.poolData.entries())
        .map(mapToPoolId)
        .map(mapToPool(math, client, apiInstance))
    )) || []
  )
}

/**
 * Hook to fetch and map LBPPool data
 * @returns Function that returns the on-chain LBPPool(s)
 */
export const useGetLbpPools = () => {
  const { apiInstance, loading } = usePolkadotJsContext()
  const { math } = useMathContext()

  return useCallback(
    async (client: ApolloClient<object>) => {
      // return an empty array by default
      if (!apiInstance || loading || !math) return []

      return getLbpPools(apiInstance, math, client)
    },
    [apiInstance, loading, math]
  )
}
