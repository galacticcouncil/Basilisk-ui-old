import { Dispatch, SetStateAction, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TradeAssetIds } from "../TradePage";

export const useAssetIdsWithUrl = (): [TradeAssetIds, Dispatch<SetStateAction<TradeAssetIds>>] => {
    const [searchParams] = useSearchParams();
    const [assetIds, setAssetIds] = useState<TradeAssetIds>({
      // with default values if the router params are empty
      assetIn: searchParams.get('assetIn'),
      assetOut: searchParams.get('assetOut') || '0'
    });
  
    return [assetIds, setAssetIds];
  }