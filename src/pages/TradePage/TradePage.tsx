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
  const { math } = useMath();

  const { data: poolData, loading: poolLoading } = useGetPoolByAssetsQuery({
    assetInId: assetIds.assetIn || undefined,
    assetOutId: assetIds.assetOut || undefined
  });

  const pool = useMemo(() => poolData?.pool, [poolData]);

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount;
  }, [activeAccountData]);

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined;
      return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds]);

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined;
      return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds]);

  const spotPrice = useMemo(() => {
      if (!assetOutLiquidity || !assetInLiquidity || !math) return;
      return {
          inOut: math.xyk.get_spot_price(assetOutLiquidity, assetInLiquidity, '1000000000000'),
          outIn: math.xyk.get_spot_price(assetInLiquidity, assetOutLiquidity, '1000000000000')
      }
  }, [assetOutLiquidity, assetInLiquidity, math]);

  return <>
    <TradeForm
      assetIds={assetIds}
      onAssetIdsChange={(assetIds) => setAssetIds(assetIds)}
      isActiveAccountConnected={isActiveAccountConnected}
      pool={pool}
      isPoolLoading={poolLoading}
      assetInLiquidity={assetInLiquidity}
      assetOutLiquidity={assetOutLiquidity}
      spotPrice={spotPrice}
    />
  </>
}