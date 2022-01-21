import { useCallback } from 'react';
import { Account } from '../../../../generated/graphql';
import { useResolverToRef } from '../useAccountsMutationResolvers';
import { GET_ACCOUNTS } from '../../queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../usePersistActiveAccount';
import { find } from 'lodash';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

// make sure the __typename is well typed
export const __typename: Account['__typename'] = 'Account';

// helper function to decorate the extension entity for normalised caching
const withTypename = (account: Account) => ({
  __typename,
  ...account,
});

export const useSelectedAccountQueryResolver = () => {
  const [persistedActiveAccount] = usePersistActiveAccount();

  return {
    selectedAccount: useResolverToRef(
      useCallback(
        // () => {
        async (
          _obj,
          _args,
          { client }: { client: ApolloClient<NormalizedCacheObject> }
        ) => {
          if (persistedActiveAccount?.id) {
            const { data: accountsData } = await client.query({
              query: GET_ACCOUNTS,
              notifyOnNetworkStatusChange: true,
            });
            const selectedAccount = find(accountsData?.accounts, {
              id: persistedActiveAccount?.id,
            });

            return withTypename(selectedAccount);
          } else {
            return null;
          }
        },
        [persistedActiveAccount]
      ),
      'useSelectedAccountQueryResolver'
    ),
  };
};
