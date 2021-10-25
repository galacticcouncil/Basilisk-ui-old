import { ApolloClient, NormalizedCacheObject, HttpLink, gql, ApolloProvider } from '@apollo/client';
import { RenderHookResult, Renderer, renderHook } from '@testing-library/react-hooks';
import { Config, defaultConfig } from '../config/useConfig';
import { useGetConfigQuery } from '../config/useConfigQueries';
import { act } from '@testing-library/react';
import { has } from 'lodash';
import { usePolkadotJs } from './usePolkadotJs';
import { ApiPromise } from '@polkadot/api';

type HookReturn = ApiPromise | undefined | any;
let renderHookResult: RenderHookResult<unknown, HookReturn, Renderer<unknown>>;
const timeout = 30000;

beforeEach(() => {
    renderHookResult = renderHook(() => usePolkadotJs());
});

// this test relies on a live node websocket to be configured in the default config
// TODO: mock the websocket for polkadotjs
test('configures a polkadot instance', async () => {
    const { result, waitForNextUpdate } = renderHookResult;
    await waitForNextUpdate({
        timeout
    });
    expect(result.current.apiInstance instanceof ApiPromise).toBeTruthy();
});