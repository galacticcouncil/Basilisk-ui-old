import { ApolloCache, NormalizedCacheObject, Resolver } from '@apollo/client';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { find } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useBalanceQueryResolvers } from '../balances/useBalanceQueryResolvers';
import { useResolverToRef } from './useAccountsMutationResolvers';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { useVestingScheduleQueryResolvers } from '../vesting/useVestingScheduleQueryResolvers';

export interface AccountsQueryResolverArgs {
    isActive: boolean
}

export const __typename = 'Account';

export const basiliskAddressPrefix = 10041;
export const useAccountsQueryResolvers = () => {
    const [persistedActiveAccount] = usePersistActiveAccount();
    
    const accounts: Resolver = useResolverToRef(
        useCallback(async (
            _obj,
            args: AccountsQueryResolverArgs | undefined,
        ) => {          
            await web3Enable('basilisk-ui');
            const accounts = (await web3Accounts())
                .map(account => {
                    const address = encodeAddress(decodeAddress(account.address), basiliskAddressPrefix)
                    return {
                        __typename,
                        id: address,
                        name: account.meta.name,
                        isActive: false,
                    };
                })
                .map(account => ({
                    ...account,
                    isActive: persistedActiveAccount?.id == account.id,
                }))

            if (args?.isActive) {
                const account = find(accounts, { isActive: args.isActive })
                return account;
            }

            return accounts;
        }, [persistedActiveAccount]),
        'accounts'
    )

    return {
        Query: {
            accounts
        },
        Account: {
            ...useBalanceQueryResolvers(),
            ...useVestingScheduleQueryResolvers()
        }
    }
}