import { NetworkStatus, ApolloClient, useQuery } from '@apollo/client'
import { find, uniq, last, orderBy } from 'lodash'
import moment from 'moment'
import { usePageVisibility } from 'react-page-visibility'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { TradeForm } from '../../components/Trade/TradeForm/LBPTradeForm'
import { Balance, LbpAssetWeights, LbpPool } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import {
  HistoricalBalance,
  useGetHistoricalBalancesQuery
} from '../../hooks/balances/queries/useGetHistoricalBalancesQuery'
import { HydraDxMath, useMath } from '../../hooks/math/useMath'
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
import { readLastBlock } from '../../hooks/lastBlock/readLastBlock'

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'
// import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';

import Icon from '../../components/Icon/Icon'
import { calculateSpotPrice } from '../../hooks/pools/lbp/calculateSpotPrice'
import { useLastBlockContext } from '../../hooks/lastBlock/useSubscribeNewBlockNumber'
import { blockToTime, timeToBlock } from '../../misc/utils/blockTime'
import { calculateSpotPriceFromPool } from '../../hooks/pools/lbp/calculateSpotPrice'
import { calculateCurrentAssetWeight } from '../../hooks/pools/lbp/calculateCurrentAssetWeight'
import { DataPoint, Dataset } from '../../components/Chart/LineChart/LineChart'

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
  NOT_INITIALIZED,
  NOT_STARTED,
  IN_PROGRESS,
  ENDED
}

export const EnhancedTradeChartProps = ({
  pool,
  assetIds,
  spotPrice,
  isPoolLoading
}: EnhancedTradeChartProps) => {
  const isVisible = usePageVisibility()
  const lastBlockData = useLastBlockContext()
  const endBlock = pool?.endBlock || 0
  const startBlock = pool?.startBlock || 0
  const currentBlock = lastBlockData?.relaychainBlockNumber || 0
  const currentBlockTime = lastBlockData?.createdAt || new Date().getTime()
  const lbpChartProps: LbpChartProps = {
    startBlock,
    endBlock
  }

  const keepRecords = 200

  const { math } = useMath()

  const getMissingBlocks = (
    startBlock: number,
    endBlock: number,
    assetABalance: string,
    assetBBalance: string
  ): HistoricalBalance[] => {
    const missingBlocksAmount = endBlock - startBlock
    const missingBlocks: HistoricalBalance[] = []
    const divisionMultiplier = Math.floor(missingBlocksAmount / keepRecords)
    for (let i = startBlock; i <= endBlock; i++) {
      if (i % divisionMultiplier === 0) {
        missingBlocks.push({
          assetABalance,
          assetBBalance,
          relayChainBlockHeight: i
        })
      }
    }
    console.log(
      'Calculating missing blocks from',
      startBlock,
      'to',
      endBlock,
      'amount',
      missingBlocksAmount,
      missingBlocks
    )
    return missingBlocks
  }

  const getPriceForBlocks = (
    math: HydraDxMath,
    pool: LbpPool,
    relayChainBlockHeight: number,
    assetABalance: string,
    assetBBalance: string
  ) => {
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

        return {
          y: y.toNumber(),
          yAsString: fromPrecision12(spotPrice.inOut || '0')
        }
      })()
    }
  }

  let lbpStatus: LbpStatus = LbpStatus.NOT_INITIALIZED

  if (
    !pool?.startBlock ||
    !pool?.endBlock ||
    !lastBlockData?.relaychainBlockNumber
  ) {
    lbpStatus = LbpStatus.NOT_INITIALIZED
  } else {
    if (startBlock < currentBlock && endBlock > currentBlock) {
      lbpStatus = LbpStatus.IN_PROGRESS
      lbpChartProps.timeToNextPhase = moment
        .duration(
          moment(currentBlockTime).diff(
            blockToTime(endBlock, {
              height: currentBlock,
              date: currentBlockTime
            })
          )
        )
        .humanize()
    }
    if (startBlock > currentBlock) {
      lbpStatus = LbpStatus.NOT_STARTED
      lbpChartProps.timeToNextPhase = moment
        .duration(
          moment(currentBlockTime).diff(
            blockToTime(startBlock, {
              height: currentBlock,
              date: currentBlockTime
            })
          )
        )
        .humanize()
    }

    if (endBlock < currentBlock) lbpStatus = LbpStatus.ENDED
  }

  console.log(
    'LBP STATUS',
    lbpStatus,
    LbpStatus.ENDED,
    LbpStatus.IN_PROGRESS,
    LbpStatus.NOT_STARTED,
    LbpStatus.NOT_INITIALIZED
  )

  const endOrNow = endBlock < currentBlock ? endBlock : currentBlock

  console.log('fetching lbp chart data', startBlock, endOrNow)

  const {
    data: historicalBalancesData,
    networkStatus: historicalBalancesNetworkStatus
  } = useGetHistoricalBalancesQuery(
    {
      from: startBlock,
      to: endOrNow,
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

  const [{ primaryDataset, secondaryDataset }, setDataset] = useState<{
    primaryDataset: Dataset
    secondaryDataset: Dataset
  }>({ primaryDataset: [], secondaryDataset: [] })
  const [datasetLoading, setDatasetLoading] = useState(true)
  const [datasetRefreshing, setDatasetRefreshing] = useState(false)

  useEffect(() => {
    setDatasetLoading(true)

    if (historicalBalancesLoading) return

    const historicalBalanceData =
      historicalBalancesData?.historicalBalances || []

    const divisionMultiplier =
      historicalBalanceData.length < keepRecords
        ? 1
        : Math.ceil(historicalBalanceData.length / keepRecords)

    const filteredDataset = historicalBalanceData.filter((_b, i) => {
      if (i % divisionMultiplier === 0) return true
      return false
    })

    const lastRelayBlock = (filteredDataset.length &&
      filteredDataset[filteredDataset.length - 1]) || {
      assetABalance: '0',
      assetBBalance: '0',
      relayChainBlockHeight: 0
    }

    console.log(
      'historicalBalancesLength:',
      historicalBalanceData.length,
      filteredDataset.length
    )

    if (
      (!historicalBalancesLoading &&
        !historicalBalancesData?.historicalBalances?.length) ||
      !math ||
      !spotPrice ||
      !pool
    ) {
      setDataset({ primaryDataset: [], secondaryDataset: [] })
      setDatasetLoading(false)
      return
    }

    const missingBlocks = getMissingBlocks(
      lastRelayBlock.relayChainBlockHeight,
      endBlock,
      lastRelayBlock.assetABalance,
      lastRelayBlock.assetBBalance
    )

    const newPrimaryDataset =
      filteredDataset?.map(
        ({ assetABalance, assetBBalance, relayChainBlockHeight }) => {
          return getPriceForBlocks(
            math,
            pool,
            relayChainBlockHeight,
            assetABalance,
            assetBBalance
          )
        }
      ) || []

    const secondaryDataset =
      missingBlocks.map(
        ({ assetABalance, assetBBalance, relayChainBlockHeight }) => {
          return getPriceForBlocks(
            math,
            pool,
            relayChainBlockHeight,
            assetABalance,
            assetBBalance
          )
        }
      ) || []

    // We're sorting in query (what is faster?)
    const sortedDataset = primaryDataset.concat(secondaryDataset)

    console.debug(
      'finalDataset',
      sortedDataset,
      newPrimaryDataset,
      secondaryDataset
    )

    setDataset({ primaryDataset: newPrimaryDataset, secondaryDataset })
    setDatasetRefreshing(false)
    setDatasetLoading(false)
  }, [historicalBalancesLoading, historicalBalancesData, assetIds])

  useEffect(() => {
    const lastRecordOutdatedBy = 60000

    if (!isVisible || historicalBalancesLoading || datasetRefreshing) return

    const refetchHistoricalBalancesData = () => {
      if (
        isVisible &&
        !historicalBalancesLoading &&
        !datasetRefreshing &&
        primaryDataset &&
        primaryDataset.length &&
        primaryDataset[primaryDataset.length - 1].x <=
          new Date().getTime() - lastRecordOutdatedBy
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
    primaryDataset,
    isVisible,
    startBlock,
    endOrNow,
    historicalBalancesLoading,
    datasetRefreshing,
    lastBlockData
  ])

  useEffect(() => {
    setDataset(({ primaryDataset, secondaryDataset }) => {
      if (!spotPrice || !primaryDataset || !currentBlock || !currentBlockTime)
        return { primaryDataset, secondaryDataset }

      if (lbpStatus === LbpStatus.NOT_INITIALIZED)
        return { primaryDataset: [], secondaryDataset: [] }

      // TODO: Secondary
      if (lbpStatus === LbpStatus.NOT_STARTED)
        return { primaryDataset: [], secondaryDataset: [] }

      // TODO: Ended
      if (lbpStatus === LbpStatus.ENDED)
        return { primaryDataset, secondaryDataset: [] }

      const accumulating = assetIds.assetIn === pool?.assetInId

      console.warn('DATASETS', primaryDataset, secondaryDataset)

      const newDataPoint: DataPoint = {
        x: blockToTime(endOrNow, {
          height: currentBlock,
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

      if (secondaryDataset.length)
        while (newDataPoint.x > secondaryDataset[0].x) {
          secondaryDataset.shift()
          console.log('Shifting secondary dataset')
        }

      return {
        primaryDataset: [
          ...primaryDataset,
          {
            x: blockToTime(endOrNow, {
              height: currentBlock,
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
        ],
        secondaryDataset
      }
    })
  }, [pool, currentBlock, currentBlockTime, endOrNow, lbpStatus, assetIds])

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
      lbpStatus={lbpStatus}
      lbpChartProps={lbpChartProps}
      isPoolLoading={_isPoolLoading}
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
        <EnhancedTradeChartProps
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
