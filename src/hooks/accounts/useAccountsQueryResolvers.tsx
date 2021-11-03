import { ApolloCache, NormalizedCacheObject, Resolver } from '@apollo/client';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { find } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useBalanceQueryResolvers } from '../balances/useBalanceQueryResolvers';
import { useResolverToRef } from './useAccountsMutationResolvers';
import { GetAccountByIdQueryResponse, GetAccountByIdQueryVariables, GET_ACCOUNT_BY_ID } from './useGetAccountByIdQuery';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';

export interface AccountsQueryResolverArgs extends GetAccountByIdQueryVariables {
    isActive: boolean
}
export const __typename = 'Account';

export const isActiveFromCache = (cache: ApolloCache<NormalizedCacheObject>, id: string) => {
    const accountData = cache.readQuery<GetAccountByIdQueryResponse>({
        query: GET_ACCOUNT_BY_ID,
        variables: { id }
    });

    return accountData?.account.isActive
}

export const accountsFromCache = (cache: ApolloCache<NormalizedCacheObject>) => {
    const accountsData = cache.readQuery<GetAccountsQueryResponse>({
        query: GET_ACCOUNTS,
    });

    return accountsData?.accounts;
}

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
            
            if (args?.id) {
                return find(accounts, { id: args.id });
            }
    
            if (args?.isActive) {
                const account = find(accounts, { isActive: args.isActive })
                return account;
            }

            return accounts;
        }, [persistedActiveAccount])
    )

    return {
        Query: {
            accounts
        },
        Account: {
            ...useBalanceQueryResolvers()
        }
    }
}