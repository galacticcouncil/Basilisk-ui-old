import { useCallback } from 'react'
import { Asset } from '../../../generated/graphql'
import { withErrorHandler } from '../../apollo/withErrorHandler'
import { useGetAssets } from '../useGetAssets'

export const __typename: Asset['__typename'] = 'Asset'

export const useGetAssetsQueryResolver = () => {
  const getAssets = useGetAssets()

  return withErrorHandler(
    useCallback(async () => {
      return (await getAssets())?.map((asset) => ({
        ...asset,
        __typename
      }))
    }, [getAssets])
  )
}
