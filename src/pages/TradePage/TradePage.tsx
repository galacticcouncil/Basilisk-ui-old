import { useApolloClient } from "@apollo/client";
import classNames from "classnames";
import { find } from "lodash";
import { Dispatch, SetStateAction, useState, useCallback, useEffect, useMemo } from "react";
import { Control, useForm, UseFormReturn, } from "react-hook-form";
import { useSearchParams } from "react-router-dom"
import { TradeForm } from "../../components/Trade/TradeForm/TradeForm";
import { AssetIds, Balance, Pool, TradeType } from "../../generated/graphql";
import { readActiveAccount } from "../../hooks/accounts/lib/readActiveAccount";
import { useGetActiveAccountQuery } from "../../hooks/accounts/queries/useGetActiveAccountQuery";
import { useMath } from "../../hooks/math/useMath";
import { useGetPoolByAssetsQuery } from "../../hooks/pools/queries/useGetPoolByAssetsQuery";
import { useAssetIdsWithUrl } from "./hooks/useAssetIdsWithUrl";

export interface TradeAssetIds {
  assetIn: string | null,
  assetOut: string | null
}

export const TradePage = () => {
  // taking assetIn/assetOut from search params / query url
  const [assetIds, setAssetIds] = useAssetIdsWithUrl();
  const { data: activeAccountData } = useGetActiveAccountQuery({
    fetchPolicy: 'cache-only'
  });

  const { data: poolData, loading: poolLoading } = useGetPoolByAssetsQuery({
    assetInId: assetIds.assetIn || undefined,
    assetOutId: assetIds.assetOut || undefined
  })

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount;
  }, [activeAccountData]);

  return <>
    <TradeForm
      assetIds={assetIds}
      onAssetIdsChange={(assetIds) => setAssetIds(assetIds)}
      isActiveAccountConnected={isActiveAccountConnected}
      pool={poolData?.pool}
      isPoolLoading={poolLoading}
    />
  </>
}