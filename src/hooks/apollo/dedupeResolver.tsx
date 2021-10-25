import { gql, useQuery, makeVar, useLazyQuery } from '@apollo/client';
import { PolkadotJsExtensionAccount } from '../../generated/graphql';
import { useMemo } from 'react';
import { Resolver, LazyQueryHookOptions, QueryHookOptions, useReactiveVar, QueryResult } from '@apollo/client'
import {
    web3Accounts
  } from '@polkadot/extension-dapp';

/**
 * Helper to prevent simultaneous/duplicate execution of the given query resolver
 */
 export const dedupeResolver = (resolver: Resolver) => {
    let resolveAll: any[] = [];
    const dedupedResolver: Resolver = async (obj, args, context) => {
        if (!resolveAll.length) {
            return await new Promise(async (resolve) => {
                resolveAll.push(resolve);
                const result = await resolver(obj, args, context);

                resolveAll.forEach(resolve => resolve(result));
                resolveAll = [];
            });
        } else {
            return await new Promise((resolve) => resolveAll.push(resolve));
        }
    }
    return {
        dedupedResolver,
        loading: () => resolveAll.length > 0
    };
}