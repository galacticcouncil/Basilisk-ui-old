import { NetworkStatus } from '@apollo/client'
import { find } from 'lodash'
import moment from 'moment'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { TradeForm } from '../../components/Trade/TradeForm/LBPTradeForm'
import { Balance, LbpPool } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import {
  GetHistoricalBalancesQueryResponse,
  HistoricalBalance,
  useGetFirstHistoricalBlockQuery,
  useGetLastHistoricalBlockQuery,
  useGetHistoricalBalancesExactQuery
} from '../../hooks/balances/queries/useGetHistoricalBalancesQuery'
import { useMath } from '../../hooks/math/useMath'
import { useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation'
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery'
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl'
import { fromPrecision12 } from '../../hooks/math/useFromPrecision'
import {
  LbpChartProps,
  TradeChart as LBPTradeChartComponent
} from '../../components/Chart/TradeChart/TradeChart'
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

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'
// import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';

import Icon from '../../components/Icon/Icon'
import { calculateSpotPrice } from '../../hooks/pools/lbp/calculateSpotPrice'
import { useLastBlockContext } from '../../hooks/lastBlock/useSubscribeNewBlockNumber'
import { blockToTime } from '../../misc/utils/blockTime'
import { DataPoint, Dataset } from '../../components/Chart/LineChart/LineChart'
import { getAssetMapsFromPools } from '../../misc/utils/getAssetMap'
import {
  keepRecords,
  getMissingBlocks,
  getPriceForBlocks,
  getMissingIndexes
} from './helpers'

export interface TradeAssetIds {
  assetIn: string | null
  assetOut: string | null
}

export interface EnhancedTradeChartProps {
  pool?: LbpPool
  isPoolLoading?: boolean
  assetIds: TradeAssetIds
  spotPrice?: {
    outIn?: string
    inOut?: string
  }
}

export enum LbpStatus {
  NOT_EXISTS,
  NOT_INITIALIZED,
  NOT_STARTED,
  IN_PROGRESS,
  ENDED
}

export const REFETCH_INTERVAL = 180000
export const ERROR_REFETCH_INTERVAL = 3000

export const EnhancedTradeChart = ({
  pool,
  assetIds,
  spotPrice,
  isPoolLoading
}: EnhancedTradeChartProps) => {
  const { math } = useMath()
  // const isVisible = usePageVisibility()
  const lastBlockData = useLastBlockContext()

  const startBlock = pool?.startBlock || 0
  const endBlock = pool?.endBlock || 0

  const currentRelayBlock = lastBlockData?.relaychainBlockNumber || 0
  const currentParaBlock = lastBlockData?.parachainBlockNumber || 0
  const currentBlockTime = lastBlockData?.createdAt || new Date().getTime()

  const lbpChartProps: LbpChartProps = {
    startBlock,
    endBlock
  }

  let lbpStatus: LbpStatus = LbpStatus.NOT_INITIALIZED

  if (!pool?.id) {
    lbpStatus = LbpStatus.NOT_EXISTS
  } else if (
    !pool?.startBlock ||
    !pool?.endBlock ||
    !lastBlockData?.relaychainBlockNumber
  ) {
    lbpStatus = LbpStatus.NOT_INITIALIZED
  } else {
    if (startBlock < currentRelayBlock && endBlock > currentRelayBlock) {
      lbpStatus = LbpStatus.IN_PROGRESS
      lbpChartProps.timeToNextPhase = moment
        .duration(
          moment(currentBlockTime).diff(
            blockToTime(endBlock, {
              height: currentRelayBlock,
              date: currentBlockTime
            })
          )
        )
        .humanize()
    }
    if (startBlock > currentRelayBlock) {
      lbpStatus = LbpStatus.NOT_STARTED
      lbpChartProps.timeToNextPhase = moment
        .duration(
          moment(currentBlockTime).diff(
            blockToTime(startBlock, {
              height: currentRelayBlock,
              date: currentBlockTime
            })
          )
        )
        .humanize()
    }

    if (endBlock < currentRelayBlock) lbpStatus = LbpStatus.ENDED
  }

  const [lastHistoricalDataRefetch, setLastHistoricalDataRefetch] = useState(0)

  const endOrNow = endBlock < currentRelayBlock ? endBlock : currentRelayBlock

  const [
    getFirstHistoricalBlockQuery
    // firstHistoricalBlockQueryNetworkStatus
  ] = useGetFirstHistoricalBlockQuery(
    {
      blockHeight: startBlock,
      poolId: pool?.id || ''
    },
    { skip: !pool?.id || !pool?.startBlock }
  )

  const [
    getLastHistoricalBlockQuery
    // firstHistoricalBlockQueryNetworkStatus
  ] = useGetLastHistoricalBlockQuery(
    {
      blockHeight: endBlock,
      poolId: pool?.id || ''
    },
    { skip: !pool?.id || !pool?.endBlock }
  )

  const [
    getHistoricalBalancesQuery,
    historicalBalanceQueryNetworkStatus
  ] = useGetHistoricalBalancesExactQuery(
    {
      recordIds: []
    },
    {
      skip: !pool?.id || !pool?.startBlock
    }
  )

  // const [firstHistoricalBlock, setFirstHistoricalBlock] = useState<
  //   FirstHistoricalBlock
  // >()

  const [historicalBalancesData, setHistoricalBalanceData] = useState<
    GetHistoricalBalancesQueryResponse
  >()

  const [historicalBalancesLoading, setHistoricalBalancesLoading] = useState(
    historicalBalanceQueryNetworkStatus.loading
  )

  const [{ primaryDataset, secondaryDataset }, setDataset] = useState<{
    primaryDataset: Dataset
    secondaryDataset: Dataset
    lastRelayBlock: HistoricalBalance
  }>({
    primaryDataset: [],
    secondaryDataset: [],
    lastRelayBlock: {
      assetABalance: '0',
      assetBBalance: '0',
      relayChainBlockHeight: 0
    }
  })

  //
  // Get historical balances:
  // this is mainly used first time to get the initial data
  //

  const refetchHistoricalBalancesData = useCallback(() => {
    if (historicalBalancesLoading || !pool?.id) return
    if (Date.now() - lastHistoricalDataRefetch < REFETCH_INTERVAL) return
    if (
      lbpStatus === LbpStatus.NOT_INITIALIZED ||
      lbpStatus === LbpStatus.NOT_EXISTS
    )
      return

    setLastHistoricalDataRefetch(Date.now())
    setHistoricalBalancesLoading(true)

    Promise.all([
      getFirstHistoricalBlockQuery({
        variables: { poolId: pool.id, blockHeight: startBlock }
      }),
      getLastHistoricalBlockQuery({
        variables: { poolId: pool.id, blockHeight: endBlock }
      })
    ])
      .then(([{ data: firstBlockData }, { data: lastBlockData }]) => {
        // Relay blocks are not reliable we need to poll by parablocks ()
        console.log('got first and last historical blocks', firstBlockData)

        if (
          !firstBlockData?.firstHistoricalParachainBlock ||
          !lastBlockData?.lastHistoricalParachainBlock
        ) {
          setLastHistoricalDataRefetch(Date.now())
          setHistoricalBalancesLoading(false)
          return
        }

        const parachainBlockStart =
          firstBlockData.firstHistoricalParachainBlock[0].paraChainBlockHeight

        const parachainBlockEnd =
          lastBlockData.lastHistoricalParachainBlock[0].paraChainBlockHeight

        const indexes = getMissingIndexes(
          parachainBlockStart,
          parachainBlockEnd,
          pool.id
        )

        getHistoricalBalancesQuery({
          variables: {
            recordIds: indexes
          }
        })
          .then((balancesResult) => {
            console.log('setting historical data', balancesResult.data)
            setHistoricalBalanceData(balancesResult.data)
            setLastHistoricalDataRefetch(Date.now())
          })
          .catch((e) => {
            console.log('err historical blocks')
            console.error(e)
            setLastHistoricalDataRefetch(
              Date.now() + REFETCH_INTERVAL - ERROR_REFETCH_INTERVAL
            )
          })
          .finally(() => {
            setHistoricalBalancesLoading(false)
          })
      })
      .catch((e) => {
        console.log('err first block')
        console.error(e)
        setLastHistoricalDataRefetch(
          Date.now() + REFETCH_INTERVAL - ERROR_REFETCH_INTERVAL
        )
      })
      .finally(() => {
        setHistoricalBalancesLoading(false)
      })

    return
  }, [
    historicalBalancesLoading,
    pool?.id,
    lastHistoricalDataRefetch,
    getFirstHistoricalBlockQuery,
    startBlock,
    currentParaBlock,
    getHistoricalBalancesQuery
  ])

  //
  //  Set new historical data and update secondary dataset
  //
  useEffect(() => {
    if (!historicalBalancesData) return

    const historicalBalanceData =
      historicalBalancesData?.historicalBalances || []

    const lastRelayBlock = (historicalBalanceData.length &&
      historicalBalanceData[historicalBalanceData.length - 1]) || {
      assetABalance: '0',
      assetBBalance: '0',
      relayChainBlockHeight: 0
    }

    if (
      !pool ||
      !pool.balances ||
      !historicalBalancesData?.historicalBalances?.length ||
      !math ||
      !spotPrice
    ) {
      setDataset({
        primaryDataset: [],
        secondaryDataset: [],
        lastRelayBlock: {
          assetABalance: '0',
          assetBBalance: '0',
          relayChainBlockHeight: 0
        }
      })
      return
    }

    const newPrimaryDataset =
      historicalBalanceData?.map(
        ({ assetABalance, assetBBalance, relayChainBlockHeight }) => {
          return getPriceForBlocks(
            math,
            pool,
            relayChainBlockHeight,
            assetABalance,
            assetBBalance,
            currentRelayBlock,
            currentBlockTime
          )
        }
      ) || []

    if (lbpStatus === LbpStatus.ENDED) {
      setDataset({
        primaryDataset: newPrimaryDataset,
        secondaryDataset: [],
        lastRelayBlock
      })
      return
    }

    const newLastRelayBlock = {
      assetABalance: pool.balances[0].balance,
      assetBBalance: pool.balances[1].balance,
      relayChainBlockHeight: endOrNow
    }

    const missingBlocks = getMissingBlocks(
      newLastRelayBlock.relayChainBlockHeight,
      endBlock,
      newLastRelayBlock.assetABalance,
      newLastRelayBlock.assetBBalance
    )

    const accumulating = assetIds.assetIn === pool?.assetInId

    const newSecondaryDataset = missingBlocks.map(
      ({ assetABalance, assetBBalance, relayChainBlockHeight }) => {
        return getPriceForBlocks(
          math,
          pool,
          relayChainBlockHeight,
          accumulating ? assetABalance : assetBBalance,
          accumulating ? assetBBalance : assetABalance,
          currentRelayBlock,
          currentBlockTime
        )
      }
    )

    const newDataPoint = {
      x: blockToTime(endOrNow, {
        height: currentRelayBlock,
        date: currentBlockTime
      }),
      y: new BigNumber(
        fromPrecision12(
          (accumulating ? spotPrice.inOut : spotPrice.outIn) || '0'
        )
      ).toNumber(),
      yAsString: fromPrecision12(
        (accumulating ? spotPrice.inOut : spotPrice.outIn) || '0'
      )
    }

    newPrimaryDataset.push(newDataPoint)

    setDataset({
      primaryDataset: newPrimaryDataset,
      secondaryDataset: newSecondaryDataset,
      lastRelayBlock
    })
  }, [
    historicalBalancesData,
    historicalBalancesLoading,
    pool?.assetInId,
    assetIds,
    lbpStatus
  ])

  //
  // Refetch last data point and update secondary dataset
  //
  useEffect(() => {
    if (
      !spotPrice ||
      !primaryDataset ||
      !currentRelayBlock ||
      !currentBlockTime ||
      !math ||
      !pool ||
      !pool.balances ||
      historicalBalancesLoading
    )
      return

    if (
      lbpStatus === LbpStatus.NOT_INITIALIZED ||
      lbpStatus === LbpStatus.NOT_EXISTS
    )
      return

    const lastRelayBlock = {
      assetABalance: pool.balances[0].balance,
      assetBBalance: pool.balances[1].balance,
      relayChainBlockHeight: endOrNow
    }

    if (lbpStatus === LbpStatus.NOT_STARTED) {
      setDataset({ primaryDataset: [], secondaryDataset, lastRelayBlock })
      return
    }

    if (lbpStatus === LbpStatus.ENDED) {
      setDataset({ primaryDataset, secondaryDataset: [], lastRelayBlock })
      return
    }

    const accumulating = assetIds.assetIn === pool?.assetInId

    const newDataPoint: DataPoint = {
      x: blockToTime(endOrNow, {
        height: currentRelayBlock,
        date: currentBlockTime
      }),
      y: new BigNumber(
        fromPrecision12(
          (accumulating ? spotPrice.inOut : spotPrice.outIn) || '0'
        )
      ).toNumber(),
      yAsString: fromPrecision12(
        (accumulating ? spotPrice.inOut : spotPrice.outIn) || '0'
      )
    }

    if (newDataPoint.x === primaryDataset[primaryDataset.length - 1].x) return

    const missingBlocks = getMissingBlocks(
      lastRelayBlock.relayChainBlockHeight,
      endBlock,
      lastRelayBlock.assetABalance,
      lastRelayBlock.assetBBalance
    )

    const newSecondaryDataset = missingBlocks.map(
      ({ assetABalance, assetBBalance, relayChainBlockHeight }) => {
        return getPriceForBlocks(
          math,
          pool,
          relayChainBlockHeight + 1,
          accumulating ? assetABalance : assetBBalance,
          accumulating ? assetBBalance : assetABalance,
          currentRelayBlock,
          currentBlockTime
        )
      }
    )

    primaryDataset.push(newDataPoint)

    setDataset({
      primaryDataset: primaryDataset,
      secondaryDataset: newSecondaryDataset,
      lastRelayBlock: lastRelayBlock
    })
  }, [currentParaBlock, lbpStatus, assetIds])

  useEffect(() => {
    setLastHistoricalDataRefetch(0)
    setHistoricalBalancesLoading(false)
  }, [pool?.id, pool?.assetInId, pool?.assetOutId])

  refetchHistoricalBalancesData()

  return (
    <LBPTradeChartComponent
      assetPair={{
        assetA: idToAsset(assetIds.assetIn),
        assetB: idToAsset(assetIds.assetOut)
      }}
      lbpStatus={lbpStatus}
      lbpChartProps={lbpChartProps}
      isPoolLoading={isPoolLoading}
      poolType={PoolType.LBP}
      granularity={ChartGranularity.H24}
      chartType={ChartType.PRICE}
      primaryDataset={primaryDataset}
      secondaryDataset={secondaryDataset}
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
        <EnhancedTradeChart
          pool={pool}
          assetIds={assetIds}
          spotPrice={{
            outIn:
              assetOutLiquidity &&
              assetInLiquidity &&
              math &&
              assetOutWeight &&
              assetInWeight &&
              calculateSpotPrice(
                math,
                assetInLiquidity,
                assetOutLiquidity,
                assetInWeight.current.toString(),
                assetOutWeight.current.toString(),
                '1000000000000'
              ),
            inOut:
              assetOutLiquidity &&
              assetInLiquidity &&
              math &&
              assetOutWeight &&
              assetInWeight &&
              calculateSpotPrice(
                math,
                assetOutLiquidity,
                assetInLiquidity,
                assetOutWeight?.current.toString(),
                assetInWeight?.current.toString(),
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
