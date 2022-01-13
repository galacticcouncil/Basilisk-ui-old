import { useCallback } from 'react';
import { useGetAccounts } from '../useGetAccounts';
import { useResolverToRef } from './useAccountsMutationResolvers';

export const __typename = 'Account';

export const useGetAccountsQueryResolver = () => {
  const getAccounts = useGetAccounts();

  return useResolverToRef(
    useCallback(
      async (_obj) => {
        const accounts = await getAccounts();

        // if no results were found, return undefined/null
        // this is useful when un-setting the active account
        if (!accounts) {
          return null;
        }

        return accounts.map((account) => ({
          ...account,
          __typename,
        }));
      },
      [getAccounts]
    ),
    'accounts'
  );
};
