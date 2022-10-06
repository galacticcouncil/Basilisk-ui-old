import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { useCallback } from 'react'
import {
  GetActiveAccountQueryResponse,
  GET_ACTIVE_ACCOUNT
} from '../accounts/queries/useGetActiveAccountQuery'
import { withErrorHandler } from '../apollo/withErrorHandler'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { usePersistentConfig } from './usePersistentConfig'

export const accountCurrencyMapDataType = 'Option<u32>'

export const __typename = 'Config'
export const id = __typename

export const nativeAssetId = '0'

export const useConfigQueryResolvers = () => {
  const { persistedConfig } = usePersistentConfig()
  const { apiInstance, loading } = usePolkadotJsContext()

  const config = withErrorHandler(
    useCallback(
      async (
        _obj,
        _variables,
        { cache }: { cache: ApolloCache<NormalizedCacheObject> }
      ) => {
        console.log('config query resolver')
        if (!apiInstance || loading) return

        // TODO: evict config from the cache after active account changes
        const address = cache.readQuery<GetActiveAccountQueryResponse>({
          query: GET_ACTIVE_ACCOUNT
        })?.activeAccount?.id

        if (!address) return

        let feePaymentAsset = address
          ? apiInstance
              .createType(
                accountCurrencyMapDataType,
                await apiInstance.query.multiTransactionPayment.accountCurrencyMap(
                  address
                )
              )
              ?.toHuman()
          : null

        console.log('found fee payment asset', feePaymentAsset)

        feePaymentAsset = feePaymentAsset ? feePaymentAsset : nativeAssetId

        return {
          __typename,
          id,
          ...persistedConfig,
          feePaymentAsset
        }
      },
      [apiInstance, loading, persistedConfig]
    )
  )

  return {
    config
  }
}
