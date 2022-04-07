import { Dispatch } from 'react';
import createPersistedState from 'use-persisted-state';

export interface Account {
  id: string | undefined;
}
export const key = 'basilisk-active-account';
export const defaultValue: Account = {
  id: undefined,
};

// we're not using react-use/useLocalStorage since i couldn't figure out
// why it would not trigger effects when the local storage updates
const createPersistedActiveAccount = createPersistedState(key);

export const usePersistActiveAccount = (): {
  persistedActiveAccount: Account;
  setPersistedActiveAccount: Dispatch<Account>;
} => {
  const [persistedActiveAccount, setPersistedActiveAccount] =
    createPersistedActiveAccount(defaultValue);

  return {
    persistedActiveAccount: persistedActiveAccount as Account,
    setPersistedActiveAccount,
  };
};
