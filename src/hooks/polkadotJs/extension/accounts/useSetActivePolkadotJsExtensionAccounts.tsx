import { ApolloCache, NormalizedCacheObject, useApolloClient } from '@apollo/client'
import { find } from 'lodash';
import { useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { PolkadotJsExtensionAccount } from '../../../../generated/graphql';
import { normalizeAddress } from './useGetPolkadotJsExtensionAccounts';
import { usePersistActivePolkadotJsAccount } from './usePersistActivePolkadotJsAccount';

export const identifyCacheId = (cache: ApolloCache<object>) => (
    cache.identify({
        __typename: 'Query',
        id: 'polkadotExtensionAccounts'
    })
)

export const useSetActivePolkadotJsExtensionAccount = () => {
    const [activePolkadotJsAccount, setActivePolkadotJsAccount] = usePersistActivePolkadotJsAccount();
    const setActivePolkadotJsExtensionAccount = useCallback((id: string, cache: ApolloCache<object>) => {
        cache.modify({
            id: identifyCacheId(cache),
            // TODO: how do to this in a type safe manner?
            fields: {
                polkadotExtensionAccounts: (polkadotJsExtensionAccounts: PolkadotJsExtensionAccount[]) => {
                    const modifiedPolkadotJsExtensionAccounts = polkadotJsExtensionAccounts
                        .map(polkadotJsExtensionAccount => ({
                            ...polkadotJsExtensionAccount,
                            isSelected: polkadotJsExtensionAccount.id === id
                        }));
                    
                    // TODO: just use the ID from the args?
                    const activePolkadotJsAccount = find(modifiedPolkadotJsExtensionAccounts, { isSelected: true });

                    // deliberately persist only the account id, we want to get the rest of the information fresh from the extension
                    if (activePolkadotJsAccount) setActivePolkadotJsAccount({
                        id: normalizeAddress(activePolkadotJsAccount.id)
                    });

                    return modifiedPolkadotJsExtensionAccounts;
                }
            }
        });

    }, [setActivePolkadotJsAccount, activePolkadotJsAccount]);

    return setActivePolkadotJsExtensionAccount;
}