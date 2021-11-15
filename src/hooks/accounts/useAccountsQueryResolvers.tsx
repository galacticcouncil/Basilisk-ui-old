import { ApolloCache, NormalizedCacheObject, Resolver } from '@apollo/client';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { find, isArray } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useBalanceQueryResolvers } from '../balances/useBalanceQueryResolvers';
import { useResolverToRef } from './useAccountsMutationResolvers';
import { GetAccountsQueryResponse, GET_ACCOUNTS } from './useGetAccountsQuery';
import { usePersistActiveAccount } from './usePersistActiveAccount';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { useVestingScheduleQueryResolvers } from '../vesting/useVestingScheduleQueryResolvers';
import { useGetAccounts } from './useGetAccounts';
import { useGetAccountsResolver } from './useGetAccountsResolver';

export const useAccountsQueryResolvers = () => {    
    const getAccountsResolver = useGetAccountsResolver();
    const accounts: Resolver = useResolverToRef(
        useCallback(getAccountsResolver, [getAccountsResolver]),
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