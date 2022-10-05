import { createType } from '@polkadot/types'
import constate from 'constate'
import { useCallback, useEffect, useState } from 'react'
import { LastBlock } from '../../generated/graphql'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { U32 } from '@polkadot/types/primitive'
import { Codec } from '@polkadot/types-codec/types'

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>'
export interface PolkadotPrimitivesV1PersistedValidationData {
  relayParentNumber: number
}

// TODO: lift up using constate
export const useSubscribeNewBlock = () => {
  const { apiInstance, loading } = usePolkadotJsContext()
  const [lastBlock, setLastBlock] = useState<Omit<LastBlock, 'id'>>()
  const [unsubscribe] = useState<() => void | undefined>()

  const subscribeNewBlocks = useCallback(async () => {
    if (!apiInstance || loading) return
    await apiInstance.queryMulti(
      [
        apiInstance.query.system.number,
        apiInstance.query.parachainSystem.validationData,
        apiInstance.query.timestamp.now
      ],
      ([number, validationData, time]) => {
        const data =
          validationData.toJSON() as unknown as PolkadotPrimitivesV1PersistedValidationData
        const blockNumber = createType(
          apiInstance.registry,
          'BlockNumber',
          number
        )
        const timestamp = createType(apiInstance.registry, 'Moment', time)

        setLastBlock({
          parachainBlockNumber: blockNumber.toNumber(),
          relaychainBlockNumber: data.relayParentNumber,
          createdAt: timestamp.toNumber()
        })
      }
    )
  }, [apiInstance, loading])

  useEffect(() => {
    if (loading) return
    subscribeNewBlocks()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [loading, subscribeNewBlocks, unsubscribe])

  return lastBlock
}

export const [LastBlockProvider, useLastBlockContext] =
  constate(useSubscribeNewBlock)
