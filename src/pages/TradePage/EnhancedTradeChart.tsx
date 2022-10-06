import BigNumber from 'bignumber.js'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataPoint, Dataset } from '../../components/Chart/LineChart/LineChart'
import {
  ChartGranularity,
  ChartType,
  PoolType
} from '../../components/Chart/shared'
import {
  LbpChartProps,
  TradeChart as LBPTradeChartComponent
} from '../../components/Chart/TradeChart/TradeChart'
import { LbpPool } from '../../generated/graphql'
import {
  GetHistoricalBalancesQueryResponse,
  HistoricalBalance,
  useGetFirstHistoricalBlockQuery,
  useGetHistoricalBalancesExactQuery,
  useGetLastHistoricalBlockQuery
} from '../../hooks/balances/queries/useGetHistoricalBalancesQuery'
import { useLastBlockContext } from '../../hooks/lastBlock/useSubscribeNewBlockNumber'
import { fromPrecision12 } from '../../hooks/math/useFromPrecision'
import { useMath } from '../../hooks/math/useMath'
import { idToAsset } from '../../misc/idToAsset'
import { blockToTime } from '../../misc/utils/blockTime'
import {
  getMissingBlocks,
  getMissingIndexes,
  getPriceForBlocks
} from './helpers'
import './TradePage.scss'

export interface TradeAssetIds {
  assetIn: string | null
  assetOut: string | null
}

export interface EnhancedTradeChartProps {
  pool?: LbpPool
  isPoolLoading?: boolean
  assetIds: TradeAssetIds
  visible: boolean
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

export const REFETCH_INTERVAL = 1000000000000
export const ERROR_REFETCH_INTERVAL = 3000

export const EnhancedTradeChart = ({
  pool,
  assetIds,
  spotPrice,
  visible,
  isPoolLoading
}: EnhancedTradeChartProps) => {
  const { math } = useMath()
  // const isVisible = usePageVisibility()
  const lastBlockData = useLastBlockContext()

  const startBlock = pool?.startBlock || 0
  const endBlock = pool?.endBlock || 0

  const currentRelayBlock = lastBlockData?.relaychainBlockNumber || 0
  const currentParaBlock = useMemo(() => {
    return lastBlockData?.parachainBlockNumber || 0
  }, [lastBlockData])
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

  const [getFirstHistoricalBlockQuery] = useGetFirstHistoricalBlockQuery(
    {
      blockHeight: startBlock,
      poolId: pool?.id || ''
    },
    { skip: !pool?.id || !pool?.startBlock }
  )

  const [getLastHistoricalBlockQuery] = useGetLastHistoricalBlockQuery(
    {
      blockHeight: endBlock,
      poolId: pool?.id || ''
    },
    { skip: !pool?.id || !pool?.endBlock }
  )

  const [getHistoricalBalancesQuery, historicalBalanceQueryNetworkStatus] =
    useGetHistoricalBalancesExactQuery(
      {
        recordIds: []
      },
      {
        skip: !pool?.id || !pool?.startBlock
      }
    )

  const accumulating = useMemo(() => {
    return assetIds.assetIn === pool?.assetInId
  }, [assetIds, pool?.assetInId, pool?.assetOutId])

  // const [firstHistoricalBlock, setFirstHistoricalBlock] = useState<
  //   FirstHistoricalBlock
  // >()

  const [historicalBalancesData, setHistoricalBalanceData] =
    useState<GetHistoricalBalancesQueryResponse>()

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

  ////
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
          !firstBlockData?.firstHistoricalParachainBlock[0] ||
          !lastBlockData?.lastHistoricalParachainBlock[0]
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
    startBlock,
    endBlock,
    currentParaBlock
  ])

  ////
  // Set new historical data and update secondary dataset
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

    setDataset({
      primaryDataset: newPrimaryDataset,
      secondaryDataset: newSecondaryDataset,
      lastRelayBlock
    })
  }, [historicalBalancesData, historicalBalancesLoading, lbpStatus])

  ////
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

    const newDataPoint: DataPoint = {
      x: blockToTime(endOrNow, {
        height: currentRelayBlock,
        date: currentBlockTime
      }),
      y: new BigNumber(
        fromPrecision12(
          (accumulating ? spotPrice.outIn : spotPrice.inOut) || '0'
        )
      ).toNumber(),
      yAsString: new BigNumber(
        fromPrecision12(
          (accumulating ? spotPrice.outIn : spotPrice.inOut) || '0'
        )
      ).toFixed(6)
    }

    if (
      primaryDataset.length &&
      newDataPoint.x === primaryDataset[primaryDataset.length - 1].x
    )
      return

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
  }, [currentParaBlock])

  useEffect(() => {
    setLastHistoricalDataRefetch(Date.now() - REFETCH_INTERVAL + 100)
    setHistoricalBalancesLoading(false)
  }, [pool?.id, pool?.assetInId, pool?.assetOutId])

  refetchHistoricalBalancesData()

  return (
    <LBPTradeChartComponent
      visible={visible}
      assetPair={{
        assetA: idToAsset(accumulating ? assetIds.assetOut : assetIds.assetIn),
        assetB: idToAsset(accumulating ? assetIds.assetIn : assetIds.assetOut)
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
