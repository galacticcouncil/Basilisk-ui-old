import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import { TradeAssetIds } from "../TradePage";

export const useAssetIdsWithUrl = (): [TradeAssetIds, Dispatch<SetStateAction<TradeAssetIds>>] => {
    const [searchParams] = useSearchParams();
    const [assetIds, setAssetIds] = useState<TradeAssetIds>({
      // with default values if the router params are empty
      assetIn: searchParams.get('assetIn'),
      assetOut: searchParams.get('assetOut') || '0'
    });

    const navigate = useNavigate();

    useEffect(() => {
      assetIds.assetIn && assetIds.assetOut && navigate({
        search: `?${createSearchParams({
          assetIn: assetIds.assetIn,
          assetOut: assetIds.assetOut
        })}`
      });
    }, [assetIds]);
  
    return [assetIds, setAssetIds];
  }