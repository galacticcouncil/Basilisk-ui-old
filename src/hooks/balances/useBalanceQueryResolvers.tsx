import { useCallback } from 'react'
import { Account } from '../../generated/graphql';
import { useResolverToRef } from '../accounts/useAccountsMutationResolvers'
import { useGetBalancesByAddress } from './useGetBalancesByAddress';

export const useBalanceQueryResolvers = () => {
    const getBalancesByAddress = useGetBalancesByAddress();
    const balances = useResolverToRef(
        useCallback(
            async (account: Account) => await getBalancesByAddress(account.id), 
            [getBalancesByAddress]
        ),
        'balances'
    );

    return {
        balances
    }
}