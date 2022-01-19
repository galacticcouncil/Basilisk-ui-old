import { useCallback } from 'react';
import { Account } from '../../../../generated/graphql';
import { useResolverToRef } from '../useAccountsMutationResolvers';
import { GET_ACCOUNTS } from '../../queries/useGetAccountsQuery';
import { usePersistActiveAccount } from '../../usePersistActiveAccount';
import { find } from 'lodash';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

// make sure the __typename is well typed
export const __typename: Account['__typename'] = 'Account';

export const useSelectedAccountQueryResolver = () => {
  const [persistedActiveAccount] = usePersistActiveAccount();

  return useResolverToRef(
    useCallback(
      // () => {
      async (
        _obj,
        args: any,
        { client }: { client: ApolloClient<NormalizedCacheObject> }
      ) => {
        if (persistedActiveAccount?.id) {
          console.log('persistedActiveAccount', persistedActiveAccount?.id);

          const { data: accountsData } = await client.query({
            query: GET_ACCOUNTS,
            notifyOnNetworkStatusChange: true,
          });
          console.log('accounts list', accountsData?.accounts);
          const selectedAccount = find(accountsData?.accounts, {
            id: persistedActiveAccount?.id,
          });
          console.log('selected account', selectedAccount);

          return {
            selectedAccount,
            id: selectedAccount.id,
            __typename,
          };
        } else return null;
      },
      [persistedActiveAccount]
    ),
    'useSelectedAccountQueryResolver'
  );
};
