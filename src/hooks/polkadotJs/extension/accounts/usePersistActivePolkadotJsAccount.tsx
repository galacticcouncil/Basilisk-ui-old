import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { PolkadotJsExtensionAccount } from '../../../../generated/graphql';
import createPersistedState from 'use-persisted-state';

const localStorageKey = 'active-polkadot-js-extension-account';

export const usePersistActivePolkadotJsAccount = () => (
    useLocalStorage<Partial<PolkadotJsExtensionAccount> | undefined>(localStorageKey, undefined)
)