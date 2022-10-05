import { Dispatch } from 'react'
import createPersistedState from 'use-persisted-state'
import { Config } from '../../generated/graphql'

const key = 'basilisk-config'
export const defaultConfigValue: Config = {
  nodeUrl: process.env.REACT_APP_NODE_URL!,
  processorUrl: process.env.REACT_APP_PROCESSOR_URL!,
  appName: process.env.REACT_APP_APP_NAME!,
  valueDisplayAsset: process.env.REACT_APP_DISPLAY_VALUE_ASSET_ID!
}

// TODO: write apollo integration for querying and mutating the config
const createPersistedConfig = createPersistedState(key)

export const usePersistentConfig = (): {
  persistedConfig: Config
  setPersistedConfig: Dispatch<Config>
} => {
  const [persistedConfig, setPersistedConfig] = createPersistedConfig(
    defaultConfigValue
  )

  return { persistedConfig: persistedConfig as Config, setPersistedConfig }
}
