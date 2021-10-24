import { useApollo } from './useApollo';
import { ApolloClient, NormalizedCacheObject, HttpLink, gql, ApolloProvider } from '@apollo/client';
import { RenderHookResult, Renderer, renderHook } from '@testing-library/react-hooks';
import { Config, defaultConfig } from '../config/useConfig';
import { useGetConfigQuery } from '../config/useConfigQueries';
import { act } from '@testing-library/react';
import { has } from 'lodash';

type HookReturn = ApolloClient<NormalizedCacheObject>
let renderHookResult: RenderHookResult<unknown, HookReturn, Renderer<unknown>>;
let result = () => renderHookResult.result;
let client = () => result().current

beforeEach(() => {
    renderHookResult = renderHook(() => useApollo());
});

test('provides a preconfigured apollo client', () => {
    const clientURI = (client().link as HttpLink).options.uri;
    expect(client() instanceof ApolloClient).toBeTruthy();
    expect(clientURI).toEqual(defaultConfig.processorUrl);
})

test('has all the required local resolvers', () => {
    // TODO: can this be typed better?
    const resolvers = (client() as any).localState.resolvers.Query;
    const expectedResolvers = ['config'];
    
    expectedResolvers.map(resolver => 
        expect(has(resolvers, resolver))
    );
});