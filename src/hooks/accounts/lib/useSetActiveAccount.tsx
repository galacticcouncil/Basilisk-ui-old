import { useCallback } from 'react';
import { usePersistActiveAccount } from './usePersistActiveAccount';

export const useSetActiveAccount = () => {
  const { setPersistedActiveAccount } = usePersistActiveAccount();

  return useCallback(
    async (address: string | undefined) => {
      setPersistedActiveAccount({
        id: address,
      });

      // wait for the local storage changes before finishing the mutation
      // TODO: find a better way to wait until the local storage changes are
      // propagated to the resolverRef
      await new Promise((resolve) => setTimeout(resolve, 0));

      return true;
    },
    [setPersistedActiveAccount]
  );
};
