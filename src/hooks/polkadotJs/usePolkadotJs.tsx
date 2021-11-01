import { ApiPromise, WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { useMemo, useState, useEffect } from 'react';
import constate from 'constate';
import typesConfig from './typesConfig';
import { usePersistentConfig } from '../config/usePersistentConfig';




/**
 * Setup an instance of PolkadotJs, and watch
 * for config updates. In case the nodeUrl changes,
 * then re-create the PolkadotJs instance
 */
export const useConfigurePolkadotJs = () => {
  const [{ nodeUrl }] = usePersistentConfig();
  const [apiInstance, setApiInstance] = useState<ApiPromise | undefined>(undefined);
  const loading = useMemo(() => apiInstance ? false : true, [apiInstance]);

  const provider = useMemo(() => new WsProvider(nodeUrl), [nodeUrl]);

  // (re-)Create the PolkadotJS instance, when the provider updates.
  useEffect(() => {
    (async () => {
      setApiInstance(undefined);
      const api = await ApiPromise.create({
        provider,
        types: typesConfig.types[0],
        typesAlias: typesConfig.alias
      });
      await api.isReady;
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
// export const usePolkadotJs = () => useConfigurePolkadotJs();
export const [PolkadotJsProvider, usePolkadotJsContext] = constate(useConfigurePolkadotJs);