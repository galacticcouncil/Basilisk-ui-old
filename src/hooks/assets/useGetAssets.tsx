import { useCallback } from 'react'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import type { Codec } from '@polkadot/types/types'
import { ApiPromise } from '@polkadot/api'
import { Asset } from '../../generated/graphql'

export const assetDataType = 'Option<u32>'

// TODO: parse the symbol from the storage key, or use a static client-side symbol map
export const mapToAsset =
  (apiInstance: ApiPromise) =>
  ([_storageKey, codec]: [unknown, Codec]) => {
    return {
      id: apiInstance.createType(assetDataType, codec).toHuman() as string
    } as Asset
  }

export const useGetAssets = () => {
  const { apiInstance, loading } = usePolkadotJsContext()

  return useCallback(async () => {
    if (!apiInstance || loading) return

    // TODO: do we wanna order these by id?
    return (
      (await apiInstance?.query.assetRegistry.assetIds.entries()).map(
        mapToAsset(apiInstance)
      ) || []
    )
  }, [apiInstance, loading])
}
