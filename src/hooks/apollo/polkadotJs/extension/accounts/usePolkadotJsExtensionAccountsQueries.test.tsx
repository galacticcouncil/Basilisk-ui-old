import { useApollo } from '../../../useApollo';
import { ApolloClient, NormalizedCacheObject, HttpLink, gql, ApolloProvider, useQuery } from '@apollo/client';
import { RenderHookResult, Renderer, renderHook } from '@testing-library/react-hooks';
import { Config, defaultConfig } from '../../../../config/useConfig';
import { useGetConfigQuery } from '../../../../config/useConfigQueries';
import { act } from '@testing-library/react';
import { umask } from 'process';
import { useGetPolkadotExtensionAccountsQuery } from './usePolkadotJsExtensionAccountsQueries';

export const queryTestWrapper = (client: () => HookReturn) => ({ children }: any) => (
    <ApolloProvider client={client()}>{children}</ApolloProvider>
)

type HookReturn = ApolloClient<NormalizedCacheObject>
let renderHookResult: RenderHookResult<unknown, HookReturn, Renderer<unknown>>;
let result = () => renderHookResult.result;
let client = () => result().current

beforeEach(() => {
    renderHookResult = renderHook(() => useApollo());
});

test.only('resolves extension accounts from a local resolver', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useGetPolkadotExtensionAccountsQuery(), {
        wrapper: queryTestWrapper(client)
    });

    await waitForNextUpdate({
        timeout: 10000
    });

    expect(result.current.data?.polkadotExtensionAccounts).toEqual([])
}, 10000);