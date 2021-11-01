import createPersistedState from 'use-persisted-state';
import { Config } from '../../generated/graphql';
const key = 'basilisk-config';
const defaultValue = {
    nodeUrl: 'ws://localhost:9988',
    processorUrl: '/graphql'
}
// TODO: write apollo integration for querying and mutating the config
const usePersistedConfig = createPersistedState(key)
export const usePersistentConfig = () => usePersistedConfig<Config>(defaultValue);