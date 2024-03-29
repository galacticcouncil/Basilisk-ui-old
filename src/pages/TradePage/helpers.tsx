import BigNumber from 'bignumber.js'
import { LbpPool } from '../../generated/graphql'
import { HistoricalBalance } from '../../hooks/balances/queries/useGetHistoricalBalancesQuery'
import { fromPrecision12 } from '../../hooks/math/useFromPrecision'
import { HydraDxMath } from '../../hooks/math/useMath'
import { calculateCurrentAssetWeight } from '../../hooks/pools/lbp/calculateCurrentAssetWeight'
import { calculateSpotPrice } from '../../hooks/pools/lbp/calculateSpotPrice'
import { blockToTime } from '../../misc/utils/blockTime'

export const keepRecords = 50

export const getMissingIndexes = (
  startBlock: number,
  endBlock: number,
  poolId: string
): string[] => {
  const missingIndexes = []
  const missingBlocksAmount = endBlock - startBlock
  const divisionMultiplier =
    missingBlocksAmount < keepRecords
      ? 1
      : Math.floor(missingBlocksAmount / keepRecords)

  for (let i = startBlock; i < endBlock; i++) {
    if (
      i % divisionMultiplier === 0 ||
      (i === startBlock && i % divisionMultiplier !== 0) ||
      (i === endBlock && i % divisionMultiplier !== 0)
    ) {
      missingIndexes.push(poolId + '-' + i)
    }
  }

  return missingIndexes
}

export const getMissingBlocks = (
  startBlock: number,
  endBlock: number,
  assetABalance: string,
  assetBBalance: string
): HistoricalBalance[] => {
  const missingBlocksAmount = endBlock - startBlock
  const divisionMultiplier =
    missingBlocksAmount < keepRecords
      ? 1
      : Math.floor(missingBlocksAmount / keepRecords)

  const missingBlocks: HistoricalBalance[] = []

  for (let i = startBlock; i < endBlock; i++) {
    if (
      i % divisionMultiplier === 0 ||
      i === startBlock ||
      i === endBlock - 1
    ) {
      missingBlocks.push({
        assetABalance,
        assetBBalance,
        relayChainBlockHeight: i
      })
    }
  }

  return missingBlocks
}

export const getPriceForBlocks = (
  math: HydraDxMath,
  pool: LbpPool,
  relayChainBlockHeight: number,
  assetABalance: string,
  assetBBalance: string,
  currentBlock: number,
  currentBlockTime: number
) => {
  const startBlock = pool.startBlock
  const endBlock = pool.endBlock
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
        yAsString: new BigNumber(fromPrecision12(spotPrice.inOut)).toFixed(6)
      }
    })()
  }
}
