import { useCallback } from 'react';
import { useGetAccounts } from '../../lib/useGetAccounts';
import { useResolverToRef } from '../mutation/useAccountsMutationResolvers';
import { Account } from '../../../../generated/graphql';

export const __typename: Account['__typename'] = 'Account';

const withTypename = (account: Account) => ({
  __typename,
  ...account,
});

export const useGetAccountsQueryResolver = () => {
  const getAccounts = useGetAccounts();

  return {
    accounts: useResolverToRef(
      useCallback(
        async (_obj) => {
          const accounts = await getAccounts();

          // if no results were found, return undefined/null
          // this is useful when un-setting the active account
          if (!accounts) {
            return null;
          }

          return accounts.map((account) => withTypename(account));
        },
        [getAccounts]
      ),
      'accounts'
    ),
  };
};
