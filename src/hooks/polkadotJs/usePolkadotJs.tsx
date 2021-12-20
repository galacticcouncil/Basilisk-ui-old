import { ApiPromise, WsProvider } from '@polkadot/api';
import { useMemo, useState, useEffect } from 'react';
import constate from 'constate';
import { usePersistentConfig } from '../config/usePersistentConfig';
import '@polkadot/api-augment';

const getPoolAccount = {
  description: 'Get pool account id by asset IDs',
  params: [
    {
      name: 'assetInId',
      type: 'u32',
    },
    {
      name: 'assetOutId',
      type: 'u32',
    },
  ],
  type: 'AccountId',
};
const rpc = {
  xyk: {
    getPoolAccount,
  },
  lbp: {
    getPoolAccount,
  },
};

/**
 * Setup an instance of PolkadotJs, and watch
 * for config updates. In case the nodeUrl changes,
 * then re-create the PolkadotJs instance
 */
export const useConfigurePolkadotJs = () => {
  const [{ nodeUrl }] = usePersistentConfig();
  const [apiInstance, setApiInstance] = useState<ApiPromise | undefined>(
    undefined
  );
  const loading = useMemo(() => (apiInstance ? false : true), [apiInstance]);
  const provider = useMemo(() => new WsProvider(nodeUrl), [nodeUrl]);

  // (re-)Create the PolkadotJS instance, when the provider updates.
  useEffect(() => {
    let api: ApiPromise | undefined;

    (async () => {
      setApiInstance(undefined);
      api = await ApiPromise.create({
        provider,
        rpc,
      });
      await api.isReady;
      setApiInstance(api);
    })();

    // when the component using the usePolkadot hook unmounts, disconnect the websocket
    return () => {
      api?.disconnect();
    };
  }, [provider]);

  return { apiInstance, loading };
};

// TODO: lift to context using constate
// export const usePolkadotJs = () => useConfigurePolkadotJs();
export const [PolkadotJsProvider, usePolkadotJsContext] = constate(
  useConfigurePolkadotJs
);
