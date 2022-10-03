import { GetPoolsQueryResponse } from '../../hooks/pools/queries/useGetPoolsQuery'
import { uniq } from 'lodash'
import { Pool } from '../../generated/graphql'
import { PoolType } from '../../components/Chart/shared'

export interface AssetMap {
  [key: string]: string[]
}

export type AssetList = string[]

export interface PoolAssetMap {
  poolAssetMap: AssetMap
  assets: AssetList
}

// Get a map of possible combinations of pools + list of all unique pool assets
export const getAssetMapsFromPools = (
  pools: Pool[],
  poolType: PoolType = PoolType.XYK
): PoolAssetMap => {
  const poolAssetMap: AssetMap = {}
  const assets = pools
    ?.map((pool) => {
      if (
        (pool.__typename === 'XYKPool' && poolType === PoolType.XYK) ||
        (pool.__typename === 'LBPPool' && poolType === PoolType.LBP)
      ) {
        if (!poolAssetMap[pool.assetInId]) {
          poolAssetMap[pool.assetInId] = [pool.assetOutId]
        } else if (!poolAssetMap[pool.assetInId].includes(pool.assetOutId)) {
          poolAssetMap[pool.assetInId].push(pool.assetOutId)
        }
        if (!poolAssetMap[pool.assetOutId]) {
          poolAssetMap[pool.assetOutId] = [pool.assetInId]
        } else if (!poolAssetMap[pool.assetOutId].includes(pool.assetInId)) {
          poolAssetMap[pool.assetOutId].push(pool.assetInId)
        }
        return [pool.assetInId, pool.assetOutId]
      } else return []
    })
    .reduce((assets, poolAssets) => {
      return assets.concat(poolAssets)
    }, [])
    .map((id) => id)

  const uniqueAssets = uniq(assets)

  console.warn('poolAssetMap', poolAssetMap, 'assets', uniqueAssets)

  return { assets: uniqueAssets, poolAssetMap }
}

export const getSecondaryAssets = (
  assetId: string,
  poolAssetMap: AssetMap,
  assets: AssetList
) => {
  return assets.filter((id) => {
    return !poolAssetMap[assetId]?.includes(id)
  })
}
