import { useConfig } from '../config/useConfig'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { useMemo, useState, useEffect} from 'react';

/**
 * Setup an instance of PolkadotJs, and watch
 * for config updates. In case the nodeUrl changes,
 * then re-create the PolkadotJs instance
 */
export const useConfigurePolkadotJs = () => {
    const { config } = useConfig();
    const [apiInstance, setApiInstance] = useState<ApiPromise | undefined>(undefined);
    const loading = useMemo(() => apiInstance ? false : true, [apiInstance]);

    // Update the provider URL, when the `config.nodeUrl` changes
    const provider = useMemo(() => (
        new WsProvider(config.nodeUrl)
    ), [config.nodeUrl]);

    // (re-)Create the PolkadotJS instance, when the provider updates.
    useEffect(() => {
        (async () => {
            setApiInstance(undefined);
            const api = await ApiPromise.create({ provider });
            setApiInstance(api);
        })();
        
        // when the component using the usePolkadot hook unmounts, disconnect the websocket
        return () => {
            apiInstance?.disconnect();
        };
    }, [provider]);

    return { apiInstance, loading };
};

// TODO: lift to context using constate
export const usePolkadotJs = () => useConfigurePolkadotJs();