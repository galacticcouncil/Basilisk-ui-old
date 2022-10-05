import { useCallback } from 'react'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { mapToPool } from './useGetXykPools'

export const useGetXykPool = () => {
  const { apiInstance, loading } = usePolkadotJsContext()

  return useCallback(
    async (poolId?: string) => {
      if (!apiInstance || loading || !poolId) return

      return mapToPool(apiInstance)([
        poolId,
        await apiInstance.query.xyk.poolAssets(poolId),
        await apiInstance.query.xyk.shareToken(poolId),
        await apiInstance.query.xyk.totalLiquidity(poolId)
      ])
    },
    [apiInstance, loading]
  )
}
