import { isArray } from 'lodash';
import { useCallback } from 'react';
import { useGetAccounts } from '../useGetAccounts';
import { usePersistActiveAccount } from '../usePersistActiveAccount';
import { useResolverToRef } from '../../apollo/useResolverToRef';

export interface AccountsQueryResolverArgs {
    isActive?: boolean
}

export const __typename = 'Account';

export const useGetAccountsQueryResolver = () => {
    const [persistedActiveAccount] = usePersistActiveAccount();
    const getAccounts = useGetAccounts();

    return useResolverToRef(
        useCallback(async (
            _obj,
            args: AccountsQueryResolverArgs 
        ) => {
            const accounts = await getAccounts(
                persistedActiveAccount?.id,
                args?.isActive,
            );

            // if no results were found, return undefined/null
            // this is useful when un-setting the active account
            if (!accounts) {
                return null;
            };
    
            return isArray(accounts)
                ? accounts.map(account => ({
                    ...account,
                    __typename
                }))
                : ({
                    // just a single account
                    ...accounts,
                    __typename
                })
        }, [
            persistedActiveAccount,
            getAccounts
        ]),
        'accounts'
    )
}