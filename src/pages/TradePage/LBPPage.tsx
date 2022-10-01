import { NetworkStatus, ApolloClient, useQuery } from '@apollo/client'
import { find, uniq, last, orderBy } from 'lodash'
import moment from 'moment'
import { usePageVisibility } from 'react-page-visibility'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { TradeForm } from '../../components/Trade/TradeForm/LBPTradeForm'
import { Balance, LbpPool } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import { useGetHistoricalBalancesQuery } from '../../hooks/balances/queries/useGetHistoricalBalancesQuery'
import { useMath } from '../../hooks/math/useMath'
import { useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation'
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery'
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl'
import { fromPrecision12 } from '../../hooks/math/useFromPrecision'
import { TradeChart as LBPTradeChartComponent } from '../../components/Chart/TradeChart/TradeChart'
import './TradePage.scss'
import {
  ChartGranularity,
  ChartType,
  PoolType
} from '../../components/Chart/shared'
import BigNumber from 'bignumber.js'
import { useLoading } from '../../hooks/misc/useLoading'
import { useGetPoolsQueryProvider } from '../../hooks/pools/queries/useGetPoolsQuery'
import { idToAsset } from '../../misc/idToAsset'
import { readLastBlock } from '../../hooks/lastBlock/readLastBlock'

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'
// import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';

import Icon from '../../components/Icon/Icon'
import { calculateSpotPrice } from '../../hooks/pools/lbp/calculateSpotPrice'
import { useLastBlockContext } from '../../hooks/lastBlock/useSubscribeNewBlockNumber'
import { blockToTime, timeToBlock } from '../../misc/utils/blockTime'
import { calculateSpotPriceFromPool } from '../../hooks/pools/lbp/calculateSpotPrice'
import { calculateCurrentAssetWeight } from '../../hooks/pools/lbp/calculateCurrentAssetWeight'

export interface TradeAssetIds {
  assetIn: string | null
  assetOut: string | null
}

export interface TradeChartProps {
  pool?: LbpPool
  isPoolLoading?: boolean
  assetIds: TradeAssetIds
  spotPrice?: {
    outIn?: string
    inOut?: string
  }
}

export enum LbpStatus {
  NOT_INITIALIZED,
  NOT_STARTED,
  IN_PROGRESS,
  ENDED
}

export const TradeChart = ({
  pool,
  assetIds,
  spotPrice,
  isPoolLoading
}: TradeChartProps) => {
  const isVisible = usePageVisibility()
  const lastBlockData = useLastBlockContext()
  const endBlock = pool?.endBlock || 0
  const startBlock = pool?.startBlock || 0
  const currentBlock = lastBlockData?.relaychainBlockNumber || 0
  const currentBlockTime = lastBlockData?.createdAt || new Date().getTime()
  let lbpStatus: LbpStatus = LbpStatus.NOT_INITIALIZED

  if (!startBlock || !endBlock) lbpStatus = LbpStatus.NOT_INITIALIZED
  if (startBlock < currentBlock && endBlock > currentBlock)
    lbpStatus = LbpStatus.IN_PROGRESS
  if (startBlock > currentBlock) lbpStatus = LbpStatus.NOT_STARTED
  if (endBlock < currentBlock) lbpStatus = LbpStatus.ENDED

  const endOrNow = endBlock < currentBlock ? endBlock : currentBlock

  console.log('fetching lbp chart data', startBlock, endOrNow)

  const { math } = useMath()
  const {
    data: historicalBalancesData,
    networkStatus: historicalBalancesNetworkStatus
  } = useGetHistoricalBalancesQuery(
    {
      from: startBlock,
      to: endOrNow,
      quantity: 10000,
      poolId: pool?.id || ''
    },
    {
      skip: !pool?.id
    }
  )

  const historicalBalancesLoading = useMemo(
    () =>
      historicalBalancesNetworkStatus === NetworkStatus.loading ||
      historicalBalancesNetworkStatus === NetworkStatus.setVariables,
    [historicalBalancesNetworkStatus]
  )

  const [dataset, setDataset] = useState<Array<any>>()
  const [datasetLoading, setDatasetLoading] = useState(true)
  const [datasetRefreshing, setDatasetRefreshing] = useState(false)

  useEffect(() => {
    setDatasetLoading(true)

    if (historicalBalancesLoading) return

    console.log('LOADED:', historicalBalancesData?.historicalBalances?.length)
    const filteredDataset = historicalBalancesData?.historicalBalances?.filter(
      (_b, i) => {
        if (i % 200 === 0) return true
        return false
      }
    )

    console.log('filtered', filteredDataset)

    console.log(
      'DEBUG:currentBlock-currentBlockTime-startBlock-endOrNow-endBlock-calcBlock',
      currentBlock,
      currentBlockTime,
      startBlock,
      endOrNow,
      endBlock,
      blockToTime(startBlock, {
        height: currentBlock,
        date: currentBlockTime
      })
    )

    if (
      (!historicalBalancesLoading &&
        !historicalBalancesData?.historicalBalances?.length) ||
      !math ||
      !spotPrice ||
      !pool
    ) {
      setDataset([])
      setDatasetLoading(false)
      return
    }
    const dataset =
      filteredDataset?.map(
        ({ relayChainBlockHeight, assetABalance, assetBBalance }) => {
          return {
            x: blockToTime(relayChainBlockHeight, {
              height: currentBlock,
              date: currentBlockTime
            }),
            ...(() => {
              const currentAssetAWeight = calculateCurrentAssetWeight(
                math,
                { startBlock, endBlock },
                pool.assetAWeights,
                relayChainBlockHeight.toString()
              )
              const currentAssetBWeight = calculateCurrentAssetWeight(
                math,
                { startBlock, endBlock },
                pool.assetBWeights,
                relayChainBlockHeight.toString()
              )
              const spotPrice = {
                outIn: '0',
                inOut: calculateSpotPrice(
                  math,
                  assetBBalance,
                  assetABalance,
                  currentAssetBWeight.toString(),
                  currentAssetAWeight.toString()
                )
              }

              const y = new BigNumber(fromPrecision12(spotPrice.inOut || '0'))

              console.log(
                'spotPrice',
                assetABalance,
                assetBBalance,
                y.toNumber()
              )

              return {
                y: y.toNumber(),
                yAsString: fromPrecision12(spotPrice.inOut || '0')
              }
            })()
          }
        }
      ) || []

    const sortedDataset = orderBy(dataset, ['x'], ['asc'])

    console.log('finalDataset', sortedDataset)

    setDataset(sortedDataset)
    setDatasetRefreshing(false)
    setDatasetLoading(false)
  }, [
    pool,
    currentBlock,
    currentBlockTime,
    endOrNow,
    endBlock,
    startBlock,
    historicalBalancesData,
    lastBlockData
  ])

  useEffect(() => {
    const lastRecordOutdatedBy = 60000

    if (!isVisible || historicalBalancesLoading || datasetRefreshing) return

    const refetchHistoricalBalancesData = () => {
      if (
        isVisible &&
        !historicalBalancesLoading &&
        !datasetRefreshing &&
        (!dataset?.length ||
          last(dataset).x <= new Date().getTime() - lastRecordOutdatedBy)
      ) {
        setDatasetRefreshing(true)
      }
    }

    refetchHistoricalBalancesData()

    const refetchData = setInterval(() => {
      refetchHistoricalBalancesData()
    }, lastRecordOutdatedBy)

    return () => clearInterval(refetchData)
  }, [
    dataset,
    isVisible,
    startBlock,
    endOrNow,
    historicalBalancesLoading,
    datasetRefreshing,
    lastBlockData
  ])

  useEffect(() => {
    setDataset((dataset) => {
      if (!spotPrice || !dataset || !currentBlock || !currentBlockTime)
        return dataset

      if (lbpStatus === LbpStatus.NOT_INITIALIZED) return []

      // TODO: Secondary
      if (lbpStatus === LbpStatus.NOT_STARTED) return []

      // TODO: Ended
      if (lbpStatus === LbpStatus.ENDED) return dataset

      return [
        ...dataset,
        {
          x: blockToTime(endOrNow, {
            height: currentBlock,
            date: currentBlockTime
          }),
          y: new BigNumber(fromPrecision12(spotPrice.outIn || '0')).toNumber()
        }
      ]
    })
  }, [pool, currentBlock, currentBlockTime, endOrNow, lbpStatus])

  const _isPoolLoading = useMemo(() => {
    if (!isPoolLoading || datasetRefreshing) return false

    return isPoolLoading || historicalBalancesLoading || datasetLoading
  }, [
    datasetRefreshing,
    datasetLoading,
    isPoolLoading,
    historicalBalancesLoading
  ])

  return (
    <LBPTradeChartComponent
      assetPair={{
        assetA: idToAsset(assetIds.assetIn),
        assetB: idToAsset(assetIds.assetOut)
      }}
      isPoolLoading={_isPoolLoading}
      poolType={PoolType.LBP}
      granularity={ChartGranularity.H24}
      chartType={ChartType.PRICE}
      primaryDataset={dataset as any}
      secondaryDataset={[]}
      onChartTypeChange={() => {}}
      onGranularityChange={() => {}}
    />
  )
}

export const LBPPage = () => {
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

  const lastBlockData = useLastBlockContext()

  console.log('last block data', lastBlockData)

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
    data: poolsData,
    networkStatus: poolsNetworkStatus
  } = useGetPoolsQueryProvider()

  const assets = useMemo(() => {
    let assets = poolsData?.pools
      ?.map((pool) => {
        if (pool.__typename === 'LBPPool') {
          return [pool.assetInId, pool.assetOutId]
        } else return []
      })
      .reduce((assets, poolAssets) => {
        return assets.concat(poolAssets)
      }, [])
      .map((id) => id)

    return uniq(assets).map((id) => ({ id }))
  }, [poolsData])

  const lbpPool =
    poolData?.pool && poolData.pool.__typename === 'LBPPool'
      ? poolData.pool
      : undefined

  if (!assetIds.assetIn || !assetIds.assetOut) {
    const newPool = poolsData?.pools?.[0]
    console.log('NEW POOL', newPool)
    if (newPool) {
      assetIds.assetIn = newPool.assetInId
      assetIds.assetOut = newPool.assetOutId
    }
  }

  const pool = useMemo(() => lbpPool, [lbpPool])

  const isActiveAccountConnected = useMemo(() => {
    return !!activeAccountData?.activeAccount
  }, [activeAccountData])

  const clearNotificationIntervalRef = useRef<any>()

  const [
    submitTrade,
    { loading: tradeLoading, error: tradeError }
  ] = useSubmitTradeMutation({
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

  const handleSubmitTrade = useCallback(
    (variables) => {
      clearNotificationIntervalRef.current &&
        clearTimeout(clearNotificationIntervalRef.current)
      clearNotificationIntervalRef.current = null
      submitTrade({ variables })
    },
    [submitTrade]
  )

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

  return (
    <div className="trade-page-wrapper">
      {/* {confirmationScreen} */}
      <div className={'notifications-bar transaction-' + notification}>
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
      <div className="trade-page">
        <TradeChart
          pool={pool}
          assetIds={assetIds}
          spotPrice={{
            outIn:
              assetOutLiquidity &&
              assetInLiquidity &&
              math?.xyk.get_spot_price(
                assetInLiquidity,
                assetOutLiquidity,
                '1000000000000'
              ),
            inOut:
              assetOutLiquidity &&
              assetInLiquidity &&
              math?.xyk.get_spot_price(
                assetOutLiquidity,
                assetInLiquidity,
                '1000000000000'
              )
          }}
          isPoolLoading={
            poolNetworkStatus === NetworkStatus.loading ||
            poolNetworkStatus === NetworkStatus.setVariables ||
            depsLoading
          }
        />
        <TradeForm
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
          assetInWeight={assetInWeight?.current}
          assetOutWeight={assetOutWeight?.current}
          repayTargetHit={false}
          onSubmitTrade={handleSubmitTrade}
          tradeLoading={tradeLoading}
          assets={assets}
          activeAccount={activeAccountData?.activeAccount}
          activeAccountTradeBalances={tradeBalances}
          activeAccountTradeBalancesLoading={
            activeAccountTradeBalancesNetworkStatus === NetworkStatus.loading ||
            activeAccountTradeBalancesNetworkStatus ===
              NetworkStatus.setVariables ||
            depsLoading
          }
        />
        <div className="debug">
          <h3>[Trade Page] Debug Box</h3>
          <p>Trade loading: {tradeLoading ? 'true' : 'false'}</p>
          {/* <p>Trade error: {tradeError ? tradeError : '-'}</p> */}
        </div>
      </div>
    </div>
  )
}
