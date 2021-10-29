import { gql, useQuery, makeVar, useLazyQuery } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Resolver, LazyQueryHookOptions, QueryHookOptions, useReactiveVar, QueryResult } from '@apollo/client'
import {
    web3Accounts
  } from '@polkadot/extension-dapp';
import { usePersistActivePolkadotJsAccount } from '../polkadotJs/extension/accounts/usePersistActivePolkadotJsAccount';

type resolve = (value: unknown) => void;
// TODO: useResolver isn't typed correctly
export const useDedupeResolver = (useResolver: Resolver) => {
    let [resolveAll, setResolveAll] = useState<resolve[]>([]);
    let { resolver, state } = useResolver();
    const [activePolkadotJsAccount] = usePersistActivePolkadotJsAccount();

    
    const dedupedResolver: Resolver = async (obj, args, context) => {
        if (!resolveAll.length) {
            return await new Promise(async (resolve) => {
                setResolveAll(resolveAll => [...resolveAll, resolve])
                await resolver(obj, args, context);
                resolveAll.forEach(resolve => resolve(state));

            });
        } else {
            return await new Promise((resolve) => (
                setResolveAll(resolveAll => [...resolveAll, resolve])
            ));
        }
    };

    useEffect(() => {
        // don't run the effect in case the state changed,
        // but there are no promises to resolve
        if (resolveAll.length === 0) return;
        resolveAll.forEach(resolve => resolve(state));
        resolveAll = [];
    }, [state])

    return dedupedResolver;
}