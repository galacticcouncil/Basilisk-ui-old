import { useCallback } from 'react';
import { GET_ACCOUNTS } from '../../queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../lib/usePersistActiveAccount';
import { find } from 'lodash';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { withErrorHandler } from '../../../apollo/withErrorHandler';
import { withTypename } from '../../types';
import { Account } from '../../../../generated/graphql';

export const useActiveAccountQueryResolver = () => {
  const [persistedActiveAccount] = usePersistActiveAccount();

  return {
    activeAccount: withErrorHandler(
      useCallback(
        async (
          _obj,
          _args,
          { client }: { client: ApolloClient<NormalizedCacheObject> }
        ): Promise<Account | null> => {
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
      'activeAccount'
    ),
  };
};
