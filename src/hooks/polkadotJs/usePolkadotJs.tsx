import { ApiPromise, WsProvider, HttpProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { useMemo, useState, useEffect } from 'react';
import constate from 'constate';
import typesConfig from './typesConfig';
import { usePersistentConfig } from '../config/usePersistentConfig';
import { types as ormlTypes, typesAlias as ormlTypesAlias } from '@open-web3/orml-type-definitions'

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
};
const rpc = {
  xyk: {
    getPoolAccount  
  },
  lbp: {
    getPoolAccount
  }
}

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

  const types = useMemo(() => ({
    ...typesConfig.types[0],
    ...ormlTypes,
  }), []);

  const typesAlias = useMemo(() => ({
    ...typesConfig.alias,
    ...ormlTypesAlias
  }), []);

  // (re-)Create the PolkadotJS instance, when the provider updates.
  useEffect(() => {
    (async () => {
      setApiInstance(undefined);
      const api = await ApiPromise.create({
        provider,
        types,
        typesAlias,
        rpc
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