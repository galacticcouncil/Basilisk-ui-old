import { NetworkStatus } from '@apollo/client'

import { find } from 'lodash'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Balance } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'

import { useMath } from '../../hooks/math/useMath'

import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery'
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl'

import '../TradePage/TradePage.scss'

import { useLoading } from '../../hooks/misc/useLoading'
import { useGetPoolsQuery } from '../../hooks/pools/queries/useGetPoolsQuery'

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'

import Icon from '../../components/Icon/Icon'
import {
  PoolsForm,
  PoolsFormFields,
  ProvisioningType
} from '../../components/Pools/PoolsForm'
import { useAddLiquidityMutation } from '../../hooks/pools/mutations/useAddLiquidityMutation'
import { useRemoveLiquidityMutation } from '../../hooks/pools/mutations/useRemoveLiquidityMutation'
import { getAssetMapsFromPools } from '../../misc/utils/getAssetMap'

export interface TradeAssetIds {
  assetIn: string | null
  assetOut: string | null
}

export const PoolsPage = () => {
  // taking assetIn/assetOut from search params / query url
  const [assetIds, setAssetIds] = useAssetIdsWithUrl()
  const { data: activeAccountData } = useGetActiveAccountQuery({
    fetchPolicy: 'cache-only'
  })
  const { math } = useMath()
  // progress, not broadcast because we dont wait for broadcast to happen here
  const [notification, setNotification] = useState<
    'standby' | 'pending' | 'success' | 'failed'
  >('standby')

  const depsLoading = useLoading()
  const {
    data: poolData,
    loading: poolLoading,
    networkStatus: poolNetworkStatus
  } = useGetPoolByAssetsQuery(
    {
      assetInId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetIn
          : assetIds.assetOut) || undefined,
      assetOutId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetOut
          : assetIds.assetIn) || undefined
    },
    depsLoading
  )

  const { data: poolsData, networkStatus: poolsNetworkStatus } =
    useGetPoolsQuery({
      skip: depsLoading
    })

  const { assets, poolAssetMap } = useMemo(() => {
    return getAssetMapsFromPools(poolsData?.pools || [])
  }, [poolsData])

  const xykPool =
    poolData?.pool && poolData.pool.__typename === 'XYKPool'
      ? poolData.pool
      : undefined

  const pool = useMemo(() => xykPool, [xykPool])

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount
  }, [activeAccountData])

  const clearNotificationIntervalRef = useRef<any>()

  // const {
  //   mutation: [
  //     submitTrade,
  //     { loading: tradeLoading, error: tradeError },
  //   ],
  //   confirmationScreen
  // } = useWithConfirmation(
  //   useSubmitTradeMutation({
  //     onCompleted: () => {
  //       setNotification('success');
  //       clearNotificationIntervalRef.current = setTimeout(() => {
  //         setNotification('standby');
  //       }, 4000);
  //     },
  //     onError: () => {
  //       setNotification('failed');
  //       clearNotificationIntervalRef.current = setTimeout(() => {
  //         setNotification('standby');
  //       }, 4000);
  //     },
  //   }),
  //   ConfirmationType.Trade
  // );

  const [
    removeLiquidity,
    { loading: removeLiquidityLoading, error: removeLiquidityError }
  ] = useRemoveLiquidityMutation({
    onCompleted: () => {
      setNotification('success')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    },
    onError: () => {
      setNotification('failed')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    }
  })

  const [
    addLiquidity,
    { loading: addLiquidityLoading, error: addLiquidityLError }
  ] = useAddLiquidityMutation({
    onCompleted: () => {
      setNotification('success')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    },
    onError: () => {
      setNotification('failed')
      clearNotificationIntervalRef.current = setTimeout(() => {
        setNotification('standby')
      }, 4000)
    }
  })

  console.log('removeLiquidityError', removeLiquidityError)

  useEffect(() => {
    if (removeLiquidityLoading || addLiquidityLoading)
      setNotification('pending')
  }, [removeLiquidityLoading, addLiquidityLoading])

  const handleSubmit = useCallback(
    (variables: PoolsFormFields & { amountBMaxLimit?: string }) => {
      clearNotificationIntervalRef.current &&
        clearTimeout(clearNotificationIntervalRef.current)
      clearNotificationIntervalRef.current = null
      if (variables.provisioningType === ProvisioningType.Remove) {
        console.log('removing liquidity', variables)
        if (
          !variables.assetIn ||
          !variables.assetOut ||
          !variables.shareAssetAmount
        )
          return
        removeLiquidity({
          variables: {
            assetA: variables.assetIn,
            assetB: variables.assetOut,
            amount: variables.shareAssetAmount
          }
        })
      } else {
        console.log('adding liquidity', variables)
        if (
          !variables.assetIn ||
          !variables.assetOut ||
          !variables.assetInAmount ||
          !variables.amountBMaxLimit
        )
          return

        addLiquidity({
          variables: {
            assetA: variables.assetIn,
            assetB: variables.assetOut,
            amountA: variables.assetInAmount,
            amountBMaxLimit: variables.amountBMaxLimit
          }
        })
      }
    },
    [removeLiquidity]
  )

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined
    return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds])

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined
    return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds])

  const spotPrice = useMemo(() => {
    if (!assetOutLiquidity || !assetInLiquidity || !math) return
    let spotPrice = {
      outIn: math.xyk.get_spot_price(
        assetOutLiquidity,
        assetInLiquidity,
        '1000000000000'
      ),
      inOut: math.xyk.get_spot_price(
        assetInLiquidity,
        assetOutLiquidity,
        '1000000000000'
      )
    }

    return spotPrice
  }, [assetOutLiquidity, assetInLiquidity, math])

  const {
    data: activeAccountTradeBalancesData,
    networkStatus: activeAccountTradeBalancesNetworkStatus
  } = useGetActiveAccountTradeBalances({
    variables: {
      assetInId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetIn
          : assetIds.assetOut) || undefined,
      assetOutId:
        (assetIds.assetIn! > assetIds.assetOut!
          ? assetIds.assetOut
          : assetIds.assetIn) || undefined,
      shareTokenId: pool?.shareTokenId || undefined
    }
  })

  const tradeBalances = useMemo(() => {
    const balances = activeAccountTradeBalancesData?.activeAccount?.balances

    const outBalance = find(balances, {
      assetId: assetIds.assetOut
    }) as Balance | undefined

    const inBalance = find(balances, {
      assetId: assetIds.assetIn
    }) as Balance | undefined

    const shareBalance = find(balances, {
      assetId: pool?.shareTokenId
    }) as Balance | undefined

    console.log('share balance', balances, shareBalance, pool?.id)

    return { outBalance, inBalance, shareBalance }
  }, [activeAccountTradeBalancesData, assetIds, pool])

  return (
    <div className="trade-page-wrapper">
      {/* {confirmationScreen} */}
      {/*NOTIF*/}
      <div className={'notifications-bar transaction-' + notification}>
        <div className="notification-icon"></div>
        <div className="notification">Transaction {notification}</div>
        <div className="notification-cancel-wrapper">
          <button
            className="notification-cancel-button"
            onClick={() => setNotification('standby')}
          >
            <Icon name="Cancel" />
          </button>
        </div>
      </div>
      {/*NOTIF*/}
      <div className="trade-page">
        <div className="trade-page__content">
          <PoolsForm
            assetIds={assetIds}
            onAssetIdsChange={(assetIds) => setAssetIds(assetIds)}
            isActiveAccountConnected={isActiveAccountConnected}
            pool={pool}
            // first load and each time the asset ids (variables) change
            isPoolLoading={
              poolNetworkStatus === NetworkStatus.loading ||
              poolNetworkStatus === NetworkStatus.setVariables ||
              depsLoading
            }
            assetInLiquidity={assetInLiquidity}
            assetOutLiquidity={assetOutLiquidity}
            spotPrice={spotPrice}
            onSubmit={handleSubmit}
            tradeLoading={removeLiquidityLoading || addLiquidityLoading}
            assets={assets}
            assetMap={poolAssetMap}
            activeAccount={activeAccountData?.activeAccount}
            activeAccountTradeBalances={tradeBalances}
            activeAccountTradeBalancesLoading={
              activeAccountTradeBalancesNetworkStatus ===
                NetworkStatus.loading ||
              activeAccountTradeBalancesNetworkStatus ===
                NetworkStatus.setVariables ||
              depsLoading
            }
          />
        </div>
      </div>
    </div>
  )
}
