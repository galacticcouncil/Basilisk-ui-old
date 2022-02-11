import { useCallback } from 'react';
import { Account } from '../../../../generated/graphql';
import { GET_ACCOUNTS } from '../../queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../lib/usePersistActiveAccount';
import { find } from 'lodash';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { withErrorHandler } from '../../../apollo/withErrorHandler';

// make sure the __typename is well typed
export const __typename: Account['__typename'] = 'Account';

// helper function to decorate the extension entity for normalised caching
const withTypename = (account: Account) => ({
  __typename,
  ...account,
});

export const useActiveAccountQueryResolver = () => {
  const [persistedActiveAccount] = usePersistActiveAccount();

  return {
    activeAccount: withErrorHandler(
      useCallback(
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
            const activeAccount = find(accountsData?.accounts, {
              id: persistedActiveAccount?.id,
            });

            return activeAccount ? withTypename(activeAccount) : null;
          } else {
            return null;
          }
        },
        [persistedActiveAccount]
      ),
      'useActiveAccountQueryResolver'
    ),
  };
};
