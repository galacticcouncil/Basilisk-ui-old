import { useApollo } from './../apollo/useApollo';
import { ApolloClient, NormalizedCacheObject, HttpLink, gql, ApolloProvider, useQuery } from '@apollo/client';
import { RenderHookResult, Renderer, renderHook } from '@testing-library/react-hooks';
import { Config, defaultConfig } from '../config/useConfig';
import { useGetConfigQuery } from '../config/useConfigQueries';
import { act } from '@testing-library/react';
import { umask } from 'process';

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

test('resolves config from a local resolver', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useGetConfigQuery(), {
        wrapper: queryTestWrapper(client)
    });

    await waitForNextUpdate();
    
    expect(result.current.data?.config).toEqual(defaultConfig);
})