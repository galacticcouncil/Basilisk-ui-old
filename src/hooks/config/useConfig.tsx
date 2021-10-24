import { useLocalStorage } from 'react-use';
import { makeVar, useReactiveVar } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { isEqual } from 'lodash';
import { Resolver } from 'dns';
import { Config } from '../../generated/graphql';

// re-export the generated config type
export type { Config };
// TODO: get the default config at build time through environment variables or such
export const defaultConfig: Config = {
    processorUrl: '/graphql',
    nodeUrl: 'wss://rpc.polkadot.io'
}

export const localStorageKey = 'config';
export const configVar = makeVar<Config>(defaultConfig);

/**
 * Synchronize between the config reactive var and
 * local storage for persistence
 */
export const useConfig = () => {
    // reactive var used to lift the state for apollo
    const config = useReactiveVar(configVar);
    // config is mainly persisted at the local storage
    const [storedConfig, setStoredConfig] = useLocalStorage(localStorageKey, config);

    useEffect(() => {
        // important enabling condition that limits updates to the reactive var
        if (isEqual(config, storedConfig)) return;
        configVar(storedConfig)
    }, [storedConfig]);

    return { config, setConfig: setStoredConfig };
}

