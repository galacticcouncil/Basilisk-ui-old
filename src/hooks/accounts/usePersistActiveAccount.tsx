import { useLocalStorage } from 'react-use';
import { Account } from '../../generated/graphql';
import createPersistedState from 'use-persisted-state';

export const key = 'basilisk-active-account';
export const defaultValue = {
    id: undefined
};
export interface PersistedAccount {
    id: string | undefined
}

// we're not using react-use/useLocalStorage since i couldn't figure out
// why it would not trigger effects when the local storage updates
const usePersistedActiveAccount = createPersistedState(key);
export const usePersistActiveAccount = () => usePersistedActiveAccount<PersistedAccount | undefined>(defaultValue);