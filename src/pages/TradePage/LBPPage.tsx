import { NetworkStatus } from '@apollo/client'
import { PolkadotApiPoolService, TradeRouter } from '@galacticcouncil/sdk'
import { find } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PoolType } from '../../components/Chart/shared'
import Icon from '../../components/Icon/Icon'
import { TradeForm } from '../../components/Trade/TradeForm/LBPTradeForm'
import { Balance } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import { usePersistentConfig } from '../../hooks/config/usePersistentConfig'
import { useMath } from '../../hooks/math/useMath'
import { useLoading } from '../../hooks/misc/useLoading'
import { usePolkadotJsContext } from '../../hooks/polkadotJs/usePolkadotJs'
import { useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation'
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery'
import { useGetPoolsQueryProvider } from '../../hooks/pools/queries/useGetPoolsQuery'
import { idToAsset } from '../../misc/idToAsset'
import { getAssetMapsFromPools } from '../../misc/utils/getAssetMap'
import { EnhancedTradeChart } from './EnhancedTradeChart'
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl'
import './LBPPage.scss'
import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'
import './TradePage.scss'

// import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';
// import { calculateSpotPrice } from '../../hooks/pools/lbp/calculateSpotPrice'

export enum LbpStatus {
  NOT_EXISTS,
  NOT_INITIALIZED,
  NOT_STARTED,
  IN_PROGRESS,
  ENDED
}

export const LBPPage = () => {
  const { math } = useMath()
  const { apiInstance, loading: apiLoading } = usePolkadotJsContext()

  const {
    persistedConfig: { valueDisplayAsset }
  } = usePersistentConfig()

  const poolService = useMemo(() => {
    return apiInstance && !apiLoading
      ? new PolkadotApiPoolService(apiInstance)
      : undefined
  }, [apiInstance, apiLoading])

  const tradeRouter = useMemo(() => {
    return poolService ? new TradeRouter(poolService) : undefined
  }, [poolService])

  const getBestSpotPrice = useCallback(
    async (assetIn, assetOut) => {
      return await tradeRouter?.getBestSpotPrice(assetIn, assetOut)
    },
    [tradeRouter]
  )

  const [repayTargetDetails, setRepayTargetDetails] = useState({
    repayTargetReached: undefined,
    collectorAccount: undefined,
    repayTarget: undefined
  })

  const [spotPrice, setSpotPrice] = useState({ outIn: 0, inOut: 0 })
  const [usdPrice, setUsdPrice] = useState({
    assetIn: 0,
    assetOut: 0,
    accumulated: 0,
    accumulatedAtEnd: 0,
    assetInAsString: '-',
    assetOutAsString: '-',
    accumulatedAsString: '-',
    accumulatedAtEndAsString: '-'
  })

  // taking assetIn/assetOut from search params / query url
  const [assetIds, setAssetIds] = useAssetIdsWithUrl()
  const { data: activeAccountData } = useGetActiveAccountQuery({
    fetchPolicy: 'cache-only'
  })

  // progress, not broadcast because we dont wait for broadcast to happen here
  const [notification, setNotification] = useState<
    'standby' | 'pending' | 'success' | 'failed'
  >('standby')

  const [chartVisible, setChartVisible] = useState(false)

  const depsLoading = useLoading()

  const {
    data: poolData,
    loading: poolLoading,
    networkStatus: poolNetworkStatus
  } = useGetPoolByAssetsQuery(
    {
      assetInId: assetIds.assetIn || undefined,
      assetOutId: assetIds.assetOut || undefined
    },
    depsLoading
  )

  const {
    data: poolsData
    // networkStatus: poolsNetworkStatus
  } = useGetPoolsQueryProvider()

  const { assets, poolAssetMap } = useMemo(
    () => getAssetMapsFromPools(poolsData?.pools || [], PoolType.LBP),
    [poolsData]
  )

  const lbpPool = useMemo(() => {
    return poolData?.pool && poolData.pool.__typename === 'LBPPool'
      ? poolData.pool
      : undefined
  }, [poolData])

  if (!assetIds.assetIn || !assetIds.assetOut) {
    const newPool = poolsData?.pools?.[0]
    console.log('NEW POOL', newPool)
    if (newPool) {
      assetIds.assetIn = newPool.assetInId
      assetIds.assetOut = newPool.assetOutId
    }
  }

  const pool = useMemo(() => lbpPool, [lbpPool])

  const assetInName = useMemo(() => {
    return pool ? idToAsset(pool.assetOutId) : ''
  }, [pool])

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount
  }, [activeAccountData])

  const clearNotificationIntervalRef = useRef<any>()

  const [submitTrade, { loading: tradeLoading, error: tradeError }] =
    useSubmitTradeMutation({
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

  useEffect(() => {
    if (tradeLoading) setNotification('pending')
  }, [tradeLoading])

  useEffect(() => {
    if (tradeError) setNotification('failed')
  }, [tradeError])

  const handleSubmitTrade = useCallback(
    (variables) => {
      clearNotificationIntervalRef.current &&
        clearTimeout(clearNotificationIntervalRef.current)
      clearNotificationIntervalRef.current = null
      submitTrade({ variables })
    },
    [submitTrade]
  )

  const accumulating = useMemo(() => {
    return assetIds.assetIn === pool?.assetInId
  }, [assetIds, pool])

  const assetOutLiquidity = useMemo(() => {
    const assetId = assetIds.assetOut || undefined
    return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds])

  const assetInLiquidity = useMemo(() => {
    const assetId = assetIds.assetIn || undefined
    return find<Balance | null>(pool?.balances, { assetId })?.balance
  }, [pool, assetIds])

  const assetOutWeight = useMemo(() => {
    return assetIds.assetIn === pool?.assetOutId
      ? pool?.assetAWeights
      : pool?.assetBWeights
  }, [pool, assetIds])

  const assetInWeight = useMemo(() => {
    return assetIds.assetOut === pool?.assetOutId
      ? pool?.assetAWeights
      : pool?.assetBWeights
  }, [pool, assetIds])

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
          : assetIds.assetIn) || undefined
    }
  })

  const repayTargetReached = useMemo(() => {
    return pool ? (pool.repayTargetReached as boolean) : undefined
  }, [pool])

  console.log('BbB', pool, lbpPool, poolData, poolsData)

  const tradeBalances = useMemo(() => {
    const balances = activeAccountTradeBalancesData?.activeAccount?.balances

    const outBalance = find(balances, {
      assetId: assetIds.assetOut
    }) as Balance | undefined

    const inBalance = find(balances, {
      assetId: assetIds.assetIn
    }) as Balance | undefined

    return { outBalance, inBalance }
  }, [activeAccountTradeBalancesData, assetIds])

  useEffect(() => {
    if (
      (assetIds.assetIn && assetIds.assetOut,
      pool?.assetInId,
      pool?.assetAWeights)
    ) {
      Promise.all([
        getBestSpotPrice(assetIds.assetOut, assetIds.assetIn),
        getBestSpotPrice(assetIds.assetIn, assetIds.assetOut),
        getBestSpotPrice(assetIds.assetIn, valueDisplayAsset),
        getBestSpotPrice(assetIds.assetOut, valueDisplayAsset),
        getBestSpotPrice(pool?.assetOutId, valueDisplayAsset)
      ]).then(
        ([
          outIn,
          inOut,
          assetInValue,
          assetOutValue,
          accumulatedAssetValue
        ]) => {
          if (outIn && inOut) {
            setSpotPrice({
              outIn: accumulating
                ? outIn.amount.toNumber()
                : inOut.amount.toNumber(),
              inOut: accumulating
                ? inOut.amount.toNumber()
                : outIn.amount.toNumber()
            })
          }
          if (assetInValue && assetOutValue && accumulatedAssetValue) {
            const weightRatio =
              (pool.assetAWeights.current ||
                pool.assetAWeights.final - pool.assetAWeights.initial) /
              pool.assetAWeights.initial

            console.log(weightRatio, 'weightRatio')
            setUsdPrice({
              assetIn: assetInValue.amount.toNumber(),
              assetInAsString: assetInValue.amount
                .dividedBy(10 ** assetInValue.decimals)
                .toFixed(3),
              assetOut: assetOutValue.amount.toNumber(),
              assetOutAsString: assetOutValue.amount
                .dividedBy(10 ** assetOutValue.decimals)
                .toFixed(3),
              accumulated: accumulatedAssetValue.amount.toNumber(),
              accumulatedAsString: accumulatedAssetValue.amount
                .dividedBy(10 ** accumulatedAssetValue.decimals)
                .toFixed(3),
              accumulatedAtEnd: 0,
              accumulatedAtEndAsString: '-'
            })
          }
        }
      )
    }
  }, [accumulating, getBestSpotPrice, repayTargetReached, pool])

  return (
    <div className="trade-page-wrapper lbp-page-wrapper">
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

      <div className="trade-page-toggles">
        <div
          className={
            'trade-page-toggles__toggle' + (!chartVisible ? ' active' : '')
          }
          onClick={() => setChartVisible(false)}
        >
          <Icon name="SwapIcon"></Icon> Swap Tokens
        </div>
        <div
          className={
            'trade-page-toggles__toggle' + (chartVisible ? ' active' : '')
          }
          onClick={() => setChartVisible(true)}
        >
          <Icon name="ChartIcon"></Icon> Chart view
        </div>
      </div>

      <div className="trade-page">
        <div className="trade-page__content">
          <EnhancedTradeChart
            visible={chartVisible}
            pool={pool}
            assetIds={assetIds}
            spotPrice={{
              outIn: !accumulating
                ? spotPrice.inOut?.toString()
                : spotPrice.outIn?.toString(),
              inOut: accumulating
                ? spotPrice.inOut?.toString()
                : spotPrice.outIn?.toString()
            }}
            isPoolLoading={
              poolNetworkStatus === NetworkStatus.loading ||
              poolNetworkStatus === NetworkStatus.setVariables ||
              depsLoading
            }
          />
          <TradeForm
            visible={!chartVisible}
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
            assetMap={poolAssetMap}
            assetInLiquidity={assetInLiquidity}
            assetOutLiquidity={assetOutLiquidity}
            assetInWeight={assetInWeight?.current}
            assetOutWeight={assetOutWeight?.current}
            repayTargetReached={repayTargetReached}
            onSubmitTrade={handleSubmitTrade}
            tradeLoading={tradeLoading}
            assets={assets}
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
        <div className="lbp-info-wrapper">
          <div className="lbp-info-wrapper__lbp-info-item">
            <div className="lbp-info-wrapper__lbp-info-item__group">
              <div className="label">Last Price</div>
              <div className="value">$ {usdPrice.accumulatedAsString}</div>
            </div>
          </div>
          {/* <div className="lbp-info-wrapper__lbp-info-item">
            Ending Price {usdPrice.accumulatedAtEndAsString} $
          </div> */}
          <div className="lbp-info-wrapper__lbp-info-item">
            <div className="lbp-info-wrapper__lbp-info-item__group">
              <div className="label">Initial Weight</div>
              <div className="value">
                {pool ? (pool.assetAWeights.initial / 1000000).toFixed(2) : 0} %
              </div>
            </div>
          </div>
          <div className="lbp-info-wrapper__lbp-info-item">
            <div className="lbp-info-wrapper__lbp-info-item__group">
              <div className="label">Current Weight </div>
              <div className="value">
                {pool ? (pool.assetAWeights.current / 1000000).toFixed(2) : 0} %
              </div>
            </div>
          </div>
          <div className="lbp-info-wrapper__lbp-info-item">
            <div className="lbp-info-wrapper__lbp-info-item__group">
              <div className="label">Final Weight </div>
              <div className="value">
                {pool ? (pool.assetAWeights.final / 1000000).toFixed(2) : 0} %
              </div>
            </div>
          </div>
        </div>

        <div className="debug">
          <h3>[Trade Page] Debug Box</h3>
          <p>Trade loading: {tradeLoading ? 'true' : 'false'}</p>
          {/* <p>Trade error: {tradeError ? tradeError : '-'}</p> */}
        </div>
      </div>
    </div>
  )
}
