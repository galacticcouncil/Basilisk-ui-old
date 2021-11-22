import { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useCallback } from 'react'
import { useResolverToRef } from '../accounts/resolvers/useAccountsMutationResolvers'
import { GetActiveAccountQueryResponse, GET_ACTIVE_ACCOUNT } from '../accounts/queries/useGetActiveAccountQuery';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { gracefulExtensionCancelationErrorHandler, reject, resolve, vestingClaimHandler, withGracefulErrors } from '../vesting/useVestingMutationResolvers';
import { defaultConfigValue, usePersistentConfig } from './usePersistentConfig';
import { SetConfigMutationVariables } from './useSetConfigMutation';

export const defaultAssetId = '0';

export const setCurrencyHandler = (resolve: resolve, reject: reject) => {
    return vestingClaimHandler(resolve, reject);
}

export const useConfigMutationResolvers = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const [_persistedConfig, setPersistedConfig] = usePersistentConfig();

    const setConfig = useResolverToRef(
        useCallback(async (
            _obj,
            args: SetConfigMutationVariables,
            { cache }: { cache: ApolloCache<NormalizedCacheObject> }
        ) => {
            // TODO: error handling?
            if (!apiInstance || loading) return;

            // TODO: return an optimistic update to the cache with the new config
            await withGracefulErrors(async (resolve, reject) => {
                const address = cache.readQuery<GetActiveAccountQueryResponse>({
                    query: GET_ACTIVE_ACCOUNT
                })?.account?.id;

                if (!address) return resolve();

                const { signer } = await web3FromAddress(address);
                
                await apiInstance.tx.multiTransactionPayment.setCurrency(
                    args.config?.feePaymentAsset || defaultAssetId
                )
                    .signAndSend(
                        address,
                        { signer },
                        setCurrencyHandler(resolve, reject)
                    )
            }, [
                gracefulExtensionCancelationErrorHandler
            ]);
            
            const persistableConfig = args.config;
            // there's no point in persisting the feePaymentAsset since it will
            // be refetched from the node anyways
            delete persistableConfig?.feePaymentAsset;
            
            setPersistedConfig(() => persistableConfig || defaultConfigValue);
        }, [apiInstance, loading])
    );

    return {
        setConfig
    }
}