import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  useSearchParams,
  useNavigate,
  createSearchParams
} from 'react-router-dom'
import { TradeAssetIds } from '../TradePage'
import { idToAsset } from '../../../misc/idToAsset'
import { useDebugBoxContext } from './useDebugBox'

export const useAssetIdsWithUrl = (): [
  TradeAssetIds,
  Dispatch<SetStateAction<TradeAssetIds>>
] => {
  const [searchParams] = useSearchParams()
  const assetOut = idToAsset(searchParams.get('assetOut'))
  const assetIn = idToAsset(searchParams.get('assetIn'))
  const [assetIds, setAssetIds] = useState<TradeAssetIds>({
    // with default values if the router params are empty
    assetIn: assetIn?.id,
    assetOut: assetOut?.id || '0'
  })

  const navigate = useNavigate()
  const { debugBoxEnabled } = useDebugBoxContext()

  useEffect(() => {
    assetIds.assetIn &&
      assetIds.assetOut &&
      navigate({
        search: `?${createSearchParams({
          assetIn: assetIds.assetIn,
          assetOut: assetIds.assetOut,
          ...(debugBoxEnabled ? { debug: 'true' } : null)
        })}`
      })
  }, [assetIds, searchParams, debugBoxEnabled])

  return [assetIds, setAssetIds]
}
