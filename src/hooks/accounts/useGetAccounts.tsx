import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { find } from 'lodash';
import { useCallback } from 'react';
import { PersistedAccount } from './usePersistActiveAccount';

export const basiliskAddressPrefix = 10041;
export const useGetAccounts = () => useCallback(async (
    persistedActiveAccountId: string | undefined,
    isActive: boolean | undefined
) => {
    // TODO: use `config.appName`
    await web3Enable('basilisk-ui');
    const accounts = (await web3Accounts())
        .map(account => {
            const address = encodeAddress(decodeAddress(account.address), basiliskAddressPrefix)
            return {
                id: address,
                name: account.meta.name,
                isActive: false,
            };
        })
        .map(account => ({
            ...account,
            isActive: persistedActiveAccountId == account.id,
        }))

    console.log('resolving', isActive)


    if (isActive) {
        const account = find(accounts, { isActive: isActive })
        return account;
    }   


    return accounts;
}, []);