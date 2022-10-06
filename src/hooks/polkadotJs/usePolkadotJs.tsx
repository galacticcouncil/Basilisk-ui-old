import {
  types as ormlTypes,
  typesAlias as ormlTypesAlias
} from '@open-web3/orml-type-definitions'
import { ApiPromise, WsProvider } from '@polkadot/api'
import constate from 'constate'
import log from 'loglevel'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUnmount } from 'react-use'
import { usePrevious } from 'use-hooks'
import { usePersistentConfig } from '../config/usePersistentConfig'

const getPoolAccount = {
  description: 'Get pool account id by asset IDs',
  params: [
    {
      name: 'assetInId',
      type: 'u32'
    },
    {
      name: 'assetOutId',
      type: 'u32'
    }
  ],
  type: 'AccountId'
}
export const rpc = {
  xyk: {
    getPoolAccount
  },
  lbp: {
    getPoolAccount
  }
}

export const types = {
  //...typesConfig.types[0],
  ...ormlTypes
}

export const typesAlias = {
  //...typesConfig.alias,
  ...ormlTypesAlias
}

/**
 * Setup an instance of PolkadotJs, and watch
 * for config updates. In case the nodeUrl changes,
 * then re-create the PolkadotJs instance
 */
export const useConfigurePolkadotJs = () => {
  const {
    persistedConfig: { nodeUrl }
  } = usePersistentConfig()
  const [apiInstance, setApiInstance] = useState<ApiPromise | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(false)
  const provider = useMemo(() => new WsProvider(nodeUrl), [nodeUrl])
  const previousProvider = usePrevious(provider)

  const createApiInstance = useCallback(() => {
    setLoading(true)
    log.debug(
      'useConfigurePolkadotJs',
      'createApiInstance',
      'creating a new instance',
      provider
    )
    ;(async () => {
      const apiInstance = new ApiPromise({
        provider,
        types,
        typesAlias,
        rpc
      })
      setApiInstance(apiInstance)
    })()
  }, [provider])

  const destroyApiInstance = useCallback(async () => {
    log.debug(
      'useConfigurePolkadotJs',
      'destroyApiInstance',
      'destroying the instance'
    )
    await apiInstance?.disconnect()
    setApiInstance(undefined)
    log.debug(
      'useConfigurePolkadotJs',
      'destroyApiInstance',
      'instance destroyed'
    )
  }, [apiInstance])

  // if there is no apiInstance, then create one
  useEffect(() => {
    if (apiInstance) return
    log.debug('useConfigurePolkadotJs', 'creating a new instance', apiInstance)
    createApiInstance()
  }, [createApiInstance, apiInstance])

  /**
   * Loading status is handled separately from instance creation
   */
  useEffect(() => {
    // only start waiting for an api instance to be ready, if its connected to the node
    // if (!loading || !apiInstance?.isConnected) return;
    if (!loading || !apiInstance) return
    ;(async () => {
      log.debug('useConfigurePolkadotJs', 'waiting to be ready')
      // TODO: what happens here when a new apiInstance is created
      // while we're still listening to the `isReady` status on an old instance?
      // possible memory leak ^^
      await apiInstance?.isReady
      log.debug('useConfigurePolkadotJs', 'instance is ready')
      setLoading(false)
    })()
  }, [apiInstance, loading])

  // if the provider changes, then destroy the existing instance
  useEffect(() => {
    if (previousProvider === provider || !apiInstance) return
    ;(async () => {
      log.debug(
        'useConfigurePolkadotJs',
        'provider has changed, recreating instance'
      )
      await destroyApiInstance()
    })()
  }, [
    apiInstance,
    previousProvider,
    provider,
    destroyApiInstance,
    createApiInstance
  ])

  // when the component unmounts, destroy the api instance
  useUnmount(() => {
    log.debug('useConfigurePolkadotJs', 'unmounting')
    destroyApiInstance()
  })
  return { apiInstance, loading }
}

export const [PolkadotJsProvider, usePolkadotJsContext] = constate(
  useConfigurePolkadotJs
)
