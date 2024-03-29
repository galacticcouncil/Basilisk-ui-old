import { NetworkStatus } from '@apollo/client'
import { find } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TradeForm } from '../../components/Trade/TradeForm/TradeForm'
import { Balance, XykPool } from '../../generated/graphql'
import { useGetActiveAccountQuery } from '../../hooks/accounts/queries/useGetActiveAccountQuery'
import { useMath } from '../../hooks/math/useMath'
import { useLoading } from '../../hooks/misc/useLoading'
import { useSubmitTradeMutation } from '../../hooks/pools/mutations/useSubmitTradeMutation'
import { useGetPoolByAssetsQuery } from '../../hooks/pools/queries/useGetPoolByAssetsQuery'
import { useGetPoolsQueryProvider } from '../../hooks/pools/queries/useGetPoolsQuery'
import { useAssetIdsWithUrl } from './hooks/useAssetIdsWithUrl'
import './TradePage.scss'

import { useGetActiveAccountTradeBalances } from './queries/useGetActiveAccountTradeBalances'
// import { ConfirmationType, useWithConfirmation } from '../../hooks/actionLog/useWithConfirmation';

import Icon from '../../components/Icon/Icon'
import { getAssetMapsFromPools } from '../../misc/utils/getAssetMap'

export interface TradeAssetIds {
  assetIn: string | null
  assetOut: string | null
}

export interface TradeChartProps {
  pool?: XykPool
  isPoolLoading?: boolean
  assetIds: TradeAssetIds
  spotPrice?: {
    outIn?: string
    inOut?: string
  }
}

// export const TradeChart = ({
//   pool,
//   assetIds,
//   spotPrice,
//   isPoolLoading
// }: TradeChartProps) => {
//   const { math } = useMath()
//   const isVisible = usePageVisibility()
//   const [historicalBalancesRange, setHistoricalBalancesRange] = useState({
//     from: 10000,
//     to: 20000
//   })

//   const [
//     getHistoricalBalancesQuery,
//     networkStatus
//   ] = useGetHistoricalBalancesQuery(
//     {
//       from: historicalBalancesRange.from,
//       to: historicalBalancesRange.to,
//       poolId: pool?.id || ''
//     },
//     {
//       skip: !pool?.id
//     }
//   )

//   const [historicalBalancesData, setHistoricalBalanceData] = useState<
//     GetHistoricalBalancesQueryResponse
//   >()

//   const historicalBalancesLoading = networkStatus.loading

//   const [{ primaryDataset, secondaryDataset }, setDataset] = useState<{
//     primaryDataset: Dataset
//     secondaryDataset: Dataset
//     lastRelayBlock: HistoricalBalance
//   }>({
//     primaryDataset: [],
//     secondaryDataset: [],
//     lastRelayBlock: {
//       assetABalance: '0',
//       assetBBalance: '0',
//       relayChainBlockHeight: 0
//     }
//   })

//   const [dataset, setDataset] = useState<Array<any>>()
//   const [datasetLoading, setDatasetLoading] = useState(true)
//   const [datasetRefreshing, setDatasetRefreshing] = useState(false)

//   const assetOutLiquidity = useMemo(() => {
//     const assetId = assetIds.assetOut || undefined
//     return find<Balance | null>(pool?.balances, { assetId })?.balance
//   }, [pool, assetIds])

//   const assetInLiquidity = useMemo(() => {
//     const assetId = assetIds.assetIn || undefined
//     return find<Balance | null>(pool?.balances, { assetId })?.balance
//   }, [pool, assetIds])

//   useEffect(() => {
//     setDatasetLoading(true)

//     if (historicalBalancesLoading) return

//     if (
//       (!historicalBalancesLoading &&
//         !historicalBalancesData?.historicalBalances?.length) ||
//       !math ||
//       !spotPrice
//     ) {
//       setDataset([])
//       setDatasetLoading(false)
//       return
//     }
//     // const dataset =
//     //   historicalBalancesData?.historicalBalances.map(
//     //     ({ createdAt, assetABalance, assetBBalance }) => {
//     //       return {
//     //         // x: `${moment(createdAt).getTime()}`,
//     //         x: new Date(createdAt).getTime(),
//     //         ...(() => {
//     //           const assetOutLiquidity =
//     //             assetIds.assetOut === historicalBalancesData.XYKPool.assetAId
//     //               ? assetABalance
//     //               : assetBBalance;

//     //           const assetInLiquidity =
//     //             assetIds.assetIn === historicalBalancesData.XYKPool.assetAId
//     //               ? assetABalance
//     //               : assetBBalance;

//     //           const spotPrice = {
//     //             outIn: math.xyk.get_spot_price(
//     //               assetOutLiquidity,
//     //               assetInLiquidity,
//     //               '1000000000000'
//     //             ),
//     //             inOut: math.xyk.get_spot_price(
//     //               assetInLiquidity,
//     //               assetOutLiquidity,
//     //               '1000000000000'
//     //             ),
//     //           };

//     //           const y = new BigNumber(fromPrecision12(spotPrice.inOut) || '');

//     //           return {
//     //             y: y.toNumber(),
//     //             yAsString: fromPrecision12(spotPrice.inOut),
//     //           };
//     //         })(),
//     //       };
//     //     }
//     //   ) || [];

//     // dataset.push({
//     //   // TODO: pretending this is now, should use the time from the lastBlock instead
//     //   x: new Date().getTime(),
//     //   y: new BigNumber(fromPrecision12(spotPrice.inOut) || '').toNumber(),
//     //   yAsString: fromPrecision12(spotPrice.inOut),
//     // });

//     setDataset(dataset)
//     setDatasetRefreshing(false)
//     setDatasetLoading(false)
//   }, [
//     historicalBalancesData?.historicalBalances,
//     historicalBalancesLoading,
//     math,
//     spotPrice,
//     assetIds
//   ])

//   useEffect(() => {
//     const lastRecordOutdatedBy = 60000

//     if (!isVisible || historicalBalancesLoading || datasetRefreshing) return

//     const refetchHistoricalBalancesData = () => {
//       if (
//         isVisible &&
//         !historicalBalancesLoading &&
//         !datasetRefreshing &&
//         (!dataset?.length ||
//           last(dataset).x <= new Date().getTime() - lastRecordOutdatedBy)
//       ) {
//         setDatasetRefreshing(true)
//         setHistoricalBalancesRange({
//           from: 10000,
//           to: 20000
//         })
//       }
//     }

//     refetchHistoricalBalancesData()

//     const refetchData = setInterval(() => {
//       refetchHistoricalBalancesData()
//     }, lastRecordOutdatedBy)

//     return () => clearInterval(refetchData)
//   }, [dataset, isVisible, historicalBalancesLoading, datasetRefreshing])

//   // useEffect(() => {
//   //   setDataset(dataset => {
//   //     if (!spotPrice || !dataset) return dataset;

//   //     return [
//   //       ...dataset,
//   //       {
//   //         // TODO: pretending this is now, should use the time from the lastBlock instead
//   //         x: moment().toISOString(),
//   //         y: fromPrecision12(spotPrice.outIn)
//   //       }
//   //     ]
//   //   })
//   // }, [pool, spotPrice,])

//   const _isPoolLoading = useMemo(() => {
//     if (!isPoolLoading || datasetRefreshing) return false

//     return isPoolLoading || historicalBalancesLoading || datasetLoading
//   }, [
//     datasetRefreshing,
//     datasetLoading,
//     isPoolLoading,
//     historicalBalancesLoading
//   ])

//   return (
//     <TradeChartComponent
//       assetPair={{
//         assetA: idToAsset(assetIds.assetIn),
//         assetB: idToAsset(assetIds.assetOut)
//       }}
//       isPoolLoading={_isPoolLoading}
//       poolType={PoolType.XYK}
//       granularity={ChartGranularity.H24}
//       chartType={ChartType.PRICE}
//       primaryDataset={dataset as any}
//       secondaryDataset={[]}
//       onChartTypeChange={() => {}}
//       onGranularityChange={() => {}}
//     />
//   )
// }

export const TradePage = () => {
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
    useGetPoolsQueryProvider()

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

  const spotPrice = useMemo(() => {
    if (!assetOutLiquidity || !assetInLiquidity || !math) return
    return {
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
          {/* <TradeChart
          pool={pool}
          assetIds={assetIds}
          spotPrice={spotPrice}
          isPoolLoading={
            poolNetworkStatus === NetworkStatus.loading ||
            poolNetworkStatus === NetworkStatus.setVariables ||
            depsLoading
          }
        /> */}
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
            spotPrice={spotPrice}
            onSubmitTrade={handleSubmitTrade}
            tradeLoading={tradeLoading}
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
          <div className="debug">
            <h3>[Trade Page] Debug Box</h3>
            <p>Trade loading: {tradeLoading ? 'true' : 'false'}</p>
            {/* <p>Trade error: {tradeError ? tradeError : '-'}</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
