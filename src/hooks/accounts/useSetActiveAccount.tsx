import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useCallback } from 'react';
import { usePersistActiveAccount } from './usePersistActiveAccount';

export const useSetActiveAccount = () => {
  const [, setPersistedActiveAccount] = usePersistActiveAccount();

  return useCallback(
    async (
      client: ApolloClient<NormalizedCacheObject>,
      address: string | undefined
    ) => {
      // const accountsData = client.cache?.readQuery<GetAccountsQueryResponse>({
      //   query: GET_ACCOUNTS,
      // });

      console.log('setPersistedActiveAccount', client.cache);

      // if (!accountsData?.accounts) return;
      // const accounts = accountsData.accounts;

      // const accounts = accountsData.accounts.map((account) => ({
      //   ...account,
      //   isActive: account.id === address,
      // }));

      // const activeAccount = find(accounts, { id: address });
      console.log('setPersistedActiveAccount', address);
      setPersistedActiveAccount({
        id: address,
      });

      // TODO: return the data to be mutated from the mutation instead
      // client.cache?.writeQuery<GetAccountsQueryResponse>({
      //     query: GET_ACCOUNTS,
      //     data: { accounts, lastBlock: accountsData.lastBlock }
      // });

      // accounts.forEach((account) => {
      //   client.cache.modify({
      //     id: client.cache.identify({
      //       __typename: account.__typename,
      //       id: account.id,
      //     }),
      //     fields: {
      //       isActive: (_) => account.isActive,
      //     },
      //   });
      // });

      // wait for the local storage changes before finishing the mutation
      // TODO: find a better way to wait until the local storage changes are
      // propagated to the resolverRef
      await new Promise((resolve) => setTimeout(resolve, 0));

      return true;
    },
    [setPersistedActiveAccount]
  );
};
