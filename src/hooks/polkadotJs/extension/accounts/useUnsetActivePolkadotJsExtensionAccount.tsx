import { ApolloCache } from '@apollo/client'
import { useCallback } from 'react'
import { PolkadotJsExtensionAccount } from '../../../../generated/graphql';
import { usePersistActivePolkadotJsAccount } from './usePersistActivePolkadotJsAccount';
import { identifyCacheId } from './useSetActivePolkadotJsExtensionAccounts';

export const useUnsetActivePolkadotJsExtensionAccount = () => {
    const [_activePolkadotJsAccount, _setActivePolkadotJsAccount, unsetActivePolkadotJsAccount] = usePersistActivePolkadotJsAccount();

    const unsetActivePolkadotJsExtensionAccount = useCallback((cache: ApolloCache<object>) => {
        cache.modify({
            id: identifyCacheId(cache),
            // TODO: how do to this in a type safe manner?
            fields: {
                polkadotExtensionAccounts: (polkadotExtensionAccounts: PolkadotJsExtensionAccount[]) => {
                    unsetActivePolkadotJsAccount();
                    return polkadotExtensionAccounts
                        .map(polkadotExtensionAccount => ({
                            ...polkadotExtensionAccount,
                            isSelected: false
                        }))
                }
            }
        });
    }, []);

    return unsetActivePolkadotJsExtensionAccount;
}