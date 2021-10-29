import { web3Accounts, } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { act } from '@testing-library/react-hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { PolkadotJsExtensionAccount } from '../../../../generated/graphql';
import { usePersistActivePolkadotJsAccount } from './usePersistActivePolkadotJsAccount';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';

// use the polkadot address format as 'the default' for comparing accounts when their target network changes (in the extension)
export const normalizeAddress = (address: string) => address ? encodeAddress(decodeAddress(address), 1) : address;

export const useGetPolkadotExtensionAccounts = () => {
    const [polkadotExtensionAccounts, setPolkadotExtensionAccounts] = useState<PolkadotJsExtensionAccount[]>([]);
    const [activePolkadotJsAccount] = usePersistActivePolkadotJsAccount();

    const getPolkadotExtensionAccounts = async () => {
        const allAccounts: PolkadotJsExtensionAccount[] = (await web3Accounts())
            .map((account: InjectedAccountWithMeta) => {
                const address = normalizeAddress(account.address);
                return ({
                    id: address,
                    address: address,
                    alias: account.meta.name,
                    // TODO: transform into account network
                    network: account.meta.genesisHash,
                    isSelected: false,
                })
            })
            .map((account: PolkadotJsExtensionAccount) => ({
                ...account,
                // if the account.id matches the persisted account id, mark is as selected
                isSelected: normalizeAddress(account.id) === activePolkadotJsAccount?.id
            }))

        setPolkadotExtensionAccounts(() => allAccounts);
    };

    /**
     * IMPORTANT
     * 
     * It is crucial to wrap the resolver with useRef (a.k.a. var).
     * 
     * Since the apollo client can only work with an updated hook-like variables within the resolver
     * itself, when the ref to the resolver function updates.
     */
    const resolverContainer = useRef(getPolkadotExtensionAccounts)

    useEffect(() => {
        resolverContainer.current = getPolkadotExtensionAccounts
    }, [activePolkadotJsAccount])

    return { getPolkadotExtensionAccounts: async () => await resolverContainer.current(), polkadotExtensionAccounts };
}